package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.PapelPlano;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.ParticipacaoPlanoRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlanoAccessService {

    @Autowired
    private ParticipacaoPlanoRepository participacaoPlanoRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CartaoRepository cartaoRepository;

    public Plano assertCanViewPlano(Long perfilId, Long planoId) {
        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado"));

        if (!participacaoPlanoRepository.existsByPlanoIdAndPerfilIdAndAtivoTrue(planoId, perfilId)) {
            throw new UnauthorizedException("Perfil sem participação ativa no plano");
        }

        return plano;
    }

    public Plano assertIsManager(Long perfilId, Long planoId) {
        Plano plano = assertCanViewPlano(perfilId, planoId);
        if (!participacaoPlanoRepository.existsByPlanoIdAndPerfilIdAndPapelAndAtivoTrue(planoId, perfilId, PapelPlano.MANAGER)) {
            throw new UnauthorizedException("Ação permitida apenas para MANAGER");
        }
        return plano;
    }

    public void assertCardBelongsToPlano(Long cartaoId, Long planoId) {
        if (!cartaoRepository.existsByIdAndListaPlanoId(cartaoId, planoId)) {
            throw new NotFoundException("Cartão não pertence ao plano informado");
        }
    }

    public Lista assertCanViewLista(Long perfilId, Long listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada"));
        assertCanViewPlano(perfilId, lista.getPlano().getId());
        return lista;
    }

    public Lista assertIsManagerOnLista(Long perfilId, Long listaId) {
        Lista lista = listaRepository.findById(listaId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada"));
        assertIsManager(perfilId, lista.getPlano().getId());
        return lista;
    }
}
