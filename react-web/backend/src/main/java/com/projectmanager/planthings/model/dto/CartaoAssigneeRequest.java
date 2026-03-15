package com.projectmanager.planthings.model.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CartaoAssigneeRequest {

    @NotNull(message = "A lista de perfis é obrigatória")
    @NotEmpty(message = "Informe ao menos um perfil para atribuir")
    private List<Long> perfilIds;

    public List<Long> getPerfilIds() {
        return perfilIds;
    }

    public void setPerfilIds(List<Long> perfilIds) {
        this.perfilIds = perfilIds;
    }
}
