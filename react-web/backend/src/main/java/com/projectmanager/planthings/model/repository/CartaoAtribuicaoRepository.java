package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.CartaoAtribuicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoAtribuicaoRepository extends JpaRepository<CartaoAtribuicao, Long> {
    List<CartaoAtribuicao> findByCartaoId(Long cartaoId);

    void deleteByCartaoId(Long cartaoId);
}
