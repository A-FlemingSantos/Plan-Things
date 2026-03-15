package com.projectmanager.planthings.model.dto;

import java.time.LocalDateTime;

public record ConviteResponse(
        Long id,
        Long planoId,
        Long convidadoPerfilId,
        String convidadoEmail,
        Long convidadorPerfilId,
        String status,
        LocalDateTime criadoEm,
        LocalDateTime respondidoEm
) {
}

