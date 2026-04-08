# AGENTS.md

## Projeto

CGintegra é uma plataforma para gerenciar o ciclo documental:

`Pitch -> PRD -> RFC -> Implementação`

O objetivo do produto é reduzir retrabalho, melhorar rastreabilidade entre negócio e engenharia e impedir avanço de fase sem aprovação formal do estágio anterior.

## Estado Atual

- `docs/PITCH.md` existe e está em iteração.
- `docs/PRD.md` existe na versão `0.1`.
- `docs/RFC.md` existe na versão `0.2` como draft técnico inicial.
- Implementação ainda não começou.

## Stack Tecnológica Aprovada

- Frontend: `Next.js 14+` (App Router), `React`, `Tailwind CSS`, `Serwist`
- Backend: `Next.js Route Handlers`, `Zod`, `Lucia Auth`, `Argon2id`
- Banco de dados: `SQLite` com `better-sqlite3`
- ORM e migrations: `Drizzle ORM` e `Drizzle Kit`
- Infraestrutura: `Docker`, `Fly.io`, `Litestream`, `Caddy`
- Tooling: `TypeScript`, `nanoid`, `Vitest`, `Playwright`

Capacidades técnicas adicionais previstas na stack:

- mensageria via `Evolution API` com fallback para `WhatsApp Cloud API`;
- geocodificação via `Nominatim / OpenStreetMap` com cache local agressivo.

## Fontes de Verdade

- [PITCH.md](/d:/CGINTEGRA/docs/PITCH.md)
- [PRD.md](/d:/CGINTEGRA/docs/PRD.md)
- [RFC.md](/d:/CGINTEGRA/docs/RFC.md)

Se houver conflito entre documentos:

1. O arquivo mais específico vence o mais geral.
2. O documento mais novo só deve sobrescrever o anterior se isso estiver explícito.
3. Não invente requisitos ausentes; registre lacunas como open issues.

## Fluxo de Trabalho Esperado

1. Pitch define por que fazer.
2. PRD define o que fazer.
3. RFC define como fazer.
4. Código implementa o que foi aprovado.

Não pular etapas sem justificativa explícita.

## Regras Importantes do Produto

- Um documento só avança para a próxima fase se estiver aprovado.
- Aprovação pode depender de quorum configurável.
- Comentários e aprovações pertencem a versões específicas do documento.
- RFC deve referenciar explicitamente a versão do PRD de origem.
- O sistema deve preservar rastreabilidade entre Pitch, PRD e RFC.

## Escopo Atual do MVP

Priorizar:

- templates de Pitch, PRD e RFC;
- editor Markdown enriquecido;
- versionamento;
- revisão e aprovação com comentários inline;
- vínculo entre documentos;
- dashboard por projeto;
- busca;
- exportação;
- autenticação básica com papéis;
- notificações por e-mail;
- audit log.

Evitar assumir como parte do MVP:

- SSO corporativo;
- integrações com GitHub/GitLab;
- Slack ou Teams;
- editor colaborativo em tempo real;
- analytics avançado;
- automações complexas de transformação entre documentos.

## Diretrizes para Agentes

- O padrão de comunicação do projeto deve ser sempre em português.
- Antes de propor implementação, consulte `docs/PITCH.md` e `docs/PRD.md`.
- Consulte `docs/RFC.md` quando a discussão envolver decisões técnicas, arquitetura, APIs ou implementação.
- Se surgir ambiguidade de produto, preserve a intenção do Pitch e a especificidade do PRD.
- A stack aprovada acima deve ser tratada como padrão técnico do projeto.
- Se um detalhe técnico ainda não existe, ele deve ser registrado no RFC como decisão em aberto, não inventado como decisão fechada.
- Ao editar documentação, prefira clareza, consistência e rastreabilidade.
- Ao iniciar código futuramente, mantenha vínculo explícito com os requisitos do PRD e, quando existir, com o RFC.

## Open Issues Conhecidas

- quorum padrão por tipo de documento;
- política de retenção de versões e anexos;
- profundidade da integração com repositórios de código;
- fluxo de aprovação para documentos cross-team.

## Saída Esperada de Mudanças Futuras

Ao produzir novos artefatos neste repositório:

- indique de qual documento anterior eles derivam;
- preserve a cadeia `Pitch -> PRD -> RFC -> Código`;
- registre decisões novas de forma explícita;
- não trate hipóteses como decisões aprovadas.
