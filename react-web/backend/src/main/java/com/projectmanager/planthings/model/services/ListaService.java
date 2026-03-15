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
import java.util.Objects;
import java.util.regex.Pattern;

@Service
public class ListaService {

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PlanoAuthorizationService planoAuthorizationService;

    public List<Lista> findAllByPlano(Long perfilId, Long planoId) {
        planoAuthorizationService.assertCanViewPlano(planoId, perfilId);
        return listaRepository.findByPlanoId(planoId);
    }

    public Lista findById(Long perfilId, Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lista não encontrada para o perfil informado"));
        planoAuthorizationService.assertCanViewPlano(lista.getPlano().getId(), perfilId);
        return lista;
    }

    public Lista save(Long perfilId, Long planoId, Lista lista) {
        planoAuthorizationService.assertManager(planoId, perfilId);
        Plano plano = ensurePlanoOwnership(perfilId, planoId);
        validarCor(lista.getCor());

        lista.setId(null);
        lista.setPlano(plano);
        return Objects.requireNonNull(listaRepository.save(lista));
    }

    public Lista update(Long perfilId, Long id, Lista lista) {
        Lista existente = findById(perfilId, id);
        planoAuthorizationService.assertManager(existente.getPlano().getId(), perfilId);
        validarCor(lista.getCor());

        existente.setNome(lista.getNome());
        existente.setCor(lista.getCor());
        return Objects.requireNonNull(listaRepository.save(existente));
    }

    public void delete(Long perfilId, Long id) {
        Lista existente = findById(perfilId, id);
        planoAuthorizationService.assertManager(existente.getPlano().getId(), perfilId);
        listaRepository.delete(Objects.requireNonNull(existente));
    }

    private Plano ensurePlanoOwnership(Long perfilId, Long planoId) {
        return planoRepository.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado para o perfil informado"));
    }

    private void validarCor(String cor) {
        if (cor != null && !HEX_COLOR.matcher(cor).matches()) {
            throw new BadRequestException("Cor inválida. Use o formato #RRGGBB");
        }
    }
}
