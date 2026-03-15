package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.repository.EventoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CartaoService cartaoService;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private PlanoAuthorizationService planoAuthorizationService;

    public List<Tarefa> findAllByLista(Long perfilId, Long listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
        planoAuthorizationService.assertCanViewPlano(lista.getPlano().getId(), perfilId);
        return tarefaRepository.findByListaId(listaId);
    }

    public Tarefa findById(Long perfilId, Long id) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada para o perfil informado"));
        planoAuthorizationService.assertCanViewPlano(tarefa.getLista().getPlano().getId(), perfilId);
        return tarefa;
    }

    @Transactional
    public Tarefa save(Long perfilId, Long listaId, Tarefa tarefa) {
        Lista lista = ensureListaOwnership(perfilId, listaId);
        planoAuthorizationService.assertManager(lista.getPlano().getId(), perfilId);
        cartaoService.validarCor(tarefa.getCor());

        tarefa.setId(null);
        tarefa.setLista(lista);
        tarefa.setPosicao(cartaoService.getNextPosicao(listaId));
        return Objects.requireNonNull(tarefaRepository.save(tarefa));
    }

    @Transactional
    public Tarefa update(Long perfilId, Long id, Tarefa tarefa) {
        Tarefa existente = findById(perfilId, id);
        planoAuthorizationService.assertManager(existente.getLista().getPlano().getId(), perfilId);
        validarExclusividade(id);
        cartaoService.validarCor(tarefa.getCor());

        existente.setNome(tarefa.getNome());
        existente.setDescricao(tarefa.getDescricao());
        existente.setCor(tarefa.getCor());
        existente.setDataConclusao(tarefa.getDataConclusao());
        return Objects.requireNonNull(tarefaRepository.save(existente));
    }

    @Transactional
    public void delete(Long perfilId, Long id) {
        Tarefa existente = findById(perfilId, id);
        planoAuthorizationService.assertManager(existente.getLista().getPlano().getId(), perfilId);
        tarefaRepository.delete(Objects.requireNonNull(existente));
    }

    private Lista ensureListaOwnership(Long perfilId, Long listaId) {
        return listaRepository.findById(listaId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
    }

    private void validarExclusividade(Long id) {
        if (eventoRepository.existsById(Objects.requireNonNull(id))) {
            throw new ConflictException("Cartão não pode ser Tarefa e Evento ao mesmo tempo");
        }
    }
}
