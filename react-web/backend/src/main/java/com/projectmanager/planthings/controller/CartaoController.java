package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.model.dto.CartaoResponse;
import com.projectmanager.planthings.model.dto.ReorderRequest;
import com.projectmanager.planthings.model.entity.Cartao;
import com.projectmanager.planthings.model.entity.Evento;
import com.projectmanager.planthings.model.entity.Tarefa;
import com.projectmanager.planthings.model.services.CartaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cartoes")
public class CartaoController extends AuthenticatedControllerSupport {

    @Autowired
    private CartaoService cartaoService;

    @GetMapping("/lista/{listaId}")
    public ResponseEntity<List<CartaoResponse>> findAllByLista(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                               @PathVariable Long listaId) {
        List<Cartao> cartoes = cartaoService.findAllByLista(resolvePerfilId(principal), listaId);
        return ResponseEntity.ok(cartoes.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartaoResponse> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(cartaoService.findById(resolvePerfilId(principal), id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        cartaoService.delete(resolvePerfilId(principal), id);
        return ResponseEntity.ok("Cartão removido com sucesso");
    }

    @PatchMapping("/reorder")
    public ResponseEntity<String> reorder(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                          @Valid @RequestBody ReorderRequest request) {
        cartaoService.reorder(resolvePerfilId(principal), request.getCards());
        return ResponseEntity.ok("Cartões reordenados com sucesso");
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/lista/{listaId}")
    public ResponseEntity<List<CartaoResponse>> findAllByListaLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                                     @PathVariable Long perfilId,
                                                                     @PathVariable Long listaId) {
        List<Cartao> cartoes = cartaoService.findAllByLista(resolvePerfilId(principal, perfilId), listaId);
        return ResponseEntity.ok(cartoes.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Deprecated
    @GetMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<CartaoResponse> findByIdLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                         @PathVariable Long perfilId,
                                                         @PathVariable Long id) {
        return ResponseEntity.ok(toResponse(cartaoService.findById(resolvePerfilId(principal, perfilId), id)));
    }

    @Deprecated
    @DeleteMapping("/perfil/{perfilId}/{id}")
    public ResponseEntity<String> deleteLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                               @PathVariable Long perfilId,
                                               @PathVariable Long id) {
        cartaoService.delete(resolvePerfilId(principal, perfilId), id);
        return ResponseEntity.ok("Cartão removido com sucesso");
    }

    @Deprecated
    @PatchMapping("/perfil/{perfilId}/reorder")
    public ResponseEntity<String> reorderLegacy(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                                @PathVariable Long perfilId,
                                                @Valid @RequestBody ReorderRequest request) {
        cartaoService.reorder(resolvePerfilId(principal, perfilId), request.getCards());
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
