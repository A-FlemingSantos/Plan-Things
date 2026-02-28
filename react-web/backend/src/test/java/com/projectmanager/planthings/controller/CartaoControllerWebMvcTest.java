package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.exception.GlobalExceptionHandler;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.CartaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CartaoController.class)
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class CartaoControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CartaoService cartaoService;

    @Test
    void shouldListCartoesPolymorphicDto() throws Exception {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(10L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(30L);
        lista.setPlano(plano);

        Tarefa tarefa = new Tarefa();
        tarefa.setId(60L);
        tarefa.setNome("Task X");
        tarefa.setLista(lista);
        tarefa.setDataConclusao(LocalDateTime.of(2026, 3, 20, 12, 0));

        Evento evento = new Evento();
        evento.setId(61L);
        evento.setNome("Evento Y");
        evento.setLista(lista);
        evento.setDataInicio(LocalDateTime.of(2026, 3, 20, 13, 0));
        evento.setDataFim(LocalDateTime.of(2026, 3, 20, 14, 0));

        when(cartaoService.findAllByLista(1L, 30L)).thenReturn(List.of(tarefa, evento));

        mockMvc.perform(get("/api/v1/cartoes/perfil/1/lista/30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(60))
                .andExpect(jsonPath("$[0].tipo").value("TAREFA"))
                .andExpect(jsonPath("$[1].id").value(61))
                .andExpect(jsonPath("$[1].tipo").value("EVENTO"));
    }

    @Test
    void shouldReturn404WhenCartaoNotFound() throws Exception {
        when(cartaoService.findById(1L, 999L)).thenThrow(new NotFoundException("Cartão não encontrado para o perfil informado"));

        mockMvc.perform(get("/api/v1/cartoes/perfil/1/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
