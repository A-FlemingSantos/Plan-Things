package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.repository.CartaoRepository;
import com.projectmanager.planthings.model.repository.ListaRepository;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlanoServiceTest {

    @Mock
    private PlanoRepository planoRepository;

    @Mock
    private PerfilRepository perfilRepository;

    @Mock
    private ListaRepository listaRepository;

    @Mock
    private CartaoRepository cartaoRepository;

    @InjectMocks
    private PlanoService planoService;

    @Test
    void shouldRejectNewBase64WallpaperOnSave() {
        Perfil perfil = new Perfil();
        perfil.setId(1L);
        perfil.setCodStatus(true);

        Plano novoPlano = new Plano();
        novoPlano.setNome("Plano com imagem");
        novoPlano.setWallpaperUrl("data:image/jpeg;base64,abc123");

        when(perfilRepository.findByIdAndCodStatusTrue(1L)).thenReturn(Optional.of(perfil));

        assertThrows(BadRequestException.class, () -> planoService.save(1L, novoPlano));

        verify(planoRepository, never()).save(novoPlano);
    }

    @Test
    void shouldAllowLegacyBase64WallpaperWhenUpdatingWithoutChangingReference() {
        Perfil perfil = new Perfil();
        perfil.setId(1L);
        perfil.setCodStatus(true);

        Plano existente = new Plano();
        existente.setId(2L);
        existente.setNome("Plano antigo");
        existente.setWallpaperUrl("data:image/jpeg;base64,legacy");
        existente.setPerfil(perfil);

        Plano atualizacao = new Plano();
        atualizacao.setNome("Plano atualizado");
        atualizacao.setWallpaperUrl("data:image/jpeg;base64,legacy");

        when(perfilRepository.findByIdAndCodStatusTrue(1L)).thenReturn(Optional.of(perfil));
        when(planoRepository.findByIdAndPerfilId(2L, 1L)).thenReturn(Optional.of(existente));
        when(planoRepository.save(existente)).thenReturn(existente);

        Plano resultado = planoService.update(1L, 2L, atualizacao);

        assertEquals("Plano atualizado", resultado.getNome());
        assertEquals("data:image/jpeg;base64,legacy", resultado.getWallpaperUrl());
        verify(planoRepository).save(existente);
    }

    @Test
    void shouldRejectReplacingWallpaperWithNewBase64OnUpdate() {
        Perfil perfil = new Perfil();
        perfil.setId(1L);
        perfil.setCodStatus(true);

        Plano existente = new Plano();
        existente.setId(2L);
        existente.setNome("Plano antigo");
        existente.setWallpaperUrl("linear-gradient(135deg, #3b82f6, #6366f1)");
        existente.setPerfil(perfil);

        Plano atualizacao = new Plano();
        atualizacao.setNome("Plano atualizado");
        atualizacao.setWallpaperUrl("data:image/png;base64,nova-imagem");

        when(perfilRepository.findByIdAndCodStatusTrue(1L)).thenReturn(Optional.of(perfil));
        when(planoRepository.findByIdAndPerfilId(2L, 1L)).thenReturn(Optional.of(existente));

        assertThrows(BadRequestException.class, () -> planoService.update(1L, 2L, atualizacao));

        verify(planoRepository, never()).save(existente);
    }
}
