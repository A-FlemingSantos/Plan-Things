package com.projectmanager.planthings.model.dto;

import java.util.ArrayList;
import java.util.List;

public class PlanoBoardListaResponse {
    private Long id;
    private String nome;
    private String cor;
    private Long planoId;
    private List<CartaoResponse> cartoes = new ArrayList<>();

    public PlanoBoardListaResponse() {
    }

    public PlanoBoardListaResponse(Long id, String nome, String cor, Long planoId, List<CartaoResponse> cartoes) {
        this.id = id;
        this.nome = nome;
        this.cor = cor;
        this.planoId = planoId;
        setCartoes(cartoes);
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

    public List<CartaoResponse> getCartoes() {
        return cartoes;
    }

    public void setCartoes(List<CartaoResponse> cartoes) {
        this.cartoes = cartoes == null ? new ArrayList<>() : new ArrayList<>(cartoes);
    }
}
