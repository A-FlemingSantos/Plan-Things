package com.projectmanager.planthings.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PerfilController.class)
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class PerfilControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @MockitoBean
    private PerfilService perfilService;

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

        String body = """
                {
                  "email": "teste@planthings.com",
                  "nome": "Felix",
                  "sobrenome": "Lima",
                  "telefone": "+55 11 99999-9999",
                  "senha": "123456"
                }
                """;

        mockMvc.perform(post("/api/v1/perfil")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.email").value("teste@planthings.com"));
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Email já cadastrado no sistema"));
    }

    @Test
    void shouldReturn404WhenPerfilNotFound() throws Exception {
        when(perfilService.findById(99L)).thenThrow(new NotFoundException("Perfil não encontrado 99"));

        mockMvc.perform(get("/api/v1/perfil/99"))
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

        mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("login@planthings.com"));
    }

    @Test
    void shouldReturn401WhenLoginFails() throws Exception {
        when(perfilService.login(eq("login@planthings.com"), eq("errada")))
                .thenThrow(new UnauthorizedException("Email ou senha inválidos"));

        LoginRequest request = new LoginRequest("login@planthings.com", "errada");

        mockMvc.perform(post("/api/v1/perfil/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Email ou senha inválidos"));
    }
}
