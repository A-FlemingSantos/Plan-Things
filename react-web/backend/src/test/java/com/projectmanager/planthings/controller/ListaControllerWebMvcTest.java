package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.services.ListaService;
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

@WebMvcTest(controllers = ListaController.class)
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class ListaControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

        @MockitoBean
    private ListaService listaService;

        private static @NonNull MediaType jsonMediaType() {
                return Objects.requireNonNull(MediaType.APPLICATION_JSON);
        }

    @Test
    void shouldListListasWithDto() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(20L);
        lista.setNome("Backlog");
        lista.setCor("#AABBCC");
        lista.setPlano(plano);

        when(listaService.findAllByPlano(1L, 10L)).thenReturn(List.of(lista));

        mockMvc.perform(get("/api/v1/listas/perfil/1/plano/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(20))
                .andExpect(jsonPath("$[0].nome").value("Backlog"))
                .andExpect(jsonPath("$[0].planoId").value(10));
    }

    @Test
    void shouldCreateListaAndReturn201() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(21L);
        lista.setNome("Doing");
        lista.setCor("#112233");
        lista.setPlano(plano);

        when(listaService.save(eq(1L), eq(10L), any(Lista.class))).thenReturn(lista);

        String body = """
                {
                  "nome": "Doing",
                  "cor": "#112233"
                }
                """;

        mockMvc.perform(post("/api/v1/listas/perfil/1/plano/10")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(21))
                .andExpect(jsonPath("$.planoId").value(10));
    }

    @Test
    void shouldReturn400WhenColorIsInvalid() throws Exception {
        when(listaService.save(eq(1L), eq(10L), any(Lista.class)))
                .thenThrow(new BadRequestException("Cor inválida. Use o formato #RRGGBB"));

        String body = """
                {
                  "nome": "Doing",
                  "cor": "blue"
                }
                """;

        mockMvc.perform(post("/api/v1/listas/perfil/1/plano/10")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void shouldReturn404WhenListaNotFound() throws Exception {
        when(listaService.findById(1L, 99L)).thenThrow(new NotFoundException("Lista não encontrada para o perfil informado"));

        mockMvc.perform(get("/api/v1/listas/perfil/1/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
