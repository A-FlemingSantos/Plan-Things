package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.CartaoAtribuicao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartaoAtribuicaoRepository extends JpaRepository<CartaoAtribuicao, Long> {
    List<CartaoAtribuicao> findByCartaoId(Long cartaoId);

    void deleteByCartaoId(Long cartaoId);
}

