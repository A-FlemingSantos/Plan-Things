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
    @JoinColumn(name = "convidado_perfil_id", nullable = false)
    private Perfil convidadoPerfil;

    @Column(name = "convidado_email", nullable = false, length = 320)
    private String convidadoEmail;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "convidador_perfil_id", nullable = false)
    private Perfil convidadorPerfil;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ConviteStatus status;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "respondido_em")
    private LocalDateTime respondidoEm;

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

    public Perfil getConvidadoPerfil() {
        return convidadoPerfil;
    }

    public void setConvidadoPerfil(Perfil convidadoPerfil) {
        this.convidadoPerfil = convidadoPerfil;
    }

    public String getConvidadoEmail() {
        return convidadoEmail;
    }

    public void setConvidadoEmail(String convidadoEmail) {
        this.convidadoEmail = convidadoEmail;
    }

    public Perfil getConvidadorPerfil() {
        return convidadorPerfil;
    }

    public void setConvidadorPerfil(Perfil convidadorPerfil) {
        this.convidadorPerfil = convidadorPerfil;
    }

    public ConviteStatus getStatus() {
        return status;
    }

    public void setStatus(ConviteStatus status) {
        this.status = status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getRespondidoEm() {
        return respondidoEm;
    }

    public void setRespondidoEm(LocalDateTime respondidoEm) {
        this.respondidoEm = respondidoEm;
    }
}

