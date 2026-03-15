package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.entity.*;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoConviteRepository;
import com.projectmanager.planthings.model.repository.PlanoMembroRepository;
import com.projectmanager.planthings.model.repository.PlanoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PlanoConviteService {

    @Autowired
    private PlanoConviteRepository planoConviteRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private PlanoMembroRepository planoMembroRepository;

    @Transactional
    public PlanoConvite createInvite(Long planoId,
                                     Long inviterPerfilId,
                                     Long inviteePerfilId,
                                     String inviteeEmail,
                                     String message) {
        if (inviteePerfilId == null && (inviteeEmail == null || inviteeEmail.isBlank())) {
            throw new BadRequestException("É obrigatório informar inviteePerfilId ou inviteeEmail");
        }

        Plano plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado"));
        Perfil inviterPerfil = ensurePerfilAtivo(inviterPerfilId);

        Perfil inviteePerfil = null;
        String normalizedInviteeEmail = normalizeEmail(inviteeEmail);

        if (inviteePerfilId != null) {
            inviteePerfil = ensurePerfilAtivo(inviteePerfilId);
            normalizedInviteeEmail = null;
        }

        ensureNoPendingDuplicate(planoId, inviteePerfilId, normalizedInviteeEmail);

        PlanoConvite convite = new PlanoConvite();
        convite.setPlano(plano);
        convite.setInviterPerfil(inviterPerfil);
        convite.setInviteePerfil(inviteePerfil);
        convite.setInviteeEmail(normalizedInviteeEmail);
        convite.setMessage(message);
        convite.setStatus(PlanoConviteStatus.PENDING);
        convite.setCreatedAt(LocalDateTime.now());

        return planoConviteRepository.save(convite);
    }

    @Transactional
    public PlanoConvite acceptInvite(Long conviteId, Long perfilId) {
        PlanoConvite convite = getPendingConvite(conviteId);
        Perfil responderPerfil = ensurePerfilAtivo(perfilId);

        validateResponder(convite, responderPerfil);

        if (!planoMembroRepository.existsByPlanoIdAndPerfilId(convite.getPlano().getId(), responderPerfil.getId())) {
            PlanoMembro membro = new PlanoMembro();
            membro.setPlano(convite.getPlano());
            membro.setPerfil(responderPerfil);
            membro.setCreatedAt(LocalDateTime.now());
            planoMembroRepository.save(membro);
        }

        convite.setStatus(PlanoConviteStatus.ACCEPTED);
        convite.setRespondedAt(LocalDateTime.now());
        return planoConviteRepository.save(convite);
    }

    @Transactional
    public PlanoConvite rejectInvite(Long conviteId, Long perfilId) {
        PlanoConvite convite = getPendingConvite(conviteId);
        Perfil responderPerfil = ensurePerfilAtivo(perfilId);

        validateResponder(convite, responderPerfil);

        convite.setStatus(PlanoConviteStatus.REJECTED);
        convite.setRespondedAt(LocalDateTime.now());
        return planoConviteRepository.save(convite);
    }

    private void validateResponder(PlanoConvite convite, Perfil responderPerfil) {
        if (convite.getInviteePerfil() != null && !convite.getInviteePerfil().getId().equals(responderPerfil.getId())) {
            throw new ConflictException("Convite não pertence ao perfil informado");
        }

        if (convite.getInviteePerfil() == null && convite.getInviteeEmail() != null
                && !convite.getInviteeEmail().equalsIgnoreCase(responderPerfil.getEmail())) {
            throw new ConflictException("E-mail do perfil não corresponde ao destinatário do convite");
        }
    }

    private void ensureNoPendingDuplicate(Long planoId, Long inviteePerfilId, String inviteeEmail) {
        boolean hasDuplicate;

        if (inviteePerfilId != null) {
            hasDuplicate = planoConviteRepository.existsByPlanoIdAndInviteePerfilIdAndStatus(
                    planoId,
                    inviteePerfilId,
                    PlanoConviteStatus.PENDING
            );
        } else {
            hasDuplicate = planoConviteRepository.existsByPlanoAndInviteeEmailAndStatus(
                    planoId,
                    inviteeEmail,
                    PlanoConviteStatus.PENDING
            );
        }

        if (hasDuplicate) {
            throw new ConflictException("Já existe convite pendente para esse destinatário nesse plano");
        }
    }

    private Perfil ensurePerfilAtivo(Long perfilId) {
        return perfilRepository.findByIdAndCodStatusTrue(perfilId)
                .orElseThrow(() -> new NotFoundException("Perfil ativo não encontrado"));
    }

    private PlanoConvite getPendingConvite(Long conviteId) {
        PlanoConvite convite = planoConviteRepository.findById(conviteId)
                .orElseThrow(() -> new NotFoundException("Convite não encontrado"));

        if (convite.getStatus() != PlanoConviteStatus.PENDING) {
            throw new ConflictException("Convite já foi respondido");
        }

        return convite;
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
