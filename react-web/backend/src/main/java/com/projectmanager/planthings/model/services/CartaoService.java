package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.dto.ReorderRequest;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CartaoService {

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Autowired
    private CartaoRepository cartaoRepository;

    @Autowired
    private ListaRepository listaRepository;

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

        // Validate all target lists belong to the same user
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
