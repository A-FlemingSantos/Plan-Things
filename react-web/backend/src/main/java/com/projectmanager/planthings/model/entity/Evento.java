package com.projectmanager.planthings.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "Evento")
@PrimaryKeyJoinColumn(name = "id")
public class Evento extends Cartao {

    @Column(name = "data_inicio", columnDefinition = "DATETIME2(0)", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_fim", columnDefinition = "DATETIME2(0)", nullable = false)
    private LocalDateTime dataFim;

    @PrePersist
    @PreUpdate
    private void validarIntervalo() {
        if (dataInicio != null && dataFim != null && dataFim.isBefore(dataInicio)) {
            throw new IllegalArgumentException("Data fim não pode ser menor que data início");
        }
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
