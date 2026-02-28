package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Lista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListaRepository extends JpaRepository<Lista, Long> {
    List<Lista> findByPlanoId(Long planoId);

    List<Lista> findByPlanoIdAndPlanoPerfilId(Long planoId, Long perfilId);

    java.util.Optional<Lista> findByIdAndPlanoPerfilId(Long id, Long perfilId);
}
