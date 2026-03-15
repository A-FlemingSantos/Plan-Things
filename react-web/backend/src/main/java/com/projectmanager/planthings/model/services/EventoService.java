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
import java.util.Objects;

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

    @Autowired
    private PlanoAccessService planoAccessService;

    public List<Evento> findAllByLista(Long perfilId, Long listaId) {
        planoAccessService.assertCanViewLista(perfilId, listaId);
        return eventoRepository.findByListaId(listaId);
    }

    public Evento findById(Long perfilId, Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Evento não encontrado"));
        planoAccessService.assertCanViewPlano(perfilId, evento.getLista().getPlano().getId());
        return evento;
    }

    @Transactional
    public Evento save(Long perfilId, Long listaId, Evento evento) {
        Lista lista = ensureListaOwnership(perfilId, listaId);
        validarIntervalo(evento);
        cartaoService.validarCor(evento.getCor());

        evento.setId(null);
        evento.setLista(lista);
        evento.setPosicao(cartaoService.getNextPosicao(listaId));
        return Objects.requireNonNull(eventoRepository.save(evento));
    }

    @Transactional
    public Evento update(Long perfilId, Long id, Evento evento) {
        Evento existente = findById(perfilId, id);
        planoAccessService.assertIsManager(perfilId, existente.getLista().getPlano().getId());
        validarExclusividade(id);
        validarIntervalo(evento);
        cartaoService.validarCor(evento.getCor());

        existente.setNome(evento.getNome());
        existente.setDescricao(evento.getDescricao());
        existente.setCor(evento.getCor());
        existente.setDataInicio(evento.getDataInicio());
        existente.setDataFim(evento.getDataFim());
        return Objects.requireNonNull(eventoRepository.save(existente));
    }

    @Transactional
    public void delete(Long perfilId, Long id) {
        Evento existente = findById(perfilId, id);
        planoAccessService.assertIsManager(perfilId, existente.getLista().getPlano().getId());
        eventoRepository.delete(Objects.requireNonNull(existente));
    }

    private Lista ensureListaOwnership(Long perfilId, Long listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada"));
        planoAccessService.assertIsManager(perfilId, lista.getPlano().getId());
        return lista;
    }

    private void validarIntervalo(Evento evento) {
        if (evento.getDataInicio() != null && evento.getDataFim() != null
                && evento.getDataFim().isBefore(evento.getDataInicio())) {
            throw new BadRequestException("A data de fim não pode ser anterior à data de início");
        }
    }

    private void validarExclusividade(Long id) {
        if (tarefaRepository.existsById(Objects.requireNonNull(id))) {
            throw new ConflictException("Cartão não pode ser Tarefa e Evento ao mesmo tempo");
        }
    }
}
