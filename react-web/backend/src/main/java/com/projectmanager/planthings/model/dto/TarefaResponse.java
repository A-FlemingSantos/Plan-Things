package com.projectmanager.planthings.model.dto;

import java.time.LocalDateTime;

public class TarefaResponse {
    private Long id;
    private String nome;
    private String descricao;
    private String cor;
    private Long listaId;
    private LocalDateTime dataConclusao;

    public TarefaResponse() {
    }

    public TarefaResponse(Long id, String nome, String descricao, String cor, Long listaId, LocalDateTime dataConclusao) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.cor = cor;
        this.listaId = listaId;
        this.dataConclusao = dataConclusao;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Long getListaId() {
        return listaId;
    }

    public void setListaId(Long listaId) {
        this.listaId = listaId;
    }

    public LocalDateTime getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(LocalDateTime dataConclusao) {
        this.dataConclusao = dataConclusao;
    }
}
