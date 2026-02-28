package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.PlanoRequest;
import com.projectmanager.planthings.model.dto.PlanoResponse;
import com.projectmanager.planthings.model.entity.Plano;
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
