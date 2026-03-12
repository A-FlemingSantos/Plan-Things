package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.auth.AuthSession;
import com.projectmanager.planthings.config.AuthWebConfig;
import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.dto.CartaoResponse;
import com.projectmanager.planthings.model.dto.PlanoBoardListaResponse;
import com.projectmanager.planthings.model.dto.PlanoBoardResponse;
import com.projectmanager.planthings.model.dto.PlanoResponse;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.services.PlanoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Objects;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PlanoController.class)
@Import({GlobalExceptionHandler.class, AuthWebConfig.class})
@ActiveProfiles("test")
class PlanoControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

                @MockitoBean
    private PlanoService planoService;

                private static @NonNull MediaType jsonMediaType() {
                                return Objects.requireNonNull(MediaType.APPLICATION_JSON);
                }

    @Test
    void shouldListPlanosAndReturnDto() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(5L);
        plano.setNome("Planejamento Semanal");
        plano.setWallpaperUrl("https://cdn.planthings/bg.jpg");
        plano.setPerfil(perfil);

        when(planoService.findAllByPerfilId(1L)).thenReturn(List.of(plano));

        mockMvc.perform(get("/api/v1/planos/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(5))
                .andExpect(jsonPath("$[0].nome").value("Planejamento Semanal"))
                .andExpect(jsonPath("$[0].perfilId").value(1));
    }

    @Test
    void shouldReturn401WhenRequestHasNoAuthenticatedSession() throws Exception {
        mockMvc.perform(get("/api/v1/planos/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Autenticação necessária"));
    }

    @Test
    void shouldReturn404WhenAuthenticatedPerfilDoesNotOwnRequestedBoard() throws Exception {
        when(planoService.findBoardById(2L, 5L))
                .thenThrow(new NotFoundException("Plano não encontrado para o perfil informado"));

        mockMvc.perform(get("/api/v1/planos/me/5/board")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 2L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Plano não encontrado para o perfil informado"));

        verify(planoService).findBoardById(2L, 5L);
    }

    @Test
    void shouldCreatePlanoAndReturn201() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(6L);
        plano.setNome("Plano Novo");
        plano.setWallpaperUrl("https://cdn.planthings/new.jpg");
        plano.setPerfil(perfil);

        when(planoService.save(eq(1L), any(Plano.class))).thenReturn(plano);

        String body = """
                {
                  "nome": "Plano Novo",
                  "wallpaperUrl": "https://cdn.planthings/new.jpg"
                }
                """;

        mockMvc.perform(post("/api/v1/planos/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(6))
                .andExpect(jsonPath("$.perfilId").value(1));
    }

    @Test
    void shouldReturnBoardAggregatePayload() throws Exception {
        PlanoBoardResponse board = new PlanoBoardResponse(
                new PlanoResponse(5L, "Planejamento Semanal", "https://cdn.planthings/bg.jpg", 1L),
                List.of(new PlanoBoardListaResponse(
                        10L,
                        "A Fazer",
                        "#123456",
                        5L,
                        List.of(new CartaoResponse(
                                20L,
                                "TAREFA",
                                "Escrever testes",
                                "Cobrir endpoint agregado",
                                "#654321",
                                10L,
                                0,
                                null,
                                null,
                                null
                        ))
                ))
        );

        when(planoService.findBoardById(1L, 5L)).thenReturn(board);

        mockMvc.perform(get("/api/v1/planos/me/5/board")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plano.id").value(5))
                .andExpect(jsonPath("$.plano.perfilId").value(1))
                .andExpect(jsonPath("$.listas[0].id").value(10))
                .andExpect(jsonPath("$.listas[0].cartoes[0].id").value(20))
                .andExpect(jsonPath("$.listas[0].cartoes[0].tipo").value("TAREFA"));
    }

        @Test
    void shouldReturn404WhenPlanoNotFound() throws Exception {
        when(planoService.findById(1L, 99L)).thenThrow(new NotFoundException("Plano não encontrado para o perfil informado"));

        mockMvc.perform(get("/api/v1/planos/me/99")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturn400WhenPlanoPayloadInvalid() throws Exception {
        when(planoService.save(eq(1L), any(Plano.class))).thenThrow(new BadRequestException("Nome é obrigatório"));

        String body = """
                {
                  "nome": "",
                  "wallpaperUrl": "x"
                }
                """;

        mockMvc.perform(post("/api/v1/planos/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Nome é obrigatório"));
    }

    @Test
    void shouldReturn400WhenWallpaperUsesEmbeddedBase64() throws Exception {
        when(planoService.save(eq(1L), any(Plano.class))).thenThrow(
                new BadRequestException("Imagens incorporadas em base64 não são mais aceitas. Use uma capa predefinida.")
        );

        String body = """
                {
                  "nome": "Plano Novo",
                  "wallpaperUrl": "data:image/jpeg;base64,abc123"
                }
                """;

        mockMvc.perform(post("/api/v1/planos/me")
                        .sessionAttr(AuthSession.PERFIL_ID_SESSION_ATTRIBUTE, 1L)
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Imagens incorporadas em base64 não são mais aceitas. Use uma capa predefinida."));
    }
}
