# react-mobile

Versão mobile da aplicação **Plan Things**, construída em **React Native + Expo**, inspirada nas páginas do front-end web (`home`, `login/cadastro`, `planos`, `board`, `lista`, `perfil`).

## Como rodar

```bash
cd react-mobile
npm install
npm run start
```

Depois, abra no Expo Go (Android/iOS) ou rode no simulador com `npm run android` / `npm run ios`.

## Estrutura

- `App.js`: navegação raiz.
- `src/navigation`: stack de autenticação e tabs principais.
- `src/screens`: telas mobile baseadas nas páginas web existentes.
- `src/components/GlassCard.js`: componente visual reutilizável.
- `src/data/mockData.js`: dados mock para demonstrar UI.
