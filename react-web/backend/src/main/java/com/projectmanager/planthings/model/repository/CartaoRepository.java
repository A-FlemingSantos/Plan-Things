package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {
    List<Cartao> findByListaId(Long listaId);

    List<Cartao> findByListaIdAndListaPlanoPerfilId(Long listaId, Long perfilId);

    java.util.Optional<Cartao> findByIdAndListaPlanoPerfilId(Long id, Long perfilId);
}
