package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PerfilServiceTest {

    @Mock
    private PerfilRepository perfilRepository;

    @InjectMocks
    private PerfilService perfilService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void shouldReturnOnlyActiveProfilesOnFindAll() {
        Perfil ativo = new Perfil();
        ativo.setId(1L);
        ativo.setCodStatus(true);

        when(perfilRepository.findByCodStatusTrue()).thenReturn(List.of(ativo));

        List<Perfil> resultado = perfilService.findAll();

        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).getId());
        verify(perfilRepository).findByCodStatusTrue();
    }

    @Test
    void shouldFindActiveProfileById() {
        Perfil ativo = new Perfil();
        ativo.setId(10L);
        ativo.setCodStatus(true);

        when(perfilRepository.findByIdAndCodStatusTrue(10L)).thenReturn(Optional.of(ativo));

        Perfil resultado = perfilService.findById(10L);

        assertEquals(10L, resultado.getId());
        verify(perfilRepository).findByIdAndCodStatusTrue(10L);
    }

    @Test
    void shouldThrowNotFoundWhenProfileIsInactiveOrMissing() {
        when(perfilRepository.findByIdAndCodStatusTrue(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> perfilService.findById(99L));

        verify(perfilRepository).findByIdAndCodStatusTrue(99L);
    }

    @Test
    void shouldHashNewPasswordsWithPasswordEncoderAndDifferentSalt() {
        Perfil primeiro = buildPerfil("primeiro@planthings.com", "senha123");
        Perfil segundo = buildPerfil("segundo@planthings.com", "senha123");

        when(perfilRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());
        when(perfilRepository.save(Objects.requireNonNull(primeiro))).thenReturn(Objects.requireNonNull(primeiro));
        when(perfilRepository.save(Objects.requireNonNull(segundo))).thenReturn(Objects.requireNonNull(segundo));

        Perfil salvoUm = perfilService.save(primeiro);
        Perfil salvoDois = perfilService.save(segundo);

        String hashUm = new String(salvoUm.getSenha(), StandardCharsets.UTF_8);
        String hashDois = new String(salvoDois.getSenha(), StandardCharsets.UTF_8);

        assertTrue(passwordEncoder.matches("senha123", hashUm));
        assertTrue(passwordEncoder.matches("senha123", hashDois));
        assertNotEquals(hashUm, hashDois);
        assertTrue(salvoUm.getCodStatus());
        assertTrue(salvoDois.getCodStatus());
    }


    @Test
    void shouldNormalizeEmailOnSave() {
        Perfil perfil = buildPerfil("  USER@Example.COM  ", "senha123");

        when(perfilRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.empty());
        when(perfilRepository.save(Objects.requireNonNull(perfil))).thenReturn(Objects.requireNonNull(perfil));

        Perfil salvo = perfilService.save(perfil);

        assertEquals("user@example.com", salvo.getEmail());
    }

    @Test
    void shouldUpgradeLegacySha256HashWhenLoginSucceeds() {
        byte[] legacyHash = hashLegacy("senha123");
        Perfil perfil = new Perfil();
        perfil.setId(20L);
        perfil.setEmail("legacy@planthings.com");
        perfil.setCodStatus(true);
        perfil.setSenha(legacyHash);

        when(perfilRepository.findByEmailIgnoreCase("legacy@planthings.com"))
                .thenReturn(Optional.of(Objects.requireNonNull(perfil)));
        when(perfilRepository.save(Objects.requireNonNull(perfil))).thenReturn(Objects.requireNonNull(perfil));

        Perfil autenticado = perfilService.login("legacy@planthings.com", "senha123");
        String hashAtualizado = new String(autenticado.getSenha(), StandardCharsets.UTF_8);

        assertEquals(perfil, autenticado);
        assertTrue(passwordEncoder.matches("senha123", hashAtualizado));
        assertFalse(java.util.Arrays.equals(legacyHash, autenticado.getSenha()));
        verify(perfilRepository).save(perfil);
    }

    @Test
    void shouldAuthenticateWithStoredPasswordEncoderHashWithoutRehashing() {
        Perfil perfil = new Perfil();
        perfil.setId(30L);
        perfil.setEmail("bcrypt@planthings.com");
        perfil.setCodStatus(true);
        perfil.setSenha(passwordEncoder.encode("senha123").getBytes(StandardCharsets.UTF_8));

        when(perfilRepository.findByEmailIgnoreCase("bcrypt@planthings.com")).thenReturn(Optional.of(perfil));

        Perfil autenticado = perfilService.login("bcrypt@planthings.com", "senha123");

        assertEquals(perfil, autenticado);
        verify(perfilRepository, never()).save(perfil);
    }

    @Test
    void shouldRejectInvalidPasswordWithoutUpgradingLegacyHash() {
        Perfil perfil = new Perfil();
        perfil.setId(40L);
        perfil.setEmail("legacy-invalid@planthings.com");
        perfil.setCodStatus(true);
        perfil.setSenha(hashLegacy("senha123"));

        when(perfilRepository.findByEmailIgnoreCase("legacy-invalid@planthings.com")).thenReturn(Optional.of(perfil));

        assertThrows(
                UnauthorizedException.class,
                () -> perfilService.login("legacy-invalid@planthings.com", "senhaErrada")
        );

        verify(perfilRepository, never()).save(perfil);
    }

    private @NonNull Perfil buildPerfil(String email, String senhaTexto) {
        Perfil perfil = new Perfil();
        perfil.setEmail(email);
        perfil.setNome("Maria");
        perfil.setCodStatus(false);
        perfil.setSenhaTexto(senhaTexto);
        return perfil;
    }

    private byte[] hashLegacy(String senhaPura) {
        try {
            return MessageDigest.getInstance("SHA-256")
                    .digest(senhaPura.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
