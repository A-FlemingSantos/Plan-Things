package com.projectmanager.planthings.model.dto;

import com.projectmanager.planthings.model.entity.Perfil;

public class PerfilResponse {

    private Long id;
    private String email;
    private String nome;
    private String sobrenome;
    private String telefone;

    public PerfilResponse(Perfil perfil) {
        this.id = perfil.getId();
        this.email = perfil.getEmail();
        this.nome = perfil.getNome();
        this.sobrenome = perfil.getSobrenome();
        this.telefone = perfil.getTelefone();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNome() {
        return nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public String getTelefone() {
        return telefone;
    }
}
