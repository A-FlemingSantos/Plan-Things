package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.model.dto.ConviteRequest;
import com.projectmanager.planthings.model.entity.*;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import com.projectmanager.planthings.model.repository.PlanoConviteRepository;
import com.projectmanager.planthings.model.repository.PlanoMembroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PlanoColaboracaoService {

    @Autowired
    private PlanoAuthorizationService planoAuthorizationService;

    @Autowired
    private PlanoConviteRepository planoConviteRepository;

    @Autowired
    private PlanoMembroRepository planoMembroRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Transactional
    public PlanoConvite convidar(Long planoId, Long perfilId, ConviteRequest request) {
        planoAuthorizationService.assertManager(planoId, perfilId);
        Plano plano = planoAuthorizationService.getPlanoOrThrow(planoId);

        Perfil convidado = resolveConvidado(request);
        if (plano.getPerfil().getId().equals(convidado.getId())) {
            throw new ConflictException("O dono do plano já é MANAGER");
        }

        if (planoMembroRepository.findByPlanoIdAndPerfilId(planoId, convidado.getId()).isPresent()) {
            throw new ConflictException("Perfil já é membro deste plano");
        }

        if (planoConviteRepository.existsByPlanoIdAndConvidadoPerfilIdAndStatus(planoId, convidado.getId(), ConviteStatus.PENDING)) {
            throw new ConflictException("Já existe convite pendente para este perfil");
        }

        Perfil convidador = perfilRepository.findByIdAndCodStatusTrue(perfilId)
                .orElseThrow(() -> new NotFoundException("Perfil ativo não encontrado"));

        PlanoConvite convite = new PlanoConvite();
        convite.setPlano(plano);
        convite.setConvidadoPerfil(convidado);
        convite.setConvidadoEmail(convidado.getEmail());
        convite.setConvidadorPerfil(convidador);
        convite.setStatus(ConviteStatus.PENDING);
        convite.setCriadoEm(LocalDateTime.now());
        return planoConviteRepository.save(convite);
    }

    public List<PlanoConvite> listarConvites(Long planoId, Long perfilId) {
        planoAuthorizationService.assertCanViewPlano(planoId, perfilId);
        return planoConviteRepository.findByPlanoIdOrderByCriadoEmDesc(planoId);
    }

    @Transactional
    public PlanoConvite aceitarConvite(Long planoId, Long conviteId, Long perfilId) {
        PlanoConvite convite = getConvitePendente(planoId, conviteId);
        if (!convite.getConvidadoPerfil().getId().equals(perfilId)) {
            throw new BadRequestException("Somente o convidado pode aceitar o convite");
        }

        convite.setStatus(ConviteStatus.ACCEPTED);
        convite.setRespondidoEm(LocalDateTime.now());

        PlanoMembro membro = new PlanoMembro();
        membro.setPlano(convite.getPlano());
        membro.setPerfil(convite.getConvidadoPerfil());
        membro.setPapel(PlanoRole.MEMBER);
        planoMembroRepository.save(membro);

        return planoConviteRepository.save(convite);
    }

    @Transactional
    public PlanoConvite recusarConvite(Long planoId, Long conviteId, Long perfilId) {
        PlanoConvite convite = getConvitePendente(planoId, conviteId);
        if (!convite.getConvidadoPerfil().getId().equals(perfilId)) {
            throw new BadRequestException("Somente o convidado pode recusar o convite");
        }
        convite.setStatus(ConviteStatus.DECLINED);
        convite.setRespondidoEm(LocalDateTime.now());
        return planoConviteRepository.save(convite);
    }

    public List<PlanoMembro> listarMembros(Long planoId, Long perfilId) {
        planoAuthorizationService.assertCanViewPlano(planoId, perfilId);
        Plano plano = planoAuthorizationService.getPlanoOrThrow(planoId);

        List<PlanoMembro> membros = new ArrayList<>();
        PlanoMembro donoComoManager = new PlanoMembro();
        donoComoManager.setPlano(plano);
        donoComoManager.setPerfil(plano.getPerfil());
        donoComoManager.setPapel(PlanoRole.MANAGER);
        membros.add(donoComoManager);
        membros.addAll(planoMembroRepository.findByPlanoId(planoId));
        return membros;
    }

    @Transactional
    public void removerMembro(Long planoId, Long removerPerfilId, Long autorPerfilId) {
        planoAuthorizationService.assertManager(planoId, autorPerfilId);
        Plano plano = planoAuthorizationService.getPlanoOrThrow(planoId);
        if (plano.getPerfil().getId().equals(removerPerfilId)) {
            throw new BadRequestException("Não é permitido remover o dono do plano");
        }

        if (planoMembroRepository.findByPlanoIdAndPerfilId(planoId, removerPerfilId).isEmpty()) {
            throw new NotFoundException("Membro não encontrado no plano");
        }

        planoMembroRepository.deleteByPlanoIdAndPerfilId(planoId, removerPerfilId);
    }

    private PlanoConvite getConvitePendente(Long planoId, Long conviteId) {
        PlanoConvite convite = planoConviteRepository.findByIdAndPlanoId(conviteId, planoId)
                .orElseThrow(() -> new NotFoundException("Convite não encontrado"));
        if (convite.getStatus() != ConviteStatus.PENDING) {
            throw new ConflictException("Convite já respondido");
        }
        return convite;
    }

    private Perfil resolveConvidado(ConviteRequest request) {
        boolean hasEmail = request.getInviteeEmail() != null && !request.getInviteeEmail().isBlank();
        boolean hasUsername = request.getInviteeUsername() != null && !request.getInviteeUsername().isBlank();
        if (!hasEmail && !hasUsername) {
            throw new BadRequestException("Informe inviteeEmail ou inviteeUsername");
        }

        if (hasEmail) {
            return perfilRepository.findByEmail(request.getInviteeEmail().trim().toLowerCase(Locale.ROOT))
                    .filter(Perfil::getCodStatus)
                    .orElseThrow(() -> new NotFoundException("Perfil convidado não encontrado"));
        }

        return perfilRepository.findByCodStatusTrue().stream()
                .filter(p -> p.getNome() != null && p.getNome().equalsIgnoreCase(request.getInviteeUsername().trim()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Perfil convidado não encontrado"));
    }
}

