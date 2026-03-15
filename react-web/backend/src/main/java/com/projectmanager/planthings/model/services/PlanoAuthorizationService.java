package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.entity.PlanoRole;
import com.projectmanager.planthings.model.repository.PlanoMembroRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlanoAuthorizationService {

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PlanoMembroRepository planoMembroRepository;

    public Plano getPlanoOrThrow(Long planoId) {
        return planoRepository.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado"));
    }

    public void assertCanViewPlano(Long planoId, Long perfilId) {
        Plano plano = getPlanoOrThrow(planoId);
        if (plano.getPerfil().getId().equals(perfilId)) {
            return;
        }

        boolean member = planoMembroRepository.findByPlanoIdAndPerfilId(planoId, perfilId).isPresent();
        if (!member) {
            throw new UnauthorizedException("Perfil sem acesso ao plano");
        }
    }

    public void assertManager(Long planoId, Long perfilId) {
        Plano plano = getPlanoOrThrow(planoId);
        if (plano.getPerfil().getId().equals(perfilId)) {
            return;
        }

        boolean manager = planoMembroRepository.existsByPlanoIdAndPerfilIdAndPapel(planoId, perfilId, PlanoRole.MANAGER);
        if (!manager) {
            throw new UnauthorizedException("Apenas MANAGER pode executar esta ação");
        }
    }
}

