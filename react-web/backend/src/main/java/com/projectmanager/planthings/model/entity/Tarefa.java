package com.projectmanager.planthings.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "Tarefa")
@PrimaryKeyJoinColumn(name = "id")
public class Tarefa extends Cartao {

    @Column(name = "data_conclusao", columnDefinition = "DATETIME2(0)", nullable = false)
    private LocalDateTime dataConclusao;

    public LocalDateTime getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(LocalDateTime dataConclusao) {
        this.dataConclusao = dataConclusao;
    }
}
