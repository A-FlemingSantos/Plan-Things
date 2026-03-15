package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.dto.LoginResponse;
import com.projectmanager.planthings.model.dto.PerfilCreateRequest;
import com.projectmanager.planthings.model.dto.PerfilUpdateRequest;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public ResponseEntity<List<Perfil>> findAll() {
        return ResponseEntity.ok(perfilService.findAll());
    }

    @PostMapping
    public ResponseEntity<Perfil> save(@Valid @RequestBody PerfilCreateRequest request) {
        Perfil novoPerfil = perfilService.save(toEntity(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPerfil);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> findById(@PathVariable Long id) {
        return ResponseEntity.ok(perfilService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Perfil> update(@PathVariable Long id, @Valid @RequestBody PerfilUpdateRequest request) {
        Perfil perfilAtualizado = perfilService.update(id, toEntity(request));
        return ResponseEntity.ok(perfilAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        perfilService.delete(id);
        return ResponseEntity.ok("Perfil inativado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Perfil perfil = perfilService.login(loginRequest.getEmail(), loginRequest.getSenha());

        LoginResponse response = new LoginResponse(
            perfil.getId(),
            perfil.getEmail(),
            perfil.getUsername(),
            perfil.getNome(),
            perfil.getSobrenome(),
            perfil.getTelefone(),
            "Login realizado com sucesso"
        );

        return ResponseEntity.ok(response);
    }

    private Perfil toEntity(PerfilCreateRequest request) {
        Perfil perfil = new Perfil();
        perfil.setEmail(request.getEmail());
        perfil.setUsername(request.getUsername());
        perfil.setNome(request.getNome());
        perfil.setSobrenome(request.getSobrenome());
        perfil.setTelefone(request.getTelefone());
        perfil.setSenhaTexto(request.getSenha());
        return perfil;
    }

    private Perfil toEntity(PerfilUpdateRequest request) {
        Perfil perfil = new Perfil();
        perfil.setUsername(request.getUsername());
        perfil.setNome(request.getNome());
        perfil.setSobrenome(request.getSobrenome());
        perfil.setTelefone(request.getTelefone());
        perfil.setSenhaTexto(request.getSenha());
        return perfil;
    }
}
