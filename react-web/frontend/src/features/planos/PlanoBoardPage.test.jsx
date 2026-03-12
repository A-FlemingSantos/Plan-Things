import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PlanoBoardPage } from "./PlanoBoardPage";
import { renderWithAuthRouter } from "@/test/utils";
import apiClient from "@/lib/apiClient";

vi.mock("@/lib/apiClient", () => {
  const mockedClient = {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: mockedClient,
    normalizeError: vi.fn((error) => ({
      message: error?.response?.data?.message ?? error?.message ?? "Erro inesperado.",
    })),
  };
});

function renderBoardPage() {
  return renderWithAuthRouter(
    <Routes>
      <Route path="/app/planos/:planoId" element={<PlanoBoardPage />} />
      <Route path="/app/planos" element={<div>Lista de planos</div>} />
    </Routes>,
    { initialEntries: ["/app/planos/10"] }
  );
}

describe("PlanoBoardPage", () => {
  it("mostra erro ao carregar o quadro e recupera no retry", async () => {
    apiClient.get
      .mockRejectedValueOnce(new Error("Quadro indisponível."))
      .mockResolvedValueOnce({
        data: {
          plano: { id: 10, nome: "Roadmap" },
          listas: [
            {
              id: 22,
              nome: "Backlog",
              cor: null,
              planoId: 10,
              cartoes: [
                { id: 101, nome: "Item inicial", tipo: "TAREFA", listaId: 22 },
              ],
            },
          ],
        },
      });

    const user = userEvent.setup();
    renderBoardPage();

    expect(await screen.findByText("Erro ao carregar o quadro")).toBeInTheDocument();
    expect(screen.getByText("Quadro indisponível.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByRole("region", { name: "Lista: Backlog" })).toBeInTheDocument();
    expect(screen.getByText("Item inicial")).toBeInTheDocument();
  });
});
