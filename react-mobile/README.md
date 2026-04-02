# Plan Things Mobile

Versão mobile (React Native + Expo) baseada no layout e fluxo do frontend web do projeto.

## Funcionalidades implementadas

- Login e cadastro usando a API existente (`/api/v1/perfil`).
- Área autenticada com abas:
  - **Planos**: lista planos do usuário.
  - **Perfil**: dados do usuário e logout.
- Tela de **Quadro**: mostra listas e cartões do plano selecionado.
- Persistência de sessão com AsyncStorage.

## Configuração

1. Instale dependências:

```bash
cd react-mobile
npm install
```

2. Configure a URL da API:

```bash
cp .env.example .env
```

3. Inicie o app:

```bash
npm run start
```

> Use `EXPO_PUBLIC_API_URL` com o host acessível pelo dispositivo/emulador (ex.: IP local da máquina).
