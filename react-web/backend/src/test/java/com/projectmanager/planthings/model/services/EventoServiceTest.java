package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.EventoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.TarefaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventoServiceTest {

    @Mock
    private EventoRepository eventoRepository;

    @Mock
    private ListaRepository listaRepository;

    @Mock
    private CartaoService cartaoService;

    @Mock
    private TarefaRepository tarefaRepository;

    @InjectMocks
    private EventoService eventoService;

    @Test
    void shouldThrowConflictWhenUpdatingEventoAndTarefaAlreadyExists() {
        Evento existente = criarEventoExistente();
        Evento atualizacao = new Evento();
        atualizacao.setNome("Kickoff");
        atualizacao.setCor("#123456");
        atualizacao.setDataInicio(LocalDateTime.of(2026, 3, 12, 9, 0));
        atualizacao.setDataFim(LocalDateTime.of(2026, 3, 12, 10, 0));

        when(eventoRepository.findByIdAndListaPlanoPerfilId(10L, 1L)).thenReturn(Optional.of(existente));
        when(tarefaRepository.existsById(10L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> eventoService.update(1L, 10L, atualizacao));

        verify(eventoRepository, never()).save(org.mockito.ArgumentMatchers.any(Evento.class));
        verify(cartaoService, never()).validarCor(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void shouldUpdateEventoWhenNoConflictExists() {
        Evento existente = criarEventoExistente();
        Evento atualizacao = new Evento();
        atualizacao.setNome("Planejamento");
        atualizacao.setDescricao("Planejamento trimestral");
        atualizacao.setCor("#ABCDEF");
        atualizacao.setDataInicio(LocalDateTime.of(2026, 4, 10, 14, 0));
        atualizacao.setDataFim(LocalDateTime.of(2026, 4, 10, 16, 0));

        when(eventoRepository.findByIdAndListaPlanoPerfilId(10L, 1L)).thenReturn(Optional.of(existente));
        when(tarefaRepository.existsById(10L)).thenReturn(false);
        when(eventoRepository.save(existente)).thenReturn(existente);

        Evento resultado = eventoService.update(1L, 10L, atualizacao);

        assertEquals("Planejamento", resultado.getNome());
        assertEquals("Planejamento trimestral", resultado.getDescricao());
        assertEquals("#ABCDEF", resultado.getCor());
        assertEquals(LocalDateTime.of(2026, 4, 10, 14, 0), resultado.getDataInicio());
        assertEquals(LocalDateTime.of(2026, 4, 10, 16, 0), resultado.getDataFim());
        verify(cartaoService).validarCor("#ABCDEF");
        verify(eventoRepository).save(existente);
    }

    private Evento criarEventoExistente() {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(2L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(3L);
        lista.setPlano(plano);

        Evento evento = new Evento();
        evento.setId(10L);
        evento.setLista(lista);
        evento.setNome("Original");
        evento.setDescricao("Descrição original");
        evento.setCor("#112233");
        evento.setDataInicio(LocalDateTime.of(2026, 3, 5, 9, 0));
        evento.setDataFim(LocalDateTime.of(2026, 3, 5, 11, 0));
        return evento;
    }
}
