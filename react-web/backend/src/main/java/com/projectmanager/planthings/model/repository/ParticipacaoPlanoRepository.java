package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.PapelPlano;
import com.projectmanager.planthings.model.entity.ParticipacaoPlano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipacaoPlanoRepository extends JpaRepository<ParticipacaoPlano, Long> {

    @Query("select pp.plano from ParticipacaoPlano pp where pp.perfil.id = :perfilId and pp.ativo = true")
    java.util.List<com.projectmanager.planthings.model.entity.Plano> findPlanosAtivosByPerfilId(Long perfilId);

    boolean existsByPlanoIdAndPerfilIdAndAtivoTrue(Long planoId, Long perfilId);

    boolean existsByPlanoIdAndPerfilIdAndPapelAndAtivoTrue(Long planoId, Long perfilId, PapelPlano papel);
}
