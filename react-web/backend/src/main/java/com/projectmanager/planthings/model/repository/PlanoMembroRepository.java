package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.PlanoMembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanoMembroRepository extends JpaRepository<PlanoMembro, Long> {
    boolean existsByPlanoIdAndPerfilId(Long planoId, Long perfilId);
}
