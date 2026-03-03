package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.CartaoResponse;
import com.projectmanager.planthings.model.dto.ReorderRequest;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.CartaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cartoes")
public class CartaoController {

    @Autowired
    private CartaoService cartaoService;

    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<CartaoResponse>> findAllByLista(@PathVariable Long perfilId, @PathVariable Long listaId) {
        List<Cartao> cartoes = cartaoService.findAllByLista(perfilId, listaId);
        return ResponseEntity.ok(cartoes.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<CartaoResponse> findById(@PathVariable Long perfilId, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(cartaoService.findById(perfilId, id)));
    }

    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> delete(@PathVariable Long perfilId, @PathVariable Long id) {
        cartaoService.delete(perfilId, id);
        return ResponseEntity.ok("Cartão removido com sucesso");
    }

    @PatchMapping("/perfil/{perfilId}/reorder")
    public ResponseEntity<String> reorder(@PathVariable Long perfilId,
                                          @Valid @RequestBody ReorderRequest request) {
        cartaoService.reorder(perfilId, request.getCards());
        return ResponseEntity.ok("Cartões reordenados com sucesso");
    }

    private CartaoResponse toResponse(Cartao cartao) {
        String tipo = "CARTAO";
        java.time.LocalDateTime dataConclusao = null;
        java.time.LocalDateTime dataInicio = null;
        java.time.LocalDateTime dataFim = null;

        if (cartao instanceof Tarefa tarefa) {
            tipo = "TAREFA";
            dataConclusao = tarefa.getDataConclusao();
        } else if (cartao instanceof Evento evento) {
            tipo = "EVENTO";
            dataInicio = evento.getDataInicio();
            dataFim = evento.getDataFim();
        }

        return new CartaoResponse(
                cartao.getId(),
                tipo,
                cartao.getNome(),
                cartao.getDescricao(),
                cartao.getCor(),
                cartao.getLista() != null ? cartao.getLista().getId() : null,
                cartao.getPosicao(),
                dataConclusao,
                dataInicio,
                dataFim
        );
    }
}
