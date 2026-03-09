package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.dto.LoginRequest;
import com.projectmanager.planthings.model.dto.LoginResponse;
import com.projectmanager.planthings.model.dto.PerfilRequest;
import com.projectmanager.planthings.model.dto.PerfilResponse;
import com.projectmanager.planthings.model.dto.PerfilUpdateRequest;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@RestController
@RequestMapping("/api/v1/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public ResponseEntity<List<PerfilResponse>> findAll() {
        List<PerfilResponse> response = perfilService.findAll().stream()
                .map(PerfilResponse::new)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PerfilResponse> save(@Valid @RequestBody PerfilRequest request) {
        Perfil perfil = new Perfil();
        perfil.setEmail(request.getEmail());
        perfil.setNome(request.getNome());
        perfil.setSobrenome(request.getSobrenome());
        perfil.setTelefone(request.getTelefone());
        perfil.setSenhaTexto(request.getSenha());

        Perfil novoPerfil = perfilService.save(perfil);
        return ResponseEntity.status(HttpStatus.CREATED).body(new PerfilResponse(novoPerfil));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new PerfilResponse(perfilService.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilResponse> update(@PathVariable Long id, @Valid @RequestBody PerfilUpdateRequest request) {
        Perfil perfil = new Perfil();
        perfil.setEmail(request.getEmail());
        perfil.setNome(request.getNome());
        perfil.setSobrenome(request.getSobrenome());
        perfil.setTelefone(request.getTelefone());
        perfil.setSenhaTexto(request.getSenha());

        Perfil perfilAtualizado = perfilService.update(id, perfil);
        return ResponseEntity.ok(new PerfilResponse(perfilAtualizado));
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
            perfil.getNome(),
            perfil.getSobrenome(),
            perfil.getTelefone(),
            "Login realizado com sucesso"
        );

        return ResponseEntity.ok(response);
    }

}
