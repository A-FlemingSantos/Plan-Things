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

    public List<Tarefa> findAllByLista(Long perfilId, Long listaId) {
        return tarefaRepository.findByListaIdAndListaPlanoPerfilId(listaId, perfilId);
    }

    public Tarefa findById(Long perfilId, Long id) {
        return tarefaRepository.findByIdAndListaPlanoPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada para o perfil informado"));
    }

    @Transactional
    public Tarefa save(Long perfilId, Long listaId, Tarefa tarefa) {
        Lista lista = ensureListaOwnership(perfilId, listaId);
        cartaoService.validarCor(tarefa.getCor());

        tarefa.setId(null);
        tarefa.setLista(lista);
        return tarefaRepository.save(tarefa);
    }

    @Transactional
    public Tarefa update(Long perfilId, Long id, Tarefa tarefa) {
        Tarefa existente = findById(perfilId, id);
        validarExclusividade(id);
        cartaoService.validarCor(tarefa.getCor());

        existente.setNome(tarefa.getNome());
        existente.setDescricao(tarefa.getDescricao());
        existente.setCor(tarefa.getCor());
        existente.setDataConclusao(tarefa.getDataConclusao());
        return tarefaRepository.save(existente);
    }

    @Transactional
    public void delete(Long perfilId, Long id) {
        Tarefa existente = findById(perfilId, id);
        tarefaRepository.delete(existente);
    }

    private Lista ensureListaOwnership(Long perfilId, Long listaId) {
        return listaRepository.findByIdAndPlanoPerfilId(listaId, perfilId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
    }

    private void validarExclusividade(Long id) {
        if (eventoRepository.existsById(id)) {
            throw new ConflictException("Cartão não pode ser Tarefa e Evento ao mesmo tempo");
        }
    }
}
