package com.projectmanager.planthings.model.dto;

import java.util.ArrayList;
import java.util.List;

public class PlanoBoardResponse {
    private PlanoResponse plano;
    private List<PlanoBoardListaResponse> listas = new ArrayList<>();

    public PlanoBoardResponse() {
    }

    public PlanoBoardResponse(PlanoResponse plano, List<PlanoBoardListaResponse> listas) {
        this.plano = plano;
        setListas(listas);
    }

    public PlanoResponse getPlano() {
        return plano;
    }

    public void setPlano(PlanoResponse plano) {
        this.plano = plano;
    }

    public List<PlanoBoardListaResponse> getListas() {
        return listas;
    }

    public void setListas(List<PlanoBoardListaResponse> listas) {
        this.listas = listas == null ? new ArrayList<>() : new ArrayList<>(listas);
    }
}
