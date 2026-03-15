package com.projectmanager.planthings.model.dto;

public record PlanoMembroResponse(
        Long perfilId,
        String email,
        String nome,
        String papel
) {
}

