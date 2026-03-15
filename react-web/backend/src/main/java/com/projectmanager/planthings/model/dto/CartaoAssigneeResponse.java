package com.projectmanager.planthings.model.dto;

public class CartaoAssigneeResponse {
    private Long perfilId;
    private String nome;
    private String email;

    public CartaoAssigneeResponse() {
    }

    public CartaoAssigneeResponse(Long perfilId, String nome, String email) {
        this.perfilId = perfilId;
        this.nome = nome;
        this.email = email;
    }

    public Long getPerfilId() {
        return perfilId;
    }

    public void setPerfilId(Long perfilId) {
        this.perfilId = perfilId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
