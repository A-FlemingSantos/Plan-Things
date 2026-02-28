package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PlanoController.class)
@Import(GlobalExceptionHandler.class)
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

        mockMvc.perform(get("/api/v1/planos/perfil/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(5))
                .andExpect(jsonPath("$[0].nome").value("Planejamento Semanal"))
                .andExpect(jsonPath("$[0].perfilId").value(1));
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

        mockMvc.perform(post("/api/v1/planos/perfil/1")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(6))
                .andExpect(jsonPath("$.perfilId").value(1));
    }

    @Test
    void shouldReturn404WhenPlanoNotFound() throws Exception {
        when(planoService.findById(1L, 99L)).thenThrow(new NotFoundException("Plano não encontrado para o perfil informado"));

        mockMvc.perform(get("/api/v1/planos/perfil/1/99"))
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

        mockMvc.perform(post("/api/v1/planos/perfil/1")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Nome é obrigatório"));
    }
}
