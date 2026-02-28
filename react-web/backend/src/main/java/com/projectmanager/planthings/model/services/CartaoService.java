package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class CartaoService {

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Autowired
    private CartaoRepository cartaoRepository;

    public List<Cartao> findAllByLista(Long perfilId, Long listaId) {
        return cartaoRepository.findByListaIdAndListaPlanoPerfilId(listaId, perfilId);
    }

    public Cartao findById(Long perfilId, Long id) {
        return cartaoRepository.findByIdAndListaPlanoPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Cartão não encontrado para o perfil informado"));
    }

    public void delete(Long perfilId, Long id) {
        Cartao cartao = findById(perfilId, id);
        cartaoRepository.delete(cartao);
    }

    public void validarCor(String cor) {
        if (cor != null && !HEX_COLOR.matcher(cor).matches()) {
            throw new BadRequestException("Cor inválida. Use o formato #RRGGBB");
        }
    }
}
