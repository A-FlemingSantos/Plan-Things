package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.dto.ReorderRequest;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.CartaoAtribuicao;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.CartaoAtribuicaoRepository;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CartaoService {

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private CartaoAtribuicaoRepository cartaoAtribuicaoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PlanoRepository planoRepository;

    public List<Cartao> findAllByLista(Long perfilId, Long listaId) {
        return cartaoRepository.findByListaIdAndListaPlanoPerfilIdOrderByPosicaoAsc(listaId, perfilId);
    }

    public Cartao findById(Long perfilId, Long id) {
        return cartaoRepository.findByIdAndListaPlanoPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Cartão não encontrado para o perfil informado"));
    }

    public void delete(Long perfilId, Long id) {
        Cartao cartao = Objects.requireNonNull(findById(perfilId, id));
        cartaoRepository.delete(cartao);
    }

    public void validarCor(String cor) {
        if (cor != null && !HEX_COLOR.matcher(cor).matches()) {
            throw new BadRequestException("Cor inválida. Use o formato #RRGGBB");
        }
    }

    public int getNextPosicao(Long listaId) {
        return (int) cartaoRepository.countByListaId(listaId);
    }

    public List<CartaoAtribuicao> findAssignmentsByCard(Long perfilId, Long cartaoId) {
        findById(perfilId, cartaoId);
        return cartaoAtribuicaoRepository.findByCartaoId(cartaoId);
    }

    @Transactional
    public List<CartaoAtribuicao> assignProfiles(Long perfilId, Long cartaoId, List<Long> perfilIds, Long assignedByPerfilId) {
        Cartao cartao = findById(perfilId, cartaoId);
        Long planoId = cartao.getLista().getPlano().getId();

        Set<Long> targetPerfilIds = new LinkedHashSet<>(perfilIds != null ? perfilIds : new ArrayList<>());
        if (targetPerfilIds.isEmpty()) {
            throw new BadRequestException("Informe ao menos um perfil para atribuir");
        }

        Long actorPerfilId = assignedByPerfilId != null ? assignedByPerfilId : perfilId;
        Perfil actor = perfilRepository.findByIdAndCodStatusTrue(actorPerfilId)
                .orElseThrow(() -> new NotFoundException("Perfil atribuidor não encontrado ou inativo"));

        if (!planoRepository.existsByIdAndPerfilIdAndPerfilCodStatusTrue(planoId, actorPerfilId)) {
            throw new BadRequestException("Somente membros ativos do mesmo plano podem atribuir usuários ao cartão");
        }

        List<Perfil> perfis = perfilRepository.findAllById(targetPerfilIds).stream()
                .filter(p -> Boolean.TRUE.equals(p.getCodStatus()))
                .toList();

        if (perfis.size() != targetPerfilIds.size()) {
            throw new BadRequestException("Um ou mais perfis informados não foram encontrados ou estão inativos");
        }

        for (Perfil perfil : perfis) {
            boolean member = planoRepository.existsByIdAndPerfilIdAndPerfilCodStatusTrue(planoId, perfil.getId());
            if (!member) {
                throw new BadRequestException("Só é permitido atribuir perfis membros ativos do mesmo plano do cartão");
            }
        }

        cartaoAtribuicaoRepository.deleteByCartaoId(cartaoId);

        List<CartaoAtribuicao> novas = perfis.stream().map(perfil -> {
            CartaoAtribuicao atribuicao = new CartaoAtribuicao();
            atribuicao.setCartao(cartao);
            atribuicao.setPerfil(perfil);
            atribuicao.setAssignedByPerfil(actor);
            atribuicao.setCreatedAt(LocalDateTime.now());
            return atribuicao;
        }).collect(Collectors.toList());

        return cartaoAtribuicaoRepository.saveAll(novas);
    }

    @Transactional
    public void reorder(Long perfilId, List<ReorderRequest.CardPosition> positions) {
        List<Long> cardIds = positions.stream()
                .map(ReorderRequest.CardPosition::getCardId)
                .collect(Collectors.toList());

        List<Cartao> cartoes = cartaoRepository.findAllByIdInAndListaPlanoPerfilId(cardIds, perfilId);

        if (cartoes.size() != cardIds.size()) {
            throw new NotFoundException("Um ou mais cartões não foram encontrados para o perfil informado");
        }

        Map<Long, Cartao> cartaoMap = cartoes.stream()
                .collect(Collectors.toMap(Cartao::getId, c -> c));

        List<Long> listaIds = positions.stream()
                .map(ReorderRequest.CardPosition::getListaId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Lista> listaMap = listaIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> listaRepository.findByIdAndPlanoPerfilId(id, perfilId)
                                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"))
                ));

        for (ReorderRequest.CardPosition pos : positions) {
            Cartao cartao = cartaoMap.get(pos.getCardId());
            Lista lista = listaMap.get(pos.getListaId());
            cartao.setLista(lista);
            cartao.setPosicao(pos.getPosicao());
        }

        cartaoRepository.saveAll(cartoes);
    }
}
