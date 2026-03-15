package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.model.dto.EventoRequest;
import com.projectmanager.planthings.model.dto.EventoResponse;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.services.EventoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/eventos")
public class EventoController extends AuthenticatedControllerSupport {

    @Autowired
    private EventoService eventoService;

    @GetMapping("/lista/{listaId}")
    public ResponseEntity<List<EventoResponse>> findAllByLista(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                               @PathVariable Long listaId) {
        List<Evento> eventos = eventoService.findAllByLista(resolvePerfilId(principal), listaId);
        return ResponseEntity.ok(eventos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponse> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(eventoService.findById(resolvePerfilId(principal), id)));
    }

    @PostMapping("/lista/{listaId}")
    public ResponseEntity<EventoResponse> save(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long listaId,
                                               @Valid @RequestBody EventoRequest request) {
        Evento novo = eventoService.save(resolvePerfilId(principal), listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponse> update(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody EventoRequest request) {
        Evento atualizado = eventoService.update(resolvePerfilId(principal), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        eventoService.delete(resolvePerfilId(principal), id);
        return ResponseEntity.ok("Evento removido com sucesso");
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<EventoResponse>> findAllByListaLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                                     @PathVariable Long perfilId,
                                                                     @PathVariable Long listaId) {
        List<Evento> eventos = eventoService.findAllByLista(resolvePerfilId(principal, perfilId), listaId);
        return ResponseEntity.ok(eventos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<EventoResponse> findByIdLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                         @PathVariable Long perfilId,
                                                         @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(eventoService.findById(resolvePerfilId(principal, perfilId), id)));
    }

    @Deprecated
    @PostMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<EventoResponse> saveLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                     @PathVariable Long perfilId,
                                                     @PathVariable Long listaId,
                                                     @Valid @RequestBody EventoRequest request) {
        Evento novo = eventoService.save(resolvePerfilId(principal, perfilId), listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novo));
    }

    @Deprecated
    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<EventoResponse> updateLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                       @PathVariable Long perfilId,
                                                       @PathVariable Long id,
                                                       @Valid @RequestBody EventoRequest request) {
        Evento atualizado = eventoService.update(resolvePerfilId(principal, perfilId), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @Deprecated
    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> deleteLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long perfilId,
                                               @PathVariable Long id) {
        eventoService.delete(resolvePerfilId(principal, perfilId), id);
        return ResponseEntity.ok("Evento removido com sucesso");
    }

    private Evento toEntity(EventoRequest request) {
        Evento evento = new Evento();
        evento.setNome(request.getNome());
        evento.setDescricao(request.getDescricao());
        evento.setCor(request.getCor());
        evento.setDataInicio(request.getDataInicio());
        evento.setDataFim(request.getDataFim());
        return evento;
    }

    private EventoResponse toResponse(Evento evento) {
        return new EventoResponse(
                evento.getId(),
                evento.getNome(),
                evento.getDescricao(),
                evento.getCor(),
                evento.getLista() != null ? evento.getLista().getId() : null,
                evento.getDataInicio(),
                evento.getDataFim()
        );
    }
}
