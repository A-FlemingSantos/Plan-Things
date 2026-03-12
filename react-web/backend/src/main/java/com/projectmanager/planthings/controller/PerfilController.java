package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.auth.AuthSession;
import com.projectmanager.planthings.auth.AuthenticatedPerfilId;
import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.dto.LoginResponse;
import com.projectmanager.planthings.model.dto.PerfilRequest;
import com.projectmanager.planthings.model.dto.PerfilResponse;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PostMapping
    public ResponseEntity<PerfilResponse> save(@Valid @RequestBody PerfilRequest request) {
        Perfil novoPerfil = perfilService.save(toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(novoPerfil));
    }

    @GetMapping("/me")
    public ResponseEntity<PerfilResponse> findMe(@AuthenticatedPerfilId Long perfilId) {
        return ResponseEntity.ok(toResponse(perfilService.findById(perfilId)));
    }

    @PutMapping("/me")
    public ResponseEntity<PerfilResponse> update(
            @AuthenticatedPerfilId Long perfilId,
            @Valid @RequestBody PerfilRequest request
    ) {
        Perfil perfilAtualizado = perfilService.update(perfilId, toEntity(request));
        return ResponseEntity.ok(toResponse(perfilAtualizado));
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> delete(
            @AuthenticatedPerfilId Long perfilId,
            HttpServletRequest request
    ) {
        perfilService.delete(perfilId);
        AuthSession.invalidate(request);
        return ResponseEntity.ok("Perfil inativado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request
    ) {
        Perfil perfil = perfilService.login(loginRequest.getEmail(), loginRequest.getSenha());
        AuthSession.authenticate(request, perfil.getId());

        LoginResponse response = new LoginResponse(
            perfil.getId(),
            perfil.getEmail(),
            perfil.getNome(),
            perfil.getSobrenome(),
            perfil.getTelefone(),
            "Login realizado com sucesso"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        AuthSession.invalidate(request);
        return ResponseEntity.noContent().build();
    }

    private Perfil toEntity(PerfilRequest request) {
        Perfil perfil = new Perfil();
        perfil.setEmail(request.getEmail());
        perfil.setNome(request.getNome());
        perfil.setSobrenome(request.getSobrenome());
        perfil.setTelefone(request.getTelefone());
        perfil.setSenhaTexto(request.getSenha());
        return perfil;
    }

    private PerfilResponse toResponse(Perfil perfil) {
        return new PerfilResponse(
                perfil.getId(),
                perfil.getEmail(),
                perfil.getNome(),
                perfil.getSobrenome(),
                perfil.getTelefone()
        );
    }

}
