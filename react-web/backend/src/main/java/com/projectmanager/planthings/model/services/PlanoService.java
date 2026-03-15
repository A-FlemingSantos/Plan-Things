package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.PlanoMembro;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoMembroRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class PlanoService {

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PlanoMembroRepository planoMembroRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    public List<Plano> findAllByPerfilId(Long perfilId) {
        ensurePerfilAtivo(perfilId);
        return planoRepository.findByPerfilId(perfilId);
    }

    public Plano findById(Long perfilId, Long id) {
        ensurePerfilAtivo(perfilId);
        return planoRepository.findByIdAndPerfilId(id, perfilId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado para o perfil informado"));
    }

    @Transactional
    public Plano save(Long perfilId, Plano plano) {
        Perfil perfil = ensurePerfilAtivo(perfilId);
        plano.setId(null);
        plano.setPerfil(perfil);

        Plano novoPlano = Objects.requireNonNull(planoRepository.save(plano));

        PlanoMembro planoMembro = new PlanoMembro();
        planoMembro.setPlano(novoPlano);
        planoMembro.setPerfil(perfil);
        planoMembro.setPapel(PlanoMembro.Papel.MANAGER);
        planoMembro.setStatus(PlanoMembro.Status.ACTIVE);
        planoMembroRepository.save(planoMembro);

        return novoPlano;
    }

    public Plano update(Long perfilId, Long id, Plano plano) {
        Plano existente = findById(perfilId, id);
        existente.setNome(plano.getNome());
        existente.setWallpaperUrl(plano.getWallpaperUrl());
        return Objects.requireNonNull(planoRepository.save(existente));
    }

    public void delete(Long perfilId, Long id) {
        Plano existente = findById(perfilId, id);
        planoRepository.delete(Objects.requireNonNull(existente));
    }

    private Perfil ensurePerfilAtivo(Long perfilId) {
        return perfilRepository.findByIdAndCodStatusTrue(perfilId)
                .orElseThrow(() -> new NotFoundException("Perfil ativo não encontrado"));
    }
}
