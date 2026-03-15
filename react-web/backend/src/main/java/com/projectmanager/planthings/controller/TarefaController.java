package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.model.dto.TarefaRequest;
import com.projectmanager.planthings.model.dto.TarefaResponse;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.TarefaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tarefas")
public class TarefaController extends AuthenticatedControllerSupport {

    @Autowired
    private TarefaService tarefaService;

    @GetMapping("/lista/{listaId}")
    public ResponseEntity<List<TarefaResponse>> findAllByLista(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                               @PathVariable Long listaId) {
        List<Tarefa> tarefas = tarefaService.findAllByLista(resolvePerfilId(principal), listaId);
        return ResponseEntity.ok(tarefas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarefaResponse> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(tarefaService.findById(resolvePerfilId(principal), id)));
    }

    @PostMapping("/lista/{listaId}")
    public ResponseEntity<TarefaResponse> save(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long listaId,
                                               @Valid @RequestBody TarefaRequest request) {
        Tarefa nova = tarefaService.save(resolvePerfilId(principal), listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(nova));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> update(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody TarefaRequest request) {
        Tarefa atualizada = tarefaService.update(resolvePerfilId(principal), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        tarefaService.delete(resolvePerfilId(principal), id);
        return ResponseEntity.ok("Tarefa removida com sucesso");
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<TarefaResponse>> findAllByListaLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                                     @PathVariable Long perfilId,
                                                                     @PathVariable Long listaId) {
        List<Tarefa> tarefas = tarefaService.findAllByLista(resolvePerfilId(principal, perfilId), listaId);
        return ResponseEntity.ok(tarefas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<TarefaResponse> findByIdLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                         @PathVariable Long perfilId,
                                                         @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(tarefaService.findById(resolvePerfilId(principal, perfilId), id)));
    }

    @Deprecated
    @PostMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<TarefaResponse> saveLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                     @PathVariable Long perfilId,
                                                     @PathVariable Long listaId,
                                                     @Valid @RequestBody TarefaRequest request) {
        Tarefa nova = tarefaService.save(resolvePerfilId(principal, perfilId), listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(nova));
    }

    @Deprecated
    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<TarefaResponse> updateLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                       @PathVariable Long perfilId,
                                                       @PathVariable Long id,
                                                       @Valid @RequestBody TarefaRequest request) {
        Tarefa atualizada = tarefaService.update(resolvePerfilId(principal, perfilId), id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @Deprecated
    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> deleteLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long perfilId,
                                               @PathVariable Long id) {
        tarefaService.delete(resolvePerfilId(principal, perfilId), id);
        return ResponseEntity.ok("Tarefa removida com sucesso");
    }

    private Tarefa toEntity(TarefaRequest request) {
        Tarefa tarefa = new Tarefa();
        tarefa.setNome(request.getNome());
        tarefa.setDescricao(request.getDescricao());
        tarefa.setCor(request.getCor());
        tarefa.setDataConclusao(request.getDataConclusao());
        return tarefa;
    }

    private TarefaResponse toResponse(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId(),
                tarefa.getNome(),
                tarefa.getDescricao(),
                tarefa.getCor(),
                tarefa.getLista() != null ? tarefa.getLista().getId() : null,
                tarefa.getDataConclusao()
        );
    }
}
