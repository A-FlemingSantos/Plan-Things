package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ListaService {

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private PlanoRepository planoRepository;

    public List<Lista> findAllByPlano(Long perfilId, Long planoId) {
        ensurePlanoOwnership(perfilId, planoId);
        return listaRepository.findByPlanoIdAndPlanoPerfilId(planoId, perfilId);
    }

    public Lista findById(Long perfilId, Long id) {
        return listaRepository.findByIdAndPlanoPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
    }

    public Lista save(Long perfilId, Long planoId, Lista lista) {
        Plano plano = ensurePlanoOwnership(perfilId, planoId);
        validarCor(lista.getCor());

        lista.setId(null);
        lista.setPlano(plano);
        return listaRepository.save(lista);
    }

    public Lista update(Long perfilId, Long id, Lista lista) {
        Lista existente = findById(perfilId, id);
        validarCor(lista.getCor());

        existente.setNome(lista.getNome());
        existente.setCor(lista.getCor());
        return listaRepository.save(existente);
    }

    public void delete(Long perfilId, Long id) {
        Lista existente = findById(perfilId, id);
        listaRepository.delete(existente);
    }

    private Plano ensurePlanoOwnership(Long perfilId, Long planoId) {
        return planoRepository.findByIdAndPerfilId(planoId, perfilId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado para o perfil informado"));
    }

    private void validarCor(String cor) {
        if (cor != null && !HEX_COLOR.matcher(cor).matches()) {
            throw new BadRequestException("Cor inválida. Use o formato #RRGGBB");
        }
    }
}
