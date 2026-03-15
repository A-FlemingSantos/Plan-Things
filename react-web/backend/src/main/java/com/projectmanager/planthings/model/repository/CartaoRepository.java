package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {
    List<Cartao> findByListaId(Long listaId);

    List<Cartao> findByListaIdOrderByPosicaoAsc(Long listaId);

    List<Cartao> findByListaIdAndListaPlanoPerfilIdOrderByPosicaoAsc(Long listaId, Long perfilId);

    java.util.Optional<Cartao> findByIdAndListaPlanoPerfilId(Long id, Long perfilId);

    List<Cartao> findAllByIdInAndListaPlanoPerfilId(List<Long> ids, Long perfilId);

    long countByListaId(Long listaId);
}
