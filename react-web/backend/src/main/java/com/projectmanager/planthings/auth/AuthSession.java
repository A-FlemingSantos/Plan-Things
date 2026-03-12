package com.projectmanager.planthings.auth;

import com.projectmanager.planthings.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public final class AuthSession {

    public static final String PERFIL_ID_SESSION_ATTRIBUTE = "planthings_authenticated_perfil_id";

    private AuthSession() {
    }

    public static void authenticate(HttpServletRequest request, Long perfilId) {
        invalidate(request);

        HttpSession session = request.getSession(true);
        session.setAttribute(PERFIL_ID_SESSION_ATTRIBUTE, perfilId);
    }

    public static Long requireAuthenticatedPerfilId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new UnauthorizedException("Autenticação necessária");
        }

        Object perfilId = session.getAttribute(PERFIL_ID_SESSION_ATTRIBUTE);
        if (perfilId instanceof Long authenticatedPerfilId) {
            return authenticatedPerfilId;
        }
        if (perfilId instanceof Number authenticatedPerfilId) {
            return authenticatedPerfilId.longValue();
        }

        throw new UnauthorizedException("Autenticação necessária");
    }

    public static void invalidate(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
