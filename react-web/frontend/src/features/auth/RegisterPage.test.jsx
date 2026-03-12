import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";
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

function renderRegisterPage() {
  return renderWithAuthRouter(
    <Routes>
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>,
    { initialEntries: ["/cadastro"], session: null }
  );
}

describe("RegisterPage", () => {
  it("envia nome e sobrenome separados e redireciona para login com mensagem de sucesso", async () => {
    apiClient.post.mockResolvedValueOnce({ data: { id: 9 } });

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText("Nome completo"), "Maria Clara Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/perfil", {
        nome: "Maria",
        sobrenome: "Clara Souza",
        email: "maria@empresa.com",
        senha: "123456",
      });
    });

    expect(await screen.findByText("Conta criada com sucesso. Faça login para continuar.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bem-vindo de volta" })).toBeInTheDocument();
  });

  it("exibe erro da API sem sair da tela de cadastro", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "E-mail já cadastrado.",
        },
      },
    });

    const user = userEvent.setup();
    renderRegisterPage();

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@empresa.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail já cadastrado.");
    expect(screen.getByRole("heading", { name: "Crie sua conta" })).toBeInTheDocument();
  });
});
