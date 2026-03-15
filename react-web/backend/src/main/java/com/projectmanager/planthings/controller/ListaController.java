package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.model.dto.ListaRequest;
import com.projectmanager.planthings.model.dto.ListaResponse;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.services.ListaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/listas")
public class ListaController extends AuthenticatedControllerSupport {

    @Autowired
    private ListaService listaService;

    @GetMapping("/plano/{planoId}")
    public ResponseEntity<List<ListaResponse>> findAllByPlano(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                              @PathVariable Long planoId) {
        List<Lista> listas = listaService.findAllByPlano(resolvePerfilId(principal), planoId);
        return ResponseEntity.ok(listas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListaResponse> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(listaService.findById(resolvePerfilId(principal), id)));
    }

    @PostMapping("/plano/{planoId}")
    public ResponseEntity<ListaResponse> save(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                              @PathVariable Long planoId,
                                              @Valid @RequestBody ListaRequest request) {
        Lista novaLista = listaService.save(resolvePerfilId(principal), planoId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novaLista));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListaResponse> update(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                @PathVariable Long id,
                                                @Valid @RequestBody ListaRequest request) {
        Lista atualizada = listaService.update(resolvePerfilId(principal), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        listaService.delete(resolvePerfilId(principal), id);
        return ResponseEntity.ok("Lista removida com sucesso");
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/plano/{planoId}")
    public ResponseEntity<List<ListaResponse>> findAllByPlanoLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                                    @PathVariable Long perfilId,
                                                                    @PathVariable Long planoId) {
        List<Lista> listas = listaService.findAllByPlano(resolvePerfilId(principal, perfilId), planoId);
        return ResponseEntity.ok(listas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<ListaResponse> findByIdLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                        @PathVariable Long perfilId,
                                                        @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(listaService.findById(resolvePerfilId(principal, perfilId), id)));
    }

    @Deprecated
    @PostMapping("/perfil/{perfilId}/plano/{planoId}")
    public ResponseEntity<ListaResponse> saveLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                    @PathVariable Long perfilId,
                                                    @PathVariable Long planoId,
                                                    @Valid @RequestBody ListaRequest request) {
        Lista novaLista = listaService.save(resolvePerfilId(principal, perfilId), planoId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novaLista));
    }

    @Deprecated
    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<ListaResponse> updateLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                      @PathVariable Long perfilId,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody ListaRequest request) {
        Lista atualizada = listaService.update(resolvePerfilId(principal, perfilId), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @Deprecated
    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> deleteLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long perfilId,
                                               @PathVariable Long id) {
        listaService.delete(resolvePerfilId(principal, perfilId), id);
        return ResponseEntity.ok("Lista removida com sucesso");
    }

    private Lista toEntity(ListaRequest request) {
        Lista lista = new Lista();
        lista.setNome(request.getNome());
        lista.setCor(request.getCor());
        return lista;
    }

    private ListaResponse toResponse(Lista lista) {
        return new ListaResponse(
                lista.getId(),
                lista.getNome(),
                lista.getCor(),
                lista.getPlano() != null ? lista.getPlano().getId() : null
        );
    }
}
