package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.ConviteStatus;
import com.projectmanager.planthings.model.entity.PlanoConvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanoConviteRepository extends JpaRepository<PlanoConvite, Long> {
    List<PlanoConvite> findByPlanoIdOrderByCriadoEmDesc(Long planoId);

    Optional<PlanoConvite> findByIdAndPlanoId(Long id, Long planoId);

    boolean existsByPlanoIdAndConvidadoPerfilIdAndStatus(Long planoId, Long convidadoPerfilId, ConviteStatus status);
}

