import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PlanosPage } from "./PlanosPage";
import { renderWithAuthRouter } from "@/test/utils";
import apiClient from "@/lib/apiClient";

vi.mock("@/lib/apiClient", () => {
  const mockedClient = {
    get: vi.fn(),
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

function renderPlanosPage() {
  return renderWithAuthRouter(
    <Routes>
      <Route path="/app/planos" element={<PlanosPage />} />
    </Routes>,
    { initialEntries: ["/app/planos"] }
  );
}

describe("PlanosPage", () => {
  it("permite criar um plano e atualiza a grade sem refetch integral", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [] });
    apiClient.post.mockResolvedValueOnce({
      data: { id: 1, nome: "Plano novo", wallpaperUrl: null },
    });

    const user = userEvent.setup();
    renderPlanosPage();

    expect(await screen.findByText("Nenhum plano criado ainda")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /criar novo plano/i }));
    await user.type(screen.getByLabelText("Nome do plano"), "Plano novo");
    await user.click(screen.getByRole("button", { name: "Criar plano" }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/planos/me", {
        nome: "Plano novo",
        wallpaperUrl: "linear-gradient(135deg, #3b82f6, #6366f1)",
      });
    });

    expect(await screen.findByText("Plano criado com sucesso!")).toBeInTheDocument();
    expect(screen.getByText("Plano novo")).toBeInTheDocument();
  });

  it("permite editar um plano já carregado", async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: "Plano antigo", wallpaperUrl: null }],
    });
    apiClient.put.mockResolvedValueOnce({
      data: { id: 1, nome: "Plano atualizado", wallpaperUrl: null },
    });

    const user = userEvent.setup();
    renderPlanosPage();

    expect(await screen.findByText("Plano antigo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Editar plano Plano antigo" }));
    const nomeInput = await screen.findByLabelText("Nome do plano");
    await user.clear(nomeInput);
    await user.type(nomeInput, "Plano atualizado");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith("/planos/me/1", {
        nome: "Plano atualizado",
        wallpaperUrl: null,
      });
    });

    expect(await screen.findByText("Plano atualizado com sucesso!")).toBeInTheDocument();
    expect(screen.getByText("Plano atualizado")).toBeInTheDocument();
  });

  it("permite excluir um plano e volta para o estado vazio", async () => {
    apiClient.get.mockResolvedValueOnce({
      data: [{ id: 3, nome: "Plano removível", wallpaperUrl: null }],
    });
    apiClient.delete.mockResolvedValueOnce({});

    const user = userEvent.setup();
    renderPlanosPage();

    expect(await screen.findByText("Plano removível")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Excluir plano Plano removível" }));
    const dialog = await screen.findByRole("dialog", { name: "Confirmar exclusão" });
    await user.click(within(dialog).getByRole("button", { name: "Excluir" }));

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith("/planos/me/3");
    });

    expect(await screen.findByText("Plano excluído com sucesso!")).toBeInTheDocument();
    expect(screen.getByText("Nenhum plano criado ainda")).toBeInTheDocument();
  });

  it("mostra erro de carregamento e permite retry", async () => {
    apiClient.get
      .mockRejectedValueOnce(new Error("Falha ao carregar planos."))
      .mockResolvedValueOnce({ data: [] });

    const user = userEvent.setup();
    renderPlanosPage();

    expect(await screen.findByText("Erro ao carregar planos")).toBeInTheDocument();
    expect(screen.getByText("Falha ao carregar planos.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Nenhum plano criado ainda")).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
