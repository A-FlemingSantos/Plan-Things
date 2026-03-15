package com.projectmanager.planthings.model.dto;

public class LoginResponse {
    private Long id;
    private String email;
    private String username;
    private String nome;
    private String sobrenome;
    private String telefone;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String email, String username, String nome, String sobrenome, String telefone, String message) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.telefone = telefone;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
