package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PerfilRepository  extends JpaRepository<Perfil, Long> {
    
    // Método para buscar perfil por email
    Optional<Perfil> findByEmailIgnoreCase(String email);

    java.util.List<Perfil> findByCodStatusTrue();

    Optional<Perfil> findByIdAndCodStatusTrue(Long id);
    
}
