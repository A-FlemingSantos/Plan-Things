package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class PerfilService{

    @Autowired // Injeção de dependência automática
    private PerfilRepository perfilRepository;


    // Método para buscar todos os perfis
    public List<Perfil> findAll() {
        return perfilRepository.findAll();
    }


    // Método para salvar um novo perfil
    public Perfil save(Perfil perfil) {
        // Verifica se já existe um perfil com esse email
        if (perfilRepository.findByEmail(perfil.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado no sistema");
        }
        perfil.setCodStatus(true);
        return perfilRepository.save(perfil);
    }


    public Perfil findById(Long id) {
        return perfilRepository.findById(id).orElseThrow(() -> new RuntimeException("Perfil não encontrado" + id));
    }

    // Método para atualizar um perfil existente
    public Perfil update(Long id, Perfil perfil) {
        Perfil perfilExistente = findById(id);
        perfilExistente.setNome(perfil.getNome());
        perfilExistente.setSobrenome(perfil.getSobrenome());
        perfilExistente.setTelefone(perfil.getTelefone());
        perfilExistente.setSenha(perfil.getSenha());
        return perfilRepository.save(perfilExistente);
    }

    // Método para deletar um perfil por ID
    public void delete(Long id) {
        Perfil perfilExistente = findById(id);
        perfilRepository.delete(perfilExistente);
    }

    // Método para autenticar usuário (login)
    public Perfil login(String email, String senha) {
        Perfil perfil = perfilRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));
        
        // Verifica se a senha está correta
        if (!perfil.getSenha().equals(senha)) {
            throw new RuntimeException("Email ou senha inválidos");
        }
        
        // Verifica se o perfil está ativo
        if (!perfil.getCodStatus()) {
            throw new RuntimeException("Perfil inativo");
        }
        
        return perfil;
    }
}