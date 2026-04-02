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

> Se você acabou de atualizar o código e recebeu erro de dependência faltando, rode:

```bash
rm -rf node_modules package-lock.json
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

## Expo Go não carrega? (guia rápido)

### 1) Backend precisa estar ativo e acessível na rede

No backend:

```bash
cd react-web/backend
./mvnw spring-boot:run
```

### 2) Se usar celular físico, **não** use `localhost`

No `.env` de `react-mobile`, use o IP da sua máquina na rede local:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080/api/v1
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:8080/api/v1
```

### 3) Inicie o Expo em modo tunnel (ajuda em redes bloqueadas)

```bash
npm run start -- --tunnel
```

### 4) CORS no backend

Se ainda falhar, verifique se o backend está aceitando requisições da origem do app mobile.

## Observação sobre URL da API

Se `EXPO_PUBLIC_API_URL` não estiver definida, o app usa `http://localhost:8080/api/v1` como fallback. Em celular físico, configure obrigatoriamente o IP local no `.env`.
