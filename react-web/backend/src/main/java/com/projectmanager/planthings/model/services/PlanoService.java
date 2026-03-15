package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.PapelPlano;
import com.projectmanager.planthings.model.entity.ParticipacaoPlano;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.ParticipacaoPlanoRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class PlanoService {

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private ParticipacaoPlanoRepository participacaoPlanoRepository;

    @Autowired
    private PlanoAccessService planoAccessService;

    public List<Plano> findAllByPerfilId(Long perfilId) {
        ensurePerfilAtivo(perfilId);
        return participacaoPlanoRepository.findPlanosAtivosByPerfilId(perfilId);
    }

    public Plano findById(Long perfilId, Long id) {
        return planoAccessService.assertCanViewPlano(perfilId, id);
    }

    public Plano save(Long perfilId, Plano plano) {
        Perfil perfil = ensurePerfilAtivo(perfilId);
        plano.setId(null);
        plano.setPerfil(perfil);
        Plano novoPlano = Objects.requireNonNull(planoRepository.save(plano));

        ParticipacaoPlano participacao = new ParticipacaoPlano();
        participacao.setPlano(novoPlano);
        participacao.setPerfil(perfil);
        participacao.setPapel(PapelPlano.MANAGER);
        participacao.setAtivo(true);
        participacaoPlanoRepository.save(participacao);

        return novoPlano;
    }

    public Plano update(Long perfilId, Long id, Plano plano) {
        Plano existente = planoAccessService.assertIsManager(perfilId, id);
        existente.setNome(plano.getNome());
        existente.setWallpaperUrl(plano.getWallpaperUrl());
        return Objects.requireNonNull(planoRepository.save(existente));
    }

    public void delete(Long perfilId, Long id) {
        Plano existente = planoAccessService.assertIsManager(perfilId, id);
        planoRepository.delete(Objects.requireNonNull(existente));
    }

    private Perfil ensurePerfilAtivo(Long perfilId) {
        return perfilRepository.findByIdAndCodStatusTrue(perfilId)
                .orElseThrow(() -> new NotFoundException("Perfil ativo não encontrado"));
    }
}
