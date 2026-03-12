package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class PerfilService {

    private static final int LEGACY_SHA256_HASH_LENGTH = 32;

    @Autowired
    private PerfilRepository perfilRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Perfil> findAll() {
        return perfilRepository.findByCodStatusTrue();
    }

    public Perfil save(Perfil perfil) {
        String normalizedEmail = normalizeEmail(perfil.getEmail());
        if (perfilRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new ConflictException("E-mail já cadastrado no sistema");
        }

        if (perfil.getSenhaTexto() == null || perfil.getSenhaTexto().isBlank()) {
            throw new BadRequestException("Senha é obrigatória");
        }

        perfil.setEmail(normalizedEmail);
        perfil.setSenha(hashSenhaSegura(perfil.getSenhaTexto()));
        perfil.setCodStatus(true);
        return perfilRepository.save(perfil);
    }

    public Perfil findById(Long id) {
        return perfilRepository.findByIdAndCodStatusTrue(id)
                .orElseThrow(() -> new NotFoundException("Perfil não encontrado: " + id));
    }

    public Perfil update(Long id, Perfil perfil) {
        Perfil perfilExistente = findById(id);
        String normalizedEmail = normalizeEmail(perfil.getEmail());

        if (!perfilExistente.getEmail().equalsIgnoreCase(normalizedEmail)) {
            if (perfilRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
                throw new ConflictException("E-mail já cadastrado no sistema");
            }
            perfilExistente.setEmail(normalizedEmail);
        }

        perfilExistente.setNome(perfil.getNome());
        perfilExistente.setSobrenome(perfil.getSobrenome());
        perfilExistente.setTelefone(perfil.getTelefone());

        if (perfil.getSenhaTexto() != null && !perfil.getSenhaTexto().isBlank()) {
            perfilExistente.setSenha(hashSenhaSegura(perfil.getSenhaTexto()));
        }

        return perfilRepository.save(perfilExistente);
    }

    public void delete(Long id) {
        Perfil perfilExistente = findById(id);
        perfilExistente.setCodStatus(false);
        perfilRepository.save(perfilExistente);
    }

    public Perfil login(String email, String senha) {
        String normalizedEmail = normalizeEmail(email);

        Perfil perfil = perfilRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("E-mail ou senha inválidos"));

        if (!perfil.getCodStatus()) {
            throw new UnauthorizedException("Perfil inativo");
        }

        if (!senhaConfere(perfil, senha)) {
            throw new UnauthorizedException("E-mail ou senha inválidos");
        }

        return perfil;
    }


    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("E-mail é obrigatório");
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }

    private boolean senhaConfere(Perfil perfil, String senhaPura) {
        byte[] senhaArmazenada = perfil.getSenha();
        if (senhaArmazenada == null || senhaArmazenada.length == 0) {
            throw new IllegalStateException("Perfil sem senha armazenada: " + perfil.getId());
        }

        if (isLegacySha256Hash(senhaArmazenada)) {
            boolean matches = Arrays.equals(senhaArmazenada, hashSenhaLegacy(senhaPura));
            if (matches) {
                perfil.setSenha(hashSenhaSegura(senhaPura));
                perfilRepository.save(perfil);
            }
            return matches;
        }

        String senhaCodificada = new String(senhaArmazenada, StandardCharsets.UTF_8);
        if (!isSupportedPasswordEncoderHash(senhaCodificada)) {
            throw new IllegalStateException("Formato de senha armazenada não suportado para perfil: " + perfil.getId());
        }

        return passwordEncoder.matches(senhaPura, senhaCodificada);
    }

    private boolean isLegacySha256Hash(byte[] senhaArmazenada) {
        return senhaArmazenada.length == LEGACY_SHA256_HASH_LENGTH;
    }

    private boolean isSupportedPasswordEncoderHash(String senhaCodificada) {
        return senhaCodificada.startsWith("$2a$")
                || senhaCodificada.startsWith("$2b$")
                || senhaCodificada.startsWith("$2y$");
    }

    private byte[] hashSenhaSegura(String senhaPura) {
        return passwordEncoder.encode(senhaPura).getBytes(StandardCharsets.UTF_8);
    }

    private byte[] hashSenhaLegacy(String senhaPura) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(senhaPura.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 não disponível", e);
        }
    }
}
