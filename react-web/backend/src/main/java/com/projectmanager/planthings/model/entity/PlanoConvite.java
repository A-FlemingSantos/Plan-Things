package com.projectmanager.planthings.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PlanoConvite")
public class PlanoConvite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plano_id", nullable = false)
    private Plano plano;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inviter_perfil_id", nullable = false)
    private Perfil inviterPerfil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitee_perfil_id")
    private Perfil inviteePerfil;

    @Column(name = "invitee_email", columnDefinition = "VARCHAR(320)")
    private String inviteeEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private PlanoConviteStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "message", columnDefinition = "NVARCHAR(500)")
    private String message;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Plano getPlano() {
        return plano;
    }

    public void setPlano(Plano plano) {
        this.plano = plano;
    }

    public Perfil getInviterPerfil() {
        return inviterPerfil;
    }

    public void setInviterPerfil(Perfil inviterPerfil) {
        this.inviterPerfil = inviterPerfil;
    }

    public Perfil getInviteePerfil() {
        return inviteePerfil;
    }

    public void setInviteePerfil(Perfil inviteePerfil) {
        this.inviteePerfil = inviteePerfil;
    }

    public String getInviteeEmail() {
        return inviteeEmail;
    }

    public void setInviteeEmail(String inviteeEmail) {
        this.inviteeEmail = inviteeEmail;
    }

    public PlanoConviteStatus getStatus() {
        return status;
    }

    public void setStatus(PlanoConviteStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
