package com.projectmanager.planthings.model.dto;

public class ListaResponse {
    private Long id;
    private String nome;
    private String cor;
    private Long planoId;

    public ListaResponse() {
    }

    public ListaResponse(Long id, String nome, String cor, Long planoId) {
        this.id = id;
        this.nome = nome;
        this.cor = cor;
        this.planoId = planoId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Long getPlanoId() {
        return planoId;
    }

    public void setPlanoId(Long planoId) {
        this.planoId = planoId;
    }
}
