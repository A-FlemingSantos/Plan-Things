# Etapa 5 — Perfil, acessibilidade e polimento final

## Objetivo da etapa

Concluir a experiência de conta do usuário e garantir qualidade final da aplicação (UX, acessibilidade e consistência).

## Dependências

- Etapas 1 a 4 concluídas.
- Padrões de feedback/erros já consolidados.

## Escopo funcional de perfil

- consultar perfil;
- atualizar dados cadastrais;
- inativar/remover perfil.

Endpoints:

- `GET /api/v1/perfil/{id}`
- `PUT /api/v1/perfil/{id}`
- `DELETE /api/v1/perfil/{id}`

## Estrutura visual detalhada da página de perfil (obrigatória)

Mesmo sendo uma página de conta, deve manter o mesmo ecossistema visual definido nas etapas anteriores.

### Estrutura geral

```text
┌──────────────────────────────────────────────┐
│ Cabeçalho Global                             │
├──────────────────────────────────────────────┤
│ Barra secundária / contexto                  │
├──────────────────────────────────────────────┤
│ Perfil                                       │
│ ┌──────────────────────────────────────────┐ │
│ │ Dados cadastrais                         │ │
│ │ Nome | Sobrenome | Telefone | E-mail     │ │
│ │ [Salvar alterações]                      │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Zona de risco                            │ │
│ │ [Inativar/Remover perfil]                │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Requisitos visuais

- Cabeçalho global com mesma composição das páginas anteriores.
- Separação visual explícita entre ações comuns e ações destrutivas.
- Mensagens de confirmação de alto destaque para exclusão/inativação.

## Escopo visual/UX obrigatório

- formulário de perfil legível e acessível;
- separação visual de ações comuns x destrutivas;
- confirmação forte para ação destrutiva;
- manutenção da identidade visual definida nas etapas anteriores.

## Checklist de qualidade transversal

1. **Estados de interface**
   - loading, empty, error, success padronizados em todas as páginas.

2. **Tratamento de erros HTTP**
   - cobertura para 400, 401, 404, 409 e 500 com linguagem consistente.

3. **Acessibilidade**
   - foco visível;
   - semântica correta;
   - labels e mensagens associadas a campos;
   - navegação por teclado.

4. **Consistência visual**
   - aderência ao padrão atual do front-end;
   - uso de componentes/tokens reutilizáveis.

5. **Princípios UX finais**
   - baixa fricção;
   - interface espacial;
   - interação direta;
   - feedback constante;
   - clareza de hierarquia (Plano > Lista > Cartão > Detalhes).

## Critérios de pronto da etapa

- Fluxo de perfil completo funcionando.
- Aplicação com experiência consistente entre páginas.
- Checklist de acessibilidade e feedback atendido antes de fechar ciclo.
