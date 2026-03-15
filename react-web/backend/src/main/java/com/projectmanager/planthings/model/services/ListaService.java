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
    private PlanoAccessService planoAccessService;

    public List<Lista> findAllByPlano(Long perfilId, Long planoId) {
        planoAccessService.assertCanViewPlano(perfilId, planoId);
        return listaRepository.findByPlanoId(planoId);
    }

    public Lista findById(Long perfilId, Long id) {
        return planoAccessService.assertCanViewLista(perfilId, id);
    }

    public Lista save(Long perfilId, Long planoId, Lista lista) {
        planoAccessService.assertIsManager(perfilId, planoId);
        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado"));
        validarCor(lista.getCor());

        lista.setId(null);
        lista.setPlano(plano);
        return Objects.requireNonNull(listaRepository.save(lista));
    }

    public Lista update(Long perfilId, Long id, Lista lista) {
        Lista existente = planoAccessService.assertIsManagerOnLista(perfilId, id);
        validarCor(lista.getCor());

        existente.setNome(lista.getNome());
        existente.setCor(lista.getCor());
        return Objects.requireNonNull(listaRepository.save(existente));
    }

    public void delete(Long perfilId, Long id) {
        Lista existente = planoAccessService.assertIsManagerOnLista(perfilId, id);
        listaRepository.delete(Objects.requireNonNull(existente));
    }

    private void validarCor(String cor) {
        if (cor != null && !HEX_COLOR.matcher(cor).matches()) {
            throw new BadRequestException("Cor inválida. Use o formato #RRGGBB");
        }
    }
}
