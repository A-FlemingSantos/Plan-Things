package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanoRepository extends JpaRepository<Plano, Long> {
    List<Plano> findByPerfilId(Long perfilId);

    java.util.Optional<Plano> findByIdAndPerfilId(Long id, Long perfilId);
}
