package com.projectmanager.planthings.controller;

import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.services.PerfilService;

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
    public ResponseEntity<List<Perfil>> findAll() {

            return ResponseEntity.ok(perfilService.findAll());
    }

    @PostMapping
    public ResponseEntity<Perfil> save(@RequestBody Perfil perfil) {

        Perfil novoPerfil = perfilService.save(perfil);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPerfil);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(perfilService.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Perfil não encontrado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody Perfil perfil) {
        try {
            Perfil perfilAtualizado = perfilService.update(id, perfil);
            return ResponseEntity.ok(perfilAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar perfil");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        try {
            perfilService.delete(id);
            return ResponseEntity.ok().body("Perfil deletado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar perfil");
        }
    }

}