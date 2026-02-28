package com.projectmanager.planthings.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Perfil")
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", columnDefinition = "VARCHAR(320)", nullable = false, unique = true)
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Size(max = 320, message = "Email deve ter no máximo 320 caracteres")
    private String email;

    @Column(name = "nome", columnDefinition = "NVARCHAR(50)", nullable = false)
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 50, message = "Nome deve ter no máximo 50 caracteres")
    private String nome;

    @Column(name = "sobrenome", columnDefinition = "NVARCHAR(50)")
    @Size(max = 50, message = "Sobrenome deve ter no máximo 50 caracteres")
    private String sobrenome;

    @Column(name = "telefone", columnDefinition = "VARCHAR(20)")
    @Pattern(regexp = "^[0-9+() -]{1,20}$", message = "Telefone inválido")
    private String telefone;

    @JsonIgnore
    @Column(name = "senha", columnDefinition = "VARBINARY(32)", nullable = false)
    private byte[] senha;

    @Column(name = "cod_status", nullable = false)
    private Boolean codStatus;

    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY, value = "senha")
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
    private String senhaTexto;

    @JsonIgnore
    @OneToMany(mappedBy = "perfil", fetch = FetchType.LAZY)
    private List<Plano> planos = new ArrayList<>();

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

    public byte[] getSenha() {
        return senha;
    }

    public void setSenha(byte[] senha) {
        this.senha = senha;
    }

    public Boolean getCodStatus() {
        return codStatus;
    }

    public void setCodStatus(Boolean codStatus) {
        this.codStatus = codStatus;
    }

    public String getSenhaTexto() {
        return senhaTexto;
    }

    public void setSenhaTexto(String senhaTexto) {
        this.senhaTexto = senhaTexto;
    }

    public List<Plano> getPlanos() {
        return planos;
    }

    public void setPlanos(List<Plano> planos) {
        this.planos = planos;
    }
}
