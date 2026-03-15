package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.PlanoMembro;
import com.projectmanager.planthings.model.entity.PlanoRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlanoMembroRepository extends JpaRepository<PlanoMembro, Long> {
    Optional<PlanoMembro> findByPlanoIdAndPerfilId(Long planoId, Long perfilId);

    boolean existsByPlanoIdAndPerfilIdAndPapel(Long planoId, Long perfilId, PlanoRole papel);

    List<PlanoMembro> findByPlanoId(Long planoId);

    void deleteByPlanoIdAndPerfilId(Long planoId, Long perfilId);
}

