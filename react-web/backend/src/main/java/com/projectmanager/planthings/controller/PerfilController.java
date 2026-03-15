package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.config.security.AuthenticatedPerfil;
import com.projectmanager.planthings.config.security.JwtService;
import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.dto.LoginResponse;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/perfil")
public class PerfilController extends AuthenticatedControllerSupport {

    @Autowired
    private PerfilService perfilService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<Perfil>> findAll() {
        return ResponseEntity.ok(perfilService.findAll());
    }

    @PostMapping
    public ResponseEntity<Perfil> save(@Valid @RequestBody Perfil perfil) {
        Perfil novoPerfil = perfilService.save(perfil);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPerfil);
    }

    @GetMapping("/me")
    public ResponseEntity<Perfil> me(@AuthenticationPrincipal AuthenticatedPerfil principal) {
        return ResponseEntity.ok(perfilService.findById(resolvePerfilId(principal)));
    }

    @PutMapping("/me")
    public ResponseEntity<Perfil> updateMe(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                           @Valid @RequestBody Perfil perfil) {
        Perfil perfilAtualizado = perfilService.update(resolvePerfilId(principal), perfil);
        return ResponseEntity.ok(perfilAtualizado);
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMe(@AuthenticationPrincipal AuthenticatedPerfil principal) {
        perfilService.delete(resolvePerfilId(principal));
        return ResponseEntity.ok("Perfil inativado com sucesso");
    }

    @Deprecated
    @GetMapping("/{id}")
    public ResponseEntity<Perfil> findById(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        return ResponseEntity.ok(perfilService.findById(resolvePerfilId(principal, id)));
    }

    @Deprecated
    @PutMapping("/{id}")
    public ResponseEntity<Perfil> update(@AuthenticationPrincipal AuthenticatedPerfil principal,
                                         @PathVariable Long id,
                                         @Valid @RequestBody Perfil perfil) {
        Perfil perfilAtualizado = perfilService.update(resolvePerfilId(principal, id), perfil);
        return ResponseEntity.ok(perfilAtualizado);
    }

    @Deprecated
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@AuthenticationPrincipal AuthenticatedPerfil principal, @PathVariable Long id) {
        perfilService.delete(resolvePerfilId(principal, id));
        return ResponseEntity.ok("Perfil inativado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Perfil perfil = perfilService.login(loginRequest.getEmail(), loginRequest.getSenha());
        String token = jwtService.generateToken(perfil);

        LoginResponse response = new LoginResponse(
                perfil.getId(),
                perfil.getEmail(),
                perfil.getNome(),
                perfil.getSobrenome(),
                perfil.getTelefone(),
                token,
                "Login realizado com sucesso"
        );

        return ResponseEntity.ok(response);
    }

}
