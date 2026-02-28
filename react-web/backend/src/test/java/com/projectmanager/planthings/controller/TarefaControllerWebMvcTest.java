package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.TarefaService;
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

@WebMvcTest(controllers = TarefaController.class)
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class TarefaControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

        @MockitoBean
    private TarefaService tarefaService;

        private static @NonNull MediaType jsonMediaType() {
                return Objects.requireNonNull(MediaType.APPLICATION_JSON);
        }

    @Test
    void shouldListTarefasWithDto() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(30L);
        lista.setPlano(plano);

        Tarefa tarefa = new Tarefa();
        tarefa.setId(40L);
        tarefa.setNome("Finalizar relatório");
        tarefa.setCor("#334455");
        tarefa.setLista(lista);
        tarefa.setDataConclusao(LocalDateTime.of(2026, 3, 1, 18, 0));

        when(tarefaService.findAllByLista(1L, 30L)).thenReturn(List.of(tarefa));

        mockMvc.perform(get("/api/v1/tarefas/perfil/1/lista/30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(40))
                .andExpect(jsonPath("$[0].listaId").value(30));
    }

    @Test
    void shouldCreateTarefaAndReturn201() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(30L);
        lista.setPlano(plano);

        Tarefa tarefa = new Tarefa();
        tarefa.setId(41L);
        tarefa.setNome("Criar release notes");
        tarefa.setDescricao("Versão 1.0.1");
        tarefa.setCor("#123456");
        tarefa.setLista(lista);
        tarefa.setDataConclusao(LocalDateTime.of(2026, 3, 5, 9, 30));

        when(tarefaService.save(eq(1L), eq(30L), any(Tarefa.class))).thenReturn(tarefa);

        String body = """
                {
                  "nome": "Criar release notes",
                  "descricao": "Versão 1.0.1",
                  "cor": "#123456",
                  "dataConclusao": "2026-03-05T09:30:00"
                }
                """;

        mockMvc.perform(post("/api/v1/tarefas/perfil/1/lista/30")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(41))
                .andExpect(jsonPath("$.listaId").value(30));
    }

    @Test
    void shouldReturn400WhenTarefaColorInvalid() throws Exception {
        when(tarefaService.save(eq(1L), eq(30L), any(Tarefa.class)))
                .thenThrow(new BadRequestException("Cor inválida. Use o formato #RRGGBB"));

        String body = """
                {
                  "nome": "Criar release notes",
                  "cor": "invalid",
                  "dataConclusao": "2026-03-05T09:30:00"
                }
                """;

        mockMvc.perform(post("/api/v1/tarefas/perfil/1/lista/30")
                        .contentType(jsonMediaType())
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
