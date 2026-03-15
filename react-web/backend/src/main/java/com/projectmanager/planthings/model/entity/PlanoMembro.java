package com.projectmanager.planthings.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "PlanoMembro",
        uniqueConstraints = {
                @UniqueConstraint(name = "UQ_PlanoMembro_Plano_Perfil", columnNames = {"plano_id", "perfil_id"})
        },
        indexes = {
                @Index(name = "IX_PlanoMembro_Plano", columnList = "plano_id"),
                @Index(name = "IX_PlanoMembro_Perfil", columnList = "perfil_id")
        }
)
public class PlanoMembro {

    public enum Papel {
        MANAGER,
        MEMBER
    }

    public enum Status {
        ACTIVE,
        REMOVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plano_id", nullable = false)
    private Plano plano;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;

    @Enumerated(EnumType.STRING)
    @Column(name = "papel", columnDefinition = "VARCHAR(20)", nullable = false)
    private Papel papel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "VARCHAR(20)")
    private Status status;

    @Column(name = "created_at", columnDefinition = "DATETIME2(0)", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

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

    public Perfil getPerfil() {
        return perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    public Papel getPapel() {
        return papel;
    }

    public void setPapel(Papel papel) {
        this.papel = papel;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
