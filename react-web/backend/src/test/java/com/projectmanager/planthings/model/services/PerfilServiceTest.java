package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PerfilServiceTest {

    @Mock
    private PerfilRepository perfilRepository;

    @InjectMocks
    private PerfilService perfilService;

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
}
