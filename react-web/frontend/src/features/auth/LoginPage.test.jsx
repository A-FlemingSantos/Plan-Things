import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { renderWithAuthRouter } from "@/test/utils";
import apiClient from "@/lib/apiClient";

vi.mock("@/lib/apiClient", () => {
  const mockedClient = {
    post: vi.fn(),
  };

  return {
    default: mockedClient,
    normalizeError: vi.fn((error) => ({
      message: error?.response?.data?.message ?? error?.message ?? "Erro inesperado.",
    })),
  };
});

function renderLoginPage(initialEntries = ["/login"]) {
  return renderWithAuthRouter(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app/planos" element={<div>Tela de planos</div>} />
    </Routes>,
    { initialEntries, session: null }
  );
}

describe("LoginPage", () => {
  it("submete credenciais válidas, persiste a sessão e navega para planos", async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        id: 7,
        email: "ana@empresa.com",
        nome: "Ana",
        sobrenome: "Silva",
        telefone: null,
      },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-mail"), "ana@empresa.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/perfil/login", {
        email: "ana@empresa.com",
        senha: "123456",
      });
    });

    expect(await screen.findByText("Tela de planos")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("planthings_session"))).toMatchObject({
      email: "ana@empresa.com",
      nome: "Ana",
      sobrenome: "Silva",
    });
  });

  it("exibe erro de validação quando o e-mail é inválido", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-mail"), "email-invalido");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Formato de e-mail inválido")).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("mostra o erro da API e permanece na tela de login", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Credenciais inválidas.",
        },
      },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-mail"), "ana@empresa.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Credenciais inválidas.");
    expect(screen.queryByText("Tela de planos")).not.toBeInTheDocument();
  });
});
