package com.projectmanager.planthings.config.security;

import com.projectmanager.planthings.model.entity.Perfil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final Duration expiration;

    public JwtService(@Value("${security.jwt.secret}") String secret,
                      @Value("${security.jwt.expiration-minutes:120}") long expirationMinutes) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String generateToken(Perfil perfil) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(perfil.getId()))
                .claim("email", perfil.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiration)))
                .signWith(signingKey)
                .compact();
    }

    public AuthenticatedPerfil parseToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Long perfilId = Long.parseLong(claims.getSubject());
        String email = claims.get("email", String.class);
        return new AuthenticatedPerfil(perfilId, email);
    }
}
