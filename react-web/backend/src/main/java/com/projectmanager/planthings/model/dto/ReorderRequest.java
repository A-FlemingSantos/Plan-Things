package com.projectmanager.planthings.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ReorderRequest {

    @NotEmpty(message = "A lista de cartões não pode ser vazia")
    @Valid
    private List<CardPosition> cards;

    public ReorderRequest() {
    }

    public ReorderRequest(List<CardPosition> cards) {
        this.cards = cards;
    }

    public List<CardPosition> getCards() {
        return cards;
    }

    public void setCards(List<CardPosition> cards) {
        this.cards = cards;
    }

    public static class CardPosition {
        @NotNull(message = "O ID do cartão é obrigatório")
        private Long cardId;

        @NotNull(message = "O ID da lista é obrigatório")
        private Long listaId;

        @NotNull(message = "A posição é obrigatória")
        private Integer posicao;

        public CardPosition() {
        }

        public CardPosition(Long cardId, Long listaId, Integer posicao) {
            this.cardId = cardId;
            this.listaId = listaId;
            this.posicao = posicao;
        }

        public Long getCardId() {
            return cardId;
        }

        public void setCardId(Long cardId) {
            this.cardId = cardId;
        }

        public Long getListaId() {
            return listaId;
        }

        public void setListaId(Long listaId) {
            this.listaId = listaId;
        }

        public Integer getPosicao() {
            return posicao;
        }

        public void setPosicao(Integer posicao) {
            this.posicao = posicao;
        }
    }
}
