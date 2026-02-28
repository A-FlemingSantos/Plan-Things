package com.projectmanager.planthings.model.dto;

import java.time.LocalDateTime;

public class CartaoResponse {
    private Long id;
    private String tipo;
    private String nome;
    private String descricao;
    private String cor;
    private Long listaId;
    private LocalDateTime dataConclusao;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;

    public CartaoResponse() {
    }

    public CartaoResponse(Long id, String tipo, String nome, String descricao, String cor, Long listaId,
                          LocalDateTime dataConclusao, LocalDateTime dataInicio, LocalDateTime dataFim) {
        this.id = id;
        this.tipo = tipo;
        this.nome = nome;
        this.descricao = descricao;
        this.cor = cor;
        this.listaId = listaId;
        this.dataConclusao = dataConclusao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
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

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }
}
