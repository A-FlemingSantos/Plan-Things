package com.projectmanager.planthings.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PlanoMembro", uniqueConstraints = @UniqueConstraint(columnNames = {"plano_id", "perfil_id"}))
public class PlanoMembro {

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
    @Column(name = "papel", nullable = false, length = 20)
    private PlanoRole papel;

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

    public PlanoRole getPapel() {
        return papel;
    }

    public void setPapel(PlanoRole papel) {
        this.papel = papel;
    }
}

