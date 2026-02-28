package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.repository.EventoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CartaoService cartaoService;

    @Autowired
    private TarefaRepository tarefaRepository;

    public List<Evento> findAllByLista(Long perfilId, Long listaId) {
        return eventoRepository.findByListaIdAndListaPlanoPerfilId(listaId, perfilId);
    }

    public Evento findById(Long perfilId, Long id) {
        return eventoRepository.findByIdAndListaPlanoPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Evento não encontrado para o perfil informado"));
    }

    @Transactional
    public Evento save(Long perfilId, Long listaId, Evento evento) {
        Lista lista = ensureListaOwnership(perfilId, listaId);
        validarIntervalo(evento);
        cartaoService.validarCor(evento.getCor());

        evento.setId(null);
        evento.setLista(lista);
        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento update(Long perfilId, Long id, Evento evento) {
        Evento existente = findById(perfilId, id);
        validarExclusividade(id);
        validarIntervalo(evento);
        cartaoService.validarCor(evento.getCor());

        existente.setNome(evento.getNome());
        existente.setDescricao(evento.getDescricao());
        existente.setCor(evento.getCor());
        existente.setDataInicio(evento.getDataInicio());
        existente.setDataFim(evento.getDataFim());
        return eventoRepository.save(existente);
    }

    @Transactional
    public void delete(Long perfilId, Long id) {
        Evento existente = findById(perfilId, id);
        eventoRepository.delete(existente);
    }

    private Lista ensureListaOwnership(Long perfilId, Long listaId) {
        return listaRepository.findByIdAndPlanoPerfilId(listaId, perfilId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
    }

    private void validarIntervalo(Evento evento) {
        if (evento.getDataInicio() != null && evento.getDataFim() != null
                && evento.getDataFim().isBefore(evento.getDataInicio())) {
            throw new BadRequestException("Data fim não pode ser menor que data início");
        }
    }

    private void validarExclusividade(Long id) {
        if (tarefaRepository.existsById(id)) {
            throw new ConflictException("Cartão não pode ser Tarefa e Evento ao mesmo tempo");
        }
    }
}
