package com.projectmanager.planthings.model.repository;

import com.projectmanager.planthings.model.entity.PlanoConvite;
import com.projectmanager.planthings.model.entity.PlanoConviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanoConviteRepository extends JpaRepository<PlanoConvite, Long> {

    boolean existsByPlanoIdAndInviteePerfilIdAndStatus(Long planoId, Long inviteePerfilId, PlanoConviteStatus status);

    @Query("""
            SELECT CASE WHEN COUNT(pc) > 0 THEN true ELSE false END
            FROM PlanoConvite pc
            WHERE pc.plano.id = :planoId
              AND pc.inviteePerfil IS NULL
              AND LOWER(pc.inviteeEmail) = LOWER(:inviteeEmail)
              AND pc.status = :status
            """)
    boolean existsByPlanoAndInviteeEmailAndStatus(@Param("planoId") Long planoId,
                                                  @Param("inviteeEmail") String inviteeEmail,
                                                  @Param("status") PlanoConviteStatus status);
}
