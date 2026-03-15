package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.model.dto.PlanoRequest;
import com.projectmanager.planthings.model.dto.PlanoResponse;
import com.projectmanager.planthings.model.entity.Plano;
import com.projectmanager.planthings.model.services.PlanoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/planos")
public class PlanoController extends AuthenticatedControllerSupport {

    @Autowired
    private PlanoService planoService;

    @GetMapping
    public ResponseEntity<List<PlanoResponse>> findAllByPerfil(@AuthenticationPrincipal AuthenticatedPerfil principal) {
        List<Plano> planos = planoService.findAllByPerfilId(resolvePerfilId(principal));
        return ResponseEntity.ok(planos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoResponse> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(planoService.findById(resolvePerfilId(principal), id)));
    }

    @PostMapping
    public ResponseEntity<PlanoResponse> save(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                              @Valid @RequestBody PlanoRequest request) {
        Plano novoPlano = planoService.save(resolvePerfilId(principal), toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novoPlano));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponse> update(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                @PathVariable Long id,
                                                @Valid @RequestBody PlanoRequest request) {
        Plano atualizado = planoService.update(resolvePerfilId(principal), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        planoService.delete(resolvePerfilId(principal), id);
        return ResponseEntity.ok("Plano removido com sucesso");
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}")
    public ResponseEntity<List<PlanoResponse>> findAllByPerfilLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                                     @PathVariable Long perfilId) {
        return findAllByPerfilValidated(principal, perfilId);
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<PlanoResponse> findByIdLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                        @PathVariable Long perfilId,
                                                        @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(planoService.findById(resolvePerfilId(principal, perfilId), id)));
    }

    @Deprecated
    @PostMapping("/perfil/{perfilId}")
    public ResponseEntity<PlanoResponse> saveLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                    @PathVariable Long perfilId,
                                                    @Valid @RequestBody PlanoRequest request) {
        Plano novoPlano = planoService.save(resolvePerfilId(principal, perfilId), toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novoPlano));
    }

    @Deprecated
    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<PlanoResponse> updateLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                      @PathVariable Long perfilId,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody PlanoRequest request) {
        Plano atualizado = planoService.update(resolvePerfilId(principal, perfilId), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @Deprecated
    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> deleteLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long perfilId,
                                               @PathVariable Long id) {
        planoService.delete(resolvePerfilId(principal, perfilId), id);
        return ResponseEntity.ok("Plano removido com sucesso");
    }

    private ResponseEntity<List<PlanoResponse>> findAllByPerfilValidated(AuthenticatedPerfil principal, Long perfilId) {
        List<Plano> planos = planoService.findAllByPerfilId(resolvePerfilId(principal, perfilId));
        return ResponseEntity.ok(planos.stream().map(this::toResponse).collect(Collectors.toList()));
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
}
