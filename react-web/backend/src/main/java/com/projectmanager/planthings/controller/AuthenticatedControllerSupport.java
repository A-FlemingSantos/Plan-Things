package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.exception.UnauthorizedException;

public abstract class AuthenticatedControllerSupport {

    protected Long resolvePerfilId(AuthenticatedPerfil principal) {
        if (principal == null || principal.perfilId() == null) {
            throw new UnauthorizedException("Token de autenticação inválido ou ausente");
        }
        return principal.perfilId();
    }

    protected Long resolvePerfilId(AuthenticatedPerfil principal, Long perfilIdLegado) {
        if (principal == null || principal.perfilId() == null) {
            if (perfilIdLegado == null) {
                throw new UnauthorizedException("Token de autenticação inválido ou ausente");
            }
            return perfilIdLegado;
        }

        Long perfilIdToken = principal.perfilId();
        if (perfilIdLegado != null && !perfilIdLegado.equals(perfilIdToken)) {
            throw new UnauthorizedException("Perfil do token não corresponde ao perfil informado na rota");
        }
        return perfilIdToken;
    }
}
