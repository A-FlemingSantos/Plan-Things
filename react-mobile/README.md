# Plan Things Mobile

Versão mobile (React Native + Expo) baseada no layout e fluxo do frontend web do projeto.

> Este app está configurado para **Expo SDK 54** (compatível com **Expo Go 54**).

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

## Rodando no Codespaces (backend + mobile)

Para o app mobile funcionar, o backend precisa estar acessível publicamente.

1) Suba o backend:

```bash
cd react-web/backend
./mvnw spring-boot:run
```

2) No Codespaces, em **Ports**, deixe a porta **8080** como **Public** e copie a URL gerada.

3) No `react-mobile/.env`, aponte a API para essa URL:

```env
EXPO_PUBLIC_API_URL=https://SEU-CODESPACE-8080.app.github.dev/api/v1
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=https://solid-garbanzo-695vv49vw6pv3r569-8080.app.github.dev/api/v1
```

## Expo Go não carrega? (guia rápido)

> Se você está rodando o Metro **dentro de Codespaces/devcontainer**, o QR geralmente aponta para um IP privado (ex.: `10.x.x.x`) que o seu celular não consegue alcançar. Nesse caso, use **tunnel**.

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
npm run start:tunnel
```

Se o tunnel falhar com erro do ngrok, confira https://status.ngrok.com/ e tente novamente. Como alternativa, rode o Expo fora do container (na sua máquina) em `--lan`.

Se aparecer algo como:

```
CommandError: TypeError: Cannot read properties of undefined (reading 'body')
```

É falha intermitente do serviço de tunnel/ngrok. Tente novamente; se persistir, limpe o cache do ngrok do Expo e rode de novo:

```bash
rm -f ~/.expo/ngrok.yml
npm run start:tunnel -- --clear
```

Se preferir (equivalente):

```bash
npm run start -- --tunnel
```

### 4) CORS no backend

Se ainda falhar, verifique se o backend está aceitando requisições da origem do app mobile.

## Observação sobre URL da API

Se `EXPO_PUBLIC_API_URL` não estiver definida, o app usa `http://localhost:8080/api/v1` como fallback. Em celular físico, configure obrigatoriamente o IP local no `.env`.
