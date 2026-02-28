package com.projectmanager.planthings.model.dto;

public class PlanoResponse {
    private Long id;
    private String nome;
    private String wallpaperUrl;
    private Long perfilId;

    public PlanoResponse() {
    }

    public PlanoResponse(Long id, String nome, String wallpaperUrl, Long perfilId) {
        this.id = id;
        this.nome = nome;
        this.wallpaperUrl = wallpaperUrl;
        this.perfilId = perfilId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getWallpaperUrl() {
        return wallpaperUrl;
    }

    public void setWallpaperUrl(String wallpaperUrl) {
        this.wallpaperUrl = wallpaperUrl;
    }

    public Long getPerfilId() {
        return perfilId;
    }

    public void setPerfilId(Long perfilId) {
        this.perfilId = perfilId;
    }
}
