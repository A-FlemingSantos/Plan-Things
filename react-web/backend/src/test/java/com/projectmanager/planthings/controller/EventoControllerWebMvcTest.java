package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.services.EventoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EventoController.class)
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class EventoControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

        @MockitoBean
    private EventoService eventoService;

        private static @NonNull MediaType jsonMediaType() {
                return Objects.requireNonNull(MediaType.APPLICATION_JSON);
        }

    @Test
    void shouldListEventosWithDto() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(30L);
        lista.setPlano(plano);

        Evento evento = new Evento();
        evento.setId(50L);
        evento.setNome("Sprint Review");
        evento.setCor("#556677");
        evento.setLista(lista);
        evento.setDataInicio(LocalDateTime.of(2026, 3, 10, 14, 0));
        evento.setDataFim(LocalDateTime.of(2026, 3, 10, 15, 0));

        when(eventoService.findAllByLista(1L, 30L)).thenReturn(List.of(evento));

        mockMvc.perform(get("/api/v1/eventos/perfil/1/lista/30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(50))
                .andExpect(jsonPath("$[0].listaId").value(30));
    }

    @Test
    void shouldCreateEventoAndReturn201() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(30L);
        lista.setPlano(plano);

        Evento evento = new Evento();
        evento.setId(51L);
        evento.setNome("Planning");
        evento.setDescricao("Sprint 2");
        evento.setCor("#778899");
        evento.setLista(lista);
        evento.setDataInicio(LocalDateTime.of(2026, 3, 12, 10, 0));
        evento.setDataFim(LocalDateTime.of(2026, 3, 12, 11, 0));

        when(eventoService.save(eq(1L), eq(30L), any(Evento.class))).thenReturn(evento);

        String body = """
                {
                  "nome": "Planning",
                  "descricao": "Sprint 2",
                  "cor": "#778899",
                  "dataInicio": "2026-03-12T10:00:00",
                  "dataFim": "2026-03-12T11:00:00"
                }
                """;

        mockMvc.perform(post("/api/v1/eventos/perfil/1/lista/30")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(51))
                .andExpect(jsonPath("$.listaId").value(30));
    }

    @Test
    void shouldReturn400WhenEventoIntervalInvalid() throws Exception {
        when(eventoService.save(eq(1L), eq(30L), any(Evento.class)))
                .thenThrow(new BadRequestException("Data fim não pode ser menor que data início"));

        String body = """
                {
                  "nome": "Planning",
                  "cor": "#778899",
                  "dataInicio": "2026-03-12T11:00:00",
                  "dataFim": "2026-03-12T10:00:00"
                }
                """;

        mockMvc.perform(post("/api/v1/eventos/perfil/1/lista/30")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
