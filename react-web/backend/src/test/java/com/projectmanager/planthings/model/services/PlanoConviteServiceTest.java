package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.model.entity.*;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoConviteRepository;
import com.projectmanager.planthings.model.repository.PlanoMembroRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlanoConviteServiceTest {

    @Mock
    private PlanoConviteRepository planoConviteRepository;

    @Mock
    private PlanoRepository planoRepository;

    @Mock
    private PerfilRepository perfilRepository;

    @Mock
    private PlanoMembroRepository planoMembroRepository;

    @InjectMocks
    private PlanoConviteService planoConviteService;

    @Test
    void shouldCreateInviteForProfile() {
        Plano plano = new Plano();
        plano.setId(1L);

        Perfil inviter = new Perfil();
        inviter.setId(10L);

        Perfil invitee = new Perfil();
        invitee.setId(11L);

        when(planoRepository.findById(1L)).thenReturn(Optional.of(plano));
        when(perfilRepository.findByIdAndCodStatusTrue(10L)).thenReturn(Optional.of(inviter));
        when(perfilRepository.findByIdAndCodStatusTrue(11L)).thenReturn(Optional.of(invitee));
        when(planoConviteRepository.existsByPlanoIdAndInviteePerfilIdAndStatus(1L, 11L, PlanoConviteStatus.PENDING))
                .thenReturn(false);
        when(planoConviteRepository.save(any(PlanoConvite.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PlanoConvite result = planoConviteService.createInvite(1L, 10L, 11L, null, "Olá");

        assertEquals(PlanoConviteStatus.PENDING, result.getStatus());
        assertEquals(11L, result.getInviteePerfil().getId());
        verify(planoConviteRepository).save(any(PlanoConvite.class));
    }

    @Test
    void shouldRejectDuplicatePendingInvite() {
        Plano plano = new Plano();
        plano.setId(1L);

        Perfil inviter = new Perfil();
        inviter.setId(10L);

        when(planoRepository.findById(1L)).thenReturn(Optional.of(plano));
        when(perfilRepository.findByIdAndCodStatusTrue(10L)).thenReturn(Optional.of(inviter));
        when(planoConviteRepository.existsByPlanoAndInviteeEmailAndStatus(1L, "a@b.com", PlanoConviteStatus.PENDING))
                .thenReturn(true);

        assertThrows(ConflictException.class, () ->
                planoConviteService.createInvite(1L, 10L, null, "a@b.com", null));
    }

    @Test
    void shouldAcceptInviteAndCreateMemberWhenNeeded() {
        Plano plano = new Plano();
        plano.setId(1L);

        Perfil invitee = new Perfil();
        invitee.setId(11L);
        invitee.setEmail("invitee@test.com");

        PlanoConvite convite = new PlanoConvite();
        convite.setId(50L);
        convite.setPlano(plano);
        convite.setInviteePerfil(invitee);
        convite.setStatus(PlanoConviteStatus.PENDING);

        when(planoConviteRepository.findById(50L)).thenReturn(Optional.of(convite));
        when(perfilRepository.findByIdAndCodStatusTrue(11L)).thenReturn(Optional.of(invitee));
        when(planoMembroRepository.existsByPlanoIdAndPerfilId(1L, 11L)).thenReturn(false);
        when(planoConviteRepository.save(any(PlanoConvite.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PlanoConvite result = planoConviteService.acceptInvite(50L, 11L);

        assertEquals(PlanoConviteStatus.ACCEPTED, result.getStatus());
        verify(planoMembroRepository).save(any(PlanoMembro.class));
    }

    @Test
    void shouldRejectInvite() {
        Plano plano = new Plano();
        plano.setId(1L);

        Perfil invitee = new Perfil();
        invitee.setId(11L);
        invitee.setEmail("invitee@test.com");

        PlanoConvite convite = new PlanoConvite();
        convite.setId(60L);
        convite.setPlano(plano);
        convite.setInviteePerfil(invitee);
        convite.setStatus(PlanoConviteStatus.PENDING);

        when(planoConviteRepository.findById(60L)).thenReturn(Optional.of(convite));
        when(perfilRepository.findByIdAndCodStatusTrue(11L)).thenReturn(Optional.of(invitee));
        when(planoConviteRepository.save(any(PlanoConvite.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PlanoConvite result = planoConviteService.rejectInvite(60L, 11L);

        assertEquals(PlanoConviteStatus.REJECTED, result.getStatus());
        verify(planoMembroRepository, never()).save(any(PlanoMembro.class));
    }
}
