package com.projectmanager.planthings.model.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CartaoAtribuicaoRequest {
    @NotNull
    private List<Long> perfilIds;

    public List<Long> getPerfilIds() {
        return perfilIds;
    }

    public void setPerfilIds(List<Long> perfilIds) {
        this.perfilIds = perfilIds;
    }
}

