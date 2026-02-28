package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.EventoRequest;
import com.projectmanager.planthings.model.dto.EventoResponse;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.services.EventoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<EventoResponse>> findAllByLista(@PathVariable Long perfilId, @PathVariable Long listaId) {
        List<Evento> eventos = eventoService.findAllByLista(perfilId, listaId);
        return ResponseEntity.ok(eventos.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<EventoResponse> findById(@PathVariable Long perfilId, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(eventoService.findById(perfilId, id)));
    }

    @PostMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<EventoResponse> save(@PathVariable Long perfilId, @PathVariable Long listaId,
                                               @Valid @RequestBody EventoRequest request) {
        Evento novo = eventoService.save(perfilId, listaId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novo));
    }

    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<EventoResponse> update(@PathVariable Long perfilId, @PathVariable Long id,
                                                 @Valid @RequestBody EventoRequest request) {
        Evento atualizado = eventoService.update(perfilId, id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizado));
    }

    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> delete(@PathVariable Long perfilId, @PathVariable Long id) {
        eventoService.delete(perfilId, id);
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
