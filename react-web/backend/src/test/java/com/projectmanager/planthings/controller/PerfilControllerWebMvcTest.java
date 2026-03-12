package com.projectmanager.planthings.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanager.planthings.auth.AuthSession;
import com.projectmanager.planthings.config.AuthWebConfig;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.dto.PerfilRequest;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PerfilController.class)
@Import({GlobalExceptionHandler.class, AuthWebConfig.class})
@ActiveProfiles("test")
class PerfilControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @MockitoBean
    private PerfilService perfilService;

        private static @NonNull MediaType jsonMediaType() {
                return Objects.requireNonNull(MediaType.APPLICATION_JSON);
        }

    @Test
    void shouldCreatePerfilAndReturn201() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(10L);
        perfil.setEmail("teste@planthings.com");
        perfil.setNome("Felix");
        perfil.setSobrenome("Lima");
        perfil.setTelefone("+55 11 99999-9999");
        perfil.setCodStatus(true);

        when(perfilService.save(any(Perfil.class))).thenReturn(perfil);

        PerfilRequest request = new PerfilRequest();
        request.setEmail("teste@planthings.com");
        request.setNome("Felix");
        request.setSobrenome("Lima");
        request.setTelefone("+55 11 99999-9999");
        request.setSenha("123456");
        String requestBody = Objects.requireNonNull(objectMapper.writeValueAsString(request));

        mockMvc.perform(post("/api/v1/perfil")
                        .contentType(jsonMediaType())
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.email").value("teste@planthings.com"))
                .andExpect(jsonPath("$.nome").value("Felix"))
                .andExpect(jsonPath("$.sobrenome").value("Lima"))
                .andExpect(jsonPath("$.telefone").value("+55 11 99999-9999"))
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andExpect(jsonPath("$.senhaTexto").doesNotExist())
                .andExpect(jsonPath("$.codStatus").doesNotExist());

        verify(perfilService).save(argThat(savedPerfil ->
                "teste@planthings.com".equals(savedPerfil.getEmail())
                        && "Felix".equals(savedPerfil.getNome())
                        && "Lima".equals(savedPerfil.getSobrenome())
                        && "+55 11 99999-9999".equals(savedPerfil.getTelefone())
                        && "123456".equals(savedPerfil.getSenhaTexto())
        ));
    }

    @Test
    void shouldReturn409WhenEmailAlreadyExists() throws Exception {
        when(perfilService.save(any(Perfil.class))).thenThrow(new ConflictException("Email já cadastrado no sistema"));

        String body = """
                {
                  "email": "teste@planthings.com",
                  "nome": "Felix",
                  "senha": "123456"
                }
                """;

        mockMvc.perform(post("/api/v1/perfil")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Email já cadastrado no sistema"));
    }

    @Test
    void shouldReturnAuthenticatedPerfilDtoWithoutInternalFields() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(10L);
        perfil.setEmail("teste@planthings.com");
        perfil.setNome("Felix");
        perfil.setSobrenome("Lima");
        perfil.setTelefone("+55 11 99999-9999");
        perfil.setCodStatus(true);
        perfil.setSenha(new byte[] {1, 2, 3});
        perfil.setSenhaTexto("123456");

        when(perfilService.findById(10L)).thenReturn(perfil);

        mockMvc.perform(get("/api/v1/perfil/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 10L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.email").value("teste@planthings.com"))
                .andExpect(jsonPath("$.nome").value("Felix"))
                .andExpect(jsonPath("$.sobrenome").value("Lima"))
                .andExpect(jsonPath("$.telefone").value("+55 11 99999-9999"))
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andExpect(jsonPath("$.senhaTexto").doesNotExist())
                .andExpect(jsonPath("$.codStatus").doesNotExist());
    }

    @Test
    void shouldReturn401WhenPerfilMeIsRequestedWithoutSession() throws Exception {
        mockMvc.perform(get("/api/v1/perfil/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Autenticação necessária"));
    }

    @Test
    void shouldReturn404WhenAuthenticatedPerfilNotFound() throws Exception {
        when(perfilService.findById(99L)).thenThrow(new NotFoundException("Perfil não encontrado 99"));

        mockMvc.perform(get("/api/v1/perfil/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldLoginAndReturn200() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);
        perfil.setEmail("login@planthings.com");
        perfil.setNome("Login");
        perfil.setSobrenome("User");
        perfil.setTelefone("+55 11 98888-7777");

        when(perfilService.login(eq("login@planthings.com"), eq("123456"))).thenReturn(perfil);

        LoginRequest request = new LoginRequest("login@planthings.com", "123456");

        String requestBody = Objects.requireNonNull(objectMapper.writeValueAsString(request));

        mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(jsonMediaType())
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(request().sessionAttribute(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("login@planthings.com"));
    }

    @Test
    void shouldReturn401WhenLoginFails() throws Exception {
        when(perfilService.login(eq("login@planthings.com"), eq("errada")))
                .thenThrow(new UnauthorizedException("Email ou senha inválidos"));

        LoginRequest request = new LoginRequest("login@planthings.com", "errada");

        String requestBody = Objects.requireNonNull(objectMapper.writeValueAsString(request));

        mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(jsonMediaType())
                        .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Email ou senha inválidos"));
    }

    @Test
    void shouldNotCreateSessionWhenLoginFails() throws Exception {
        when(perfilService.login(eq("login@planthings.com"), eq("errada")))
                .thenThrow(new UnauthorizedException("Email ou senha inválidos"));

        LoginRequest request = new LoginRequest("login@planthings.com", "errada");
        String requestBody = Objects.requireNonNull(objectMapper.writeValueAsString(request));

        MvcResult result = mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(jsonMediaType())
                        .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertNull(result.getRequest().getSession(false));
    }

    @Test
    void shouldInvalidateAuthenticatedSessionOnLogout() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L);

        MvcResult result = mockMvc.perform(post("/api/v1/perfil/logout").session(session))
                .andExpect(status().isNoContent())
                .andReturn();

        assertNull(result.getRequest().getSession(false));
    }
}
