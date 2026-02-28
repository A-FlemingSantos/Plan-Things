package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.TarefaRequest;
import com.projectmanager.planthings.model.dto.TarefaResponse;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.TarefaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<TarefaResponse>> findAllByLista(@PathVariable Long perfilId, @PathVariable Long listaId) {
        List<Tarefa> tarefas = tarefaService.findAllByLista(perfilId, listaId);
        return ResponseEntity.ok(tarefas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<TarefaResponse> findById(@PathVariable Long perfilId, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(tarefaService.findById(perfilId, id)));
    }

    @PostMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<TarefaResponse> save(@PathVariable Long perfilId, @PathVariable Long listaId,
                                               @Valid @RequestBody TarefaRequest request) {
        Tarefa nova = tarefaService.save(perfilId, listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(nova));
    }

    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<TarefaResponse> update(@PathVariable Long perfilId, @PathVariable Long id,
                                                 @Valid @RequestBody TarefaRequest request) {
        Tarefa atualizada = tarefaService.update(perfilId, id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> delete(@PathVariable Long perfilId, @PathVariable Long id) {
        tarefaService.delete(perfilId, id);
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
