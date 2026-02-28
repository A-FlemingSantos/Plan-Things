package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.ListaRequest;
import com.projectmanager.planthings.model.dto.ListaResponse;
import com.projectmanager.planthings.model.entity.Lista;
import com.projectmanager.planthings.model.services.ListaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/listas")
public class ListaController {

    @Autowired
    private ListaService listaService;

    @GetMapping("/perfil/{perfilId}/plano/{planoId}")
    public ResponseEntity<List<ListaResponse>> findAllByPlano(@PathVariable Long perfilId, @PathVariable Long planoId) {
        List<Lista> listas = listaService.findAllByPlano(perfilId, planoId);
        return ResponseEntity.ok(listas.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<ListaResponse> findById(@PathVariable Long perfilId, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(listaService.findById(perfilId, id)));
    }

    @PostMapping("/perfil/{perfilId}/plano/{planoId}")
    public ResponseEntity<ListaResponse> save(@PathVariable Long perfilId, @PathVariable Long planoId,
                                              @Valid @RequestBody ListaRequest request) {
        Lista novaLista = listaService.save(perfilId, planoId, toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novaLista));
    }

    @PutMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<ListaResponse> update(@PathVariable Long perfilId, @PathVariable Long id,
                                                @Valid @RequestBody ListaRequest request) {
        Lista atualizada = listaService.update(perfilId, id, toEntity(request));
        return ResponseEntity.ok(toResponse(atualizada));
    }

    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> delete(@PathVariable Long perfilId, @PathVariable Long id) {
        listaService.delete(perfilId, id);
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
