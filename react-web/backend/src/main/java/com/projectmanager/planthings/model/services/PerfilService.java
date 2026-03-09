package com.projectmanager.planthings.model.services;

import com.projectmanager.planthings.exception.BadRequestException;
import com.projectmanager.planthings.exception.ConflictException;
import com.projectmanager.planthings.exception.NotFoundException;
import com.projectmanager.planthings.exception.UnauthorizedException;
import com.projectmanager.planthings.model.entity.Perfil;
import com.projectmanager.planthings.model.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public List<Perfil> findAll() {
        return perfilRepository.findByCodStatusTrue();
    }

    public Perfil save(Perfil perfil) {
        if (perfilRepository.findByEmail(perfil.getEmail()).isPresent()) {
            throw new ConflictException("Email já cadastrado no sistema");
        }

        if (perfil.getSenhaTexto() == null || perfil.getSenhaTexto().isBlank()) {
            throw new BadRequestException("Senha é obrigatória");
        }

        perfil.setSenha(passwordEncoder.encode(perfil.getSenhaTexto()));
        perfil.setCodStatus(true);
        return perfilRepository.save(perfil);
    }

    public Perfil findById(Long id) {
        return perfilRepository.findByIdAndCodStatusTrue(id)
                .orElseThrow(() -> new NotFoundException("Perfil não encontrado " + id));
    }

    public Perfil update(Long id, Perfil perfil) {
        Perfil perfilExistente = findById(id);

        if (!perfilExistente.getEmail().equals(perfil.getEmail())
                && perfilRepository.findByEmail(perfil.getEmail()).isPresent()) {
            throw new ConflictException("Email já cadastrado no sistema");
        }
        perfilExistente.setEmail(perfil.getEmail());

        perfilExistente.setNome(perfil.getNome());
        perfilExistente.setSobrenome(perfil.getSobrenome());
        perfilExistente.setTelefone(perfil.getTelefone());

        if (perfil.getSenhaTexto() != null && !perfil.getSenhaTexto().isBlank()) {
            perfilExistente.setSenha(passwordEncoder.encode(perfil.getSenhaTexto()));
        }

        return perfilRepository.save(perfilExistente);
    }

    public void delete(Long id) {
        Perfil perfilExistente = findById(id);
        perfilExistente.setCodStatus(false);
        perfilRepository.save(perfilExistente);
    }

    public Perfil login(String email, String senha) {
        Perfil perfil = perfilRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Email ou senha inválidos"));

        if (!perfil.getCodStatus()) {
            throw new UnauthorizedException("Perfil inativo");
        }

        if (!passwordEncoder.matches(senha, perfil.getSenha())) {
            throw new UnauthorizedException("Email ou senha inválidos");
        }

        return perfil;
    }
}
