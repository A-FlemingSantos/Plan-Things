package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.PlanoRequest;
import com.projectmanager.planthings.model.dto.ConviteRequest;
import com.projectmanager.planthings.model.dto.ConviteResponse;
import com.projectmanager.planthings.model.dto.PlanoMembroResponse;
import com.projectmanager.planthings.model.dto.PlanoResponse;
import com.projectmanager.planthings.model.entity.PlanoConvite;
import com.projectmanager.planthings.model.entity.PlanoMembro;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.services.PlanoColaboracaoService;
import com.projectmanager.planthings.model.services.PlanoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planos")
public class PlanoController {

    @Autowired
    private PlanoService planoService;

    @Autowired
    private PlanoColaboracaoService planoColaboracaoService;

    @GetMapping("/perfil/{perfilId}")
    public ResponseEntity<List<PlanoResponse>> findAllByPerfil(@PathVariable Long perfilId) {
        List<Plano> planos = planoService.findAllByPerfilId(perfilId);
        return ResponseEntity.ok(planos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<PlanoResponse> findById(@PathVariable Long perfilId, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(planoService.findById(perfilId, id)));
    }

    @PostMapping("/perfil/{perfilId}")
    public ResponseEntity<PlanoResponse> save(@PathVariable Long perfilId, @Valid @RequestBody PlanoRequest request) {
        Plano novoPlano = planoService.save(perfilId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novoPlano));
    }

    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<PlanoResponse> update(@PathVariable Long perfilId, @PathVariable Long id,
                                                @Valid @RequestBody PlanoRequest request) {
        Plano atualizado = planoService.update(perfilId, id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> delete(@PathVariable Long perfilId, @PathVariable Long id) {
        planoService.delete(perfilId, id);
        return ResponseEntity.ok("Plano removido com sucesso");
    }

    @PostMapping("/{planoId}/convites")
    public ResponseEntity<ConviteResponse> convidar(@PathVariable Long planoId,
                                                    @RequestParam Long perfilId,
                                                    @RequestBody ConviteRequest request) {
        PlanoConvite convite = planoColaboracaoService.convidar(planoId, perfilId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toConviteResponse(convite));
    }

    @GetMapping("/{planoId}/convites")
    public ResponseEntity<List<ConviteResponse>> listarConvites(@PathVariable Long planoId,
                                                                @RequestParam Long perfilId) {
        return ResponseEntity.ok(planoColaboracaoService.listarConvites(planoId, perfilId).stream()
                .map(this::toConviteResponse)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{planoId}/convites/{conviteId}/aceitar")
    public ResponseEntity<ConviteResponse> aceitarConvite(@PathVariable Long planoId,
                                                          @PathVariable Long conviteId,
                                                          @RequestParam Long perfilId) {
        PlanoConvite convite = planoColaboracaoService.aceitarConvite(planoId, conviteId, perfilId);
        return ResponseEntity.ok(toConviteResponse(convite));
    }

    @PostMapping("/{planoId}/convites/{conviteId}/recusar")
    public ResponseEntity<ConviteResponse> recusarConvite(@PathVariable Long planoId,
                                                          @PathVariable Long conviteId,
                                                          @RequestParam Long perfilId) {
        PlanoConvite convite = planoColaboracaoService.recusarConvite(planoId, conviteId, perfilId);
        return ResponseEntity.ok(toConviteResponse(convite));
    }

    @GetMapping("/{planoId}/membros")
    public ResponseEntity<List<PlanoMembroResponse>> listarMembros(@PathVariable Long planoId,
                                                                   @RequestParam Long perfilId) {
        return ResponseEntity.ok(planoColaboracaoService.listarMembros(planoId, perfilId).stream()
                .map(this::toMembroResponse)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/{planoId}/membros/{membroPerfilId}")
    public ResponseEntity<String> removerMembro(@PathVariable Long planoId,
                                                @PathVariable Long membroPerfilId,
                                                @RequestParam Long perfilId) {
        planoColaboracaoService.removerMembro(planoId, membroPerfilId, perfilId);
        return ResponseEntity.ok("Membro removido com sucesso");
    }

    private Plano toEntity(PlanoRequest request) {
        Plano plano = new Plano();
        plano.setNome(request.getNome());
        plano.setWallpaperUrl(request.getWallpaperUrl());
        return plano;
    }

    private PlanoResponse toResponse(Plano plano) {
        return new PlanoResponse(
                plano.getId(),
                plano.getNome(),
                plano.getWallpaperUrl(),
                plano.getPerfil() != null ? plano.getPerfil().getId() : null
        );
    }

    private ConviteResponse toConviteResponse(PlanoConvite convite) {
        return new ConviteResponse(
                convite.getId(),
                convite.getPlano().getId(),
                convite.getConvidadoPerfil().getId(),
                convite.getConvidadoEmail(),
                convite.getConvidadorPerfil().getId(),
                convite.getStatus().name(),
                convite.getCriadoEm(),
                convite.getRespondidoEm()
        );
    }

    private PlanoMembroResponse toMembroResponse(PlanoMembro membro) {
        return new PlanoMembroResponse(
                membro.getPerfil().getId(),
                membro.getPerfil().getEmail(),
                membro.getPerfil().getNome(),
                membro.getPapel().name()
        );
    }
}
