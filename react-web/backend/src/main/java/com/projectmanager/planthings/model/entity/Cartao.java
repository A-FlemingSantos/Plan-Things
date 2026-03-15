package com.projectmanager.planthings.model.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Cartao")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String nome;

    @Column(name = "descricao", columnDefinition = "NVARCHAR(500)")
    private String descricao;

    @Column(name = "cor", columnDefinition = "CHAR(7)")
    private String cor;

    @Column(name = "posicao", nullable = false)
    private Integer posicao = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lista_id", nullable = false)
    private Lista lista;

    @OneToMany(mappedBy = "cartao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartaoAtribuicao> atribuicoes = new ArrayList<>();

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

    public Integer getPosicao() {
        return posicao;
    }

    public void setPosicao(Integer posicao) {
        this.posicao = posicao;
    }

    public Lista getLista() {
        return lista;
    }

    public void setLista(Lista lista) {
        this.lista = lista;
    }

    public List<CartaoAtribuicao> getAtribuicoes() {
        return atribuicoes;
    }

    public void setAtribuicoes(List<CartaoAtribuicao> atribuicoes) {
        this.atribuicoes = atribuicoes;
    }
}
