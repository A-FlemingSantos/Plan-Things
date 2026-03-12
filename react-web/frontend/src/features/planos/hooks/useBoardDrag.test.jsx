import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBoardDrag } from "./useBoardDrag";
import apiClient from "@/lib/apiClient";

vi.mock("@/lib/apiClient", () => {
  const mockedClient = {
    patch: vi.fn(),
  };

  return {
    default: mockedClient,
    normalizeError: vi.fn((error) => ({
      message: error?.response?.data?.message ?? error?.message ?? "Erro inesperado.",
    })),
  };
});

function setRect(element, { left, top, width, height }) {
  element.getBoundingClientRect = () => ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  });
}

function buildBoardDom() {
  const canvas = document.createElement("div");

  const listOne = document.createElement("div");
  listOne.dataset.listaId = "1";
  const listTwo = document.createElement("div");
  listTwo.dataset.listaId = "2";

  const cardsAreaOne = document.createElement("div");
  cardsAreaOne.setAttribute("data-cards-area", "");
  const cardsAreaTwo = document.createElement("div");
  cardsAreaTwo.setAttribute("data-cards-area", "");

  const cardOne = document.createElement("div");
  cardOne.dataset.cardId = "101";
  cardOne.className = "card-item";
  const cardTwo = document.createElement("div");
  cardTwo.dataset.cardId = "102";
  cardTwo.className = "card-item";

  cardsAreaOne.append(cardOne, cardTwo);
  listOne.appendChild(cardsAreaOne);
  listTwo.appendChild(cardsAreaTwo);
  canvas.append(listOne, listTwo);
  document.body.appendChild(canvas);

  setRect(listOne, { left: 0, top: 0, width: 180, height: 400 });
  setRect(listTwo, { left: 240, top: 0, width: 180, height: 400 });
  setRect(cardsAreaOne, { left: 0, top: 0, width: 180, height: 320 });
  setRect(cardsAreaTwo, { left: 240, top: 0, width: 180, height: 320 });
  setRect(cardOne, { left: 0, top: 0, width: 180, height: 50 });
  setRect(cardTwo, { left: 0, top: 60, width: 180, height: 50 });

  return { canvas, cardOne };
}

describe("useBoardDrag", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.requestAnimationFrame = vi.fn(() => 1);
    globalThis.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("faz rollback e refetch das listas afetadas quando o reorder falha", async () => {
    apiClient.patch.mockRejectedValueOnce(new Error("Falha ao reordenar."));

    let cartoesMapState = {
      1: [
        { id: 101, nome: "Card A", tipo: "TAREFA", listaId: 1 },
        { id: 102, nome: "Card B", tipo: "TAREFA", listaId: 1 },
      ],
      2: [],
    };

    const setCartoesMap = vi.fn((next) => {
      cartoesMapState = typeof next === "function" ? next(cartoesMapState) : next;
    });
    const fetchCartoesForList = vi.fn().mockResolvedValue(undefined);
    const showToast = vi.fn();
    const { canvas, cardOne } = buildBoardDom();

    const { result } = renderHook(() =>
      useBoardDrag({
        cartoesMap: cartoesMapState,
        setCartoesMap,
        fetchCartoesForList,
        showToast,
      })
    );

    act(() => {
      result.current.boardCanvasRef.current = canvas;
    });

    act(() => {
      result.current.handleDragPointerDown(
        {
          button: 0,
          target: cardOne,
          preventDefault: vi.fn(),
          clientX: 20,
          clientY: 20,
        },
        { id: 101, nome: "Card A", tipo: "TAREFA", listaId: 1 },
        1
      );
      vi.advanceTimersByTime(121);
    });

    act(() => {
      document.dispatchEvent(
        new MouseEvent("pointermove", {
          bubbles: true,
          clientX: 280,
          clientY: 20,
        })
      );
      document.dispatchEvent(new MouseEvent("pointerup", { bubbles: true }));
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await vi.runAllTimersAsync();
    });

    expect(apiClient.patch).toHaveBeenCalledWith("/cartoes/me/reorder", {
      cards: [
        { cardId: 102, listaId: 1, posicao: 0 },
        { cardId: 101, listaId: 2, posicao: 0 },
      ],
    });
    expect(fetchCartoesForList).toHaveBeenCalledWith(1);
    expect(fetchCartoesForList).toHaveBeenCalledWith(2);
    expect(cartoesMapState).toEqual({
      1: [
        { id: 101, nome: "Card A", tipo: "TAREFA", listaId: 1 },
        { id: 102, nome: "Card B", tipo: "TAREFA", listaId: 1 },
      ],
      2: [],
    });
    expect(showToast).toHaveBeenCalledWith("error", "Falha ao reordenar.");
  });
});
