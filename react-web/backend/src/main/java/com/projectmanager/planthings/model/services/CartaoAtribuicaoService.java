package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.CartaoAtribuicao;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.CartaoAtribuicaoRepository;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CartaoAtribuicaoService {

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private CartaoAtribuicaoRepository cartaoAtribuicaoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PlanoAuthorizationService planoAuthorizationService;

    @Autowired
    private PlanoColaboracaoService planoColaboracaoService;

    @Transactional
    public List<CartaoAtribuicao> atribuir(Long cartaoId, Long perfilId, List<Long> atribuicoesPerfilIds) {
        Cartao cartao = getCartao(cartaoId);
        Long planoId = cartao.getLista().getPlano().getId();
        planoAuthorizationService.assertManager(planoId, perfilId);

        Set<Long> idsSemDuplicidade = new HashSet<>(atribuicoesPerfilIds);
        Set<Long> membrosPermitidos = new HashSet<>(planoColaboracaoService.listarMembros(planoId, perfilId).stream()
                .map(m -> m.getPerfil().getId())
                .toList());

        for (Long id : idsSemDuplicidade) {
            if (!membrosPermitidos.contains(id)) {
                throw new BadRequestException("Perfil " + id + " não é membro do plano");
            }
        }

        cartaoAtribuicaoRepository.deleteByCartaoId(cartaoId);

        List<CartaoAtribuicao> novas = new ArrayList<>();
        for (Long atribuidoId : idsSemDuplicidade) {
            Perfil perfilAtribuido = perfilRepository.findByIdAndCodStatusTrue(atribuidoId)
                    .orElseThrow(() -> new NotFoundException("Perfil não encontrado: " + atribuidoId));
            CartaoAtribuicao atribuicao = new CartaoAtribuicao();
            atribuicao.setCartao(cartao);
            atribuicao.setPerfil(perfilAtribuido);
            novas.add(atribuicao);
        }

        return cartaoAtribuicaoRepository.saveAll(novas);
    }

    public List<CartaoAtribuicao> listar(Long cartaoId, Long perfilId) {
        Cartao cartao = getCartao(cartaoId);
        planoAuthorizationService.assertCanViewPlano(cartao.getLista().getPlano().getId(), perfilId);
        return cartaoAtribuicaoRepository.findByCartaoId(cartaoId);
    }

    private Cartao getCartao(Long cartaoId) {
        return cartaoRepository.findById(cartaoId)
                .orElseThrow(() -> new NotFoundException("Cartão não encontrado"));
    }
}

