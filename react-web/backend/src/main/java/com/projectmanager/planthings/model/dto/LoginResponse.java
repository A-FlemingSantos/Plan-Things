package com.projectmanager.planthings.model.dto;

public class LoginResponse {
    private Long id;
    private String email;
    private String nome;
    private String sobrenome;
    private String telefone;
    private String token;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String email, String nome, String sobrenome, String telefone, String token, String message) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.telefone = telefone;
        this.token = token;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
