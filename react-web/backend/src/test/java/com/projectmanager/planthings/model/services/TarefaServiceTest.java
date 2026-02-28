package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.Tarefa;
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
class TarefaServiceTest {

    @Mock
    private TarefaRepository tarefaRepository;

    @Mock
    private ListaRepository listaRepository;

    @Mock
    private CartaoService cartaoService;

    @Mock
    private EventoRepository eventoRepository;

    @InjectMocks
    private TarefaService tarefaService;

    @Test
    void shouldThrowConflictWhenUpdatingTarefaAndEventoAlreadyExists() {
        Tarefa existente = criarTarefaExistente();
        Tarefa atualizacao = new Tarefa();
        atualizacao.setNome("Novo nome");
        atualizacao.setCor("#123456");
        atualizacao.setDataConclusao(LocalDateTime.of(2026, 3, 10, 8, 0));

        when(tarefaRepository.findByIdAndListaPlanoPerfilId(10L, 1L)).thenReturn(Optional.of(existente));
        when(eventoRepository.existsById(10L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> tarefaService.update(1L, 10L, atualizacao));

        verify(tarefaRepository, never()).save(org.mockito.ArgumentMatchers.any(Tarefa.class));
        verify(cartaoService, never()).validarCor(org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void shouldUpdateTarefaWhenNoConflictExists() {
        Tarefa existente = criarTarefaExistente();
        Tarefa atualizacao = new Tarefa();
        atualizacao.setNome("Atualizado");
        atualizacao.setDescricao("Descrição nova");
        atualizacao.setCor("#ABCDEF");
        atualizacao.setDataConclusao(LocalDateTime.of(2026, 4, 1, 12, 30));

        when(tarefaRepository.findByIdAndListaPlanoPerfilId(10L, 1L)).thenReturn(Optional.of(existente));
        when(eventoRepository.existsById(10L)).thenReturn(false);
        when(tarefaRepository.save(existente)).thenReturn(existente);

        Tarefa resultado = tarefaService.update(1L, 10L, atualizacao);

        assertEquals("Atualizado", resultado.getNome());
        assertEquals("Descrição nova", resultado.getDescricao());
        assertEquals("#ABCDEF", resultado.getCor());
        assertEquals(LocalDateTime.of(2026, 4, 1, 12, 30), resultado.getDataConclusao());
        verify(cartaoService).validarCor("#ABCDEF");
        verify(tarefaRepository).save(existente);
    }

    private Tarefa criarTarefaExistente() {
        Perfil perfil = new Perfil();
        perfil.setId(1L);

        Plano plano = new Plano();
        plano.setId(2L);
        plano.setPerfil(perfil);

        Lista lista = new Lista();
        lista.setId(3L);
        lista.setPlano(plano);

        Tarefa tarefa = new Tarefa();
        tarefa.setId(10L);
        tarefa.setLista(lista);
        tarefa.setNome("Original");
        tarefa.setDescricao("Descrição original");
        tarefa.setCor("#112233");
        tarefa.setDataConclusao(LocalDateTime.of(2026, 3, 1, 10, 0));
        return tarefa;
    }
}
