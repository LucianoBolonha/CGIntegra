# CGintegra: RFC

Versão: 0.2  
Data: 2026-03-27  
Status: Draft  
Documento derivado de: `docs/PRD.md` v0.1  
Referências: `docs/PITCH.md`, `docs/PRD.md`, `AGENTS.md`

## Resumo Executivo

Este RFC define a implementação técnica do MVP do CGintegra com base na stack aprovada para o projeto. A solução adota uma arquitetura fullstack unificada em `Next.js 14+`, persistência local em `SQLite`, autenticação session-based com `Lucia Auth`, e operação em container único com deploy em `Fly.io`.

O objetivo é entregar o fluxo `Pitch -> PRD -> RFC -> Implementação` com:

- versionamento de documentos;
- revisão e aprovação por quorum;
- comentários inline;
- rastreabilidade entre artefatos;
- exportação;
- auditoria;
- operação simples e baixo custo inicial.

## Objetivos Técnicos

- reduzir complexidade operacional no MVP;
- manter uma base única em `TypeScript`;
- priorizar entrega rápida com arquitetura coesa;
- preservar auditabilidade e rastreabilidade desde a primeira versão;
- suportar crescimento incremental sem adoção precoce de múltiplos serviços.

## Escopo Técnico do RFC

### Coberto

- frontend web e backend HTTP no mesmo projeto;
- autenticação local por sessão;
- banco de dados embarcado;
- versionamento e workflow documental;
- upload de anexos;
- busca textual;
- exportação de documentos;
- deploy containerizado;
- backup contínuo do banco;
- testes unitários, integração e e2e.

### Fora deste RFC

- SSO corporativo;
- colaboração em tempo real;
- integrações com GitHub, GitLab, Slack, Teams, Jira ou Asana;
- arquitetura multi-serviço;
- analytics avançado;
- branching avançado estilo Git.

### Observação sobre capacidades adicionais da stack

A stack inclui suporte técnico para:

- mensageria via `Evolution API` com fallback para `WhatsApp Cloud API`;
- geocodificação via `Nominatim / OpenStreetMap` com cache local.

Essas capacidades não fazem parte do escopo funcional atual do PRD e permanecem desativadas até que sejam formalmente incorporadas ao produto.

## ADRs

### ADR-001: O MVP será um monólito fullstack em Next.js

**Contexto**  
O produto precisa de interface web, APIs, autenticação, renderização de Markdown, exportação, upload, auditoria e busca. Para o MVP, separar frontend e backend em serviços distintos adicionaria latência organizacional e operacional sem ganho claro.

**Decisão**  
Implementar o CGintegra como uma aplicação fullstack única usando `Next.js 14+` com App Router.

**Consequências**  
- Menor custo de desenvolvimento.
- Deploy mais simples.
- Menor sobrecarga operacional.
- Limites de escalabilidade mais acoplados ao processo único da aplicação.

**Mitigação**  
Manter modularização forte por domínio dentro da base de código.

### ADR-002: Frontend usará React, Tailwind CSS e Serwist

**Contexto**  
O produto exige interface responsiva, boa velocidade de iteração e potencial de uso como aplicação instalável.

**Decisão**  
Usar:

- `React` como base de UI;
- `Tailwind CSS` para estilização utilitária;
- `Serwist` para capacidades PWA, manifest e service worker.

**Consequências**  
- Desenvolvimento de UI mais rápido.
- Facilidade para comportamento offline parcial e caching controlado.
- Necessidade de definir cuidadosamente estratégias de cache para evitar conteúdo documental obsoleto.

**Mitigação**  
Aplicar cache agressivo apenas em assets estáticos e estratégias conservadoras em conteúdo autenticado.

### ADR-003: Backend usará Route Handlers, Zod, Lucia Auth e Argon2id

**Contexto**  
O sistema precisa de APIs REST simples, validação de entrada consistente e autenticação com sessão e cookie HTTP-only.

**Decisão**  
Usar:

- `Next.js Route Handlers` para APIs;
- `Zod` para validação de payload;
- `Lucia Auth` para autenticação session-based;
- `Argon2id` para hashing de senha.

**Consequências**  
- Stack coesa e enxuta.
- Menos moving parts no backend.
- Maior responsabilidade do time em padronizar rotas e políticas de autorização.

**Mitigação**  
Centralizar contratos, validações e autorização em módulos reutilizáveis.

### ADR-004: Persistência principal será SQLite com better-sqlite3

**Contexto**  
O MVP prioriza simplicidade operacional, custo baixo, consistência local e volume inicial controlado.

**Decisão**  
Usar `SQLite` com driver `better-sqlite3` como banco principal do sistema.

**Consequências**  
- Zero dependência de banco externo no MVP.
- Deploy mais simples.
- Excelente aderência a aplicação single-node.
- Escalabilidade de escrita horizontal não é foco desta fase.

**Mitigação**  
Assumir operação single-region/single-writer no MVP e revisar a decisão caso o produto cresça além da capacidade do modelo.

### ADR-005: ORM e migrations serão feitos com Drizzle

**Contexto**  
A equipe quer type safety, baixo overhead e migrations explícitas.

**Decisão**  
Usar `Drizzle ORM` com `Drizzle Kit`.

**Consequências**  
- Schema mais próximo do SQL real.
- Menor overhead em runtime.
- Melhor previsibilidade na evolução do banco.

**Mitigação**  
Padronizar convenções de schema, naming e migrations desde o início.

### ADR-006: O deploy padrão será container único em Fly.io

**Contexto**  
A proposta de infraestrutura privilegia simplicidade, volume persistente e facilidade de operação.

**Decisão**  
Usar:

- `Docker` para empacotamento;
- `Fly.io` como ambiente padrão de deploy;
- `Caddy` como reverse proxy com HTTPS automático;
- `Litestream` para backup contínuo do SQLite via WAL streaming para S3/R2.

**Consequências**  
- Operação simples no MVP.
- Baixo custo e boa portabilidade.
- Dependência de volume persistente para estado local.

**Mitigação**  
Documentar claramente restore, failover operacional e limites do modelo single-node.

## Stack Oficial

### Frontend

- `Next.js 14+` (App Router)
- `React`
- `Serwist`
- `Tailwind CSS`

### Backend

- `Next.js Route Handlers`
- `Zod`
- `Lucia Auth`
- `Argon2id`

### Banco de Dados

- `SQLite`
- `better-sqlite3`
- `Drizzle ORM`
- `Drizzle Kit`

### Infraestrutura

- `Docker`
- `Fly.io`
- `Litestream`
- `Caddy`

### Tooling

- `TypeScript`
- `nanoid`
- `Vitest`
- `Playwright`

## Arquitetura Proposta

## Visão Geral

O sistema será composto por:

- aplicação `Next.js` fullstack;
- banco `SQLite` local ao container;
- volume persistente para banco e arquivos do app;
- `Litestream` replicando WAL do SQLite para storage externo compatível com S3/R2;
- `Caddy` terminando HTTPS;
- integrações externas sob demanda, começando por SMTP para e-mail.

## Fluxo de alto nível

1. Usuário acessa a aplicação web.
2. Faz login por sessão autenticada com cookie HTTP-only.
3. Cria projeto e documento via template.
4. Cada salvamento cria snapshot versionado.
5. Revisores são atribuídos a uma versão específica.
6. Comentários e aprovações ficam vinculados àquela versão.
7. Ao atingir quorum, o documento muda de estado.
8. O próximo artefato só pode ser criado a partir de um documento aprovado.
9. Toda mutação relevante gera trilha de auditoria.

## Módulos do Sistema

- `auth`: autenticação, sessão e autorização.
- `projects`: projetos, metadados e tags.
- `documents`: entidade principal do ciclo documental.
- `templates`: templates de Pitch, PRD e RFC.
- `versions`: snapshots, labels, diff e reversão.
- `reviews`: revisão, quorum e aprovações.
- `comments`: comentários inline e resolução.
- `links`: rastreabilidade entre documentos derivados.
- `attachments`: upload e download de anexos.
- `search`: indexação e consulta textual.
- `exports`: PDF e pacote Markdown.
- `notifications`: notificações por e-mail e futuras integrações.
- `audit`: trilha de auditoria.
- `pwa`: manifest, service worker e estratégias de cache.

## Schema do Banco

## Entidades principais

### `users`

- `id`
- `name`
- `email`
- `password_hash`
- `status`
- `created_at`
- `updated_at`

### `sessions`

- `id`
- `user_id`
- `expires_at`

### `roles`

- `id`
- `code` (`ADMIN`, `PRODUCT_OWNER`, `REVIEWER`, `DEVELOPER`, `VIEWER`)
- `name`

### `user_roles`

- `user_id`
- `role_id`

### `projects`

- `id`
- `name`
- `description`
- `owner_user_id`
- `status`
- `created_at`
- `updated_at`

### `project_tags`

- `id`
- `project_id`
- `tag`

### `documents`

- `id`
- `project_id`
- `type` (`PITCH`, `PRD`, `RFC`)
- `title`
- `current_version_id`
- `status` (`DRAFT`, `IN_REVIEW`, `APPROVED`, `REJECTED`, `ARCHIVED`)
- `visibility` (`PRIVATE`, `PROJECT`, `PUBLIC`)
- `created_by`
- `created_at`
- `updated_at`

### `document_versions`

- `id`
- `document_id`
- `version_label`
- `content_markdown`
- `rendered_html_cache`
- `change_summary`
- `is_stable`
- `created_by`
- `created_at`

### `document_links`

- `id`
- `source_document_id`
- `source_version_id`
- `target_document_id`
- `relation_type` (`DERIVES_TO`, `REFERENCES`)
- `created_at`

### `review_requests`

- `id`
- `document_id`
- `document_version_id`
- `requested_by`
- `quorum_type` (`MAJORITY`, `UNANIMOUS`, `FIXED_COUNT`)
- `quorum_value`
- `status` (`OPEN`, `APPROVED`, `CHANGES_REQUESTED`, `CLOSED`)
- `deadline_at`
- `created_at`

### `review_assignments`

- `id`
- `review_request_id`
- `reviewer_user_id`
- `status` (`PENDING`, `APPROVED`, `REJECTED`, `CHANGES_REQUESTED`)
- `acted_at`

### `comments`

- `id`
- `document_version_id`
- `author_user_id`
- `anchor_ref`
- `body`
- `status` (`OPEN`, `RESOLVED`)
- `created_at`
- `resolved_at`

### `attachments`

- `id`
- `document_version_id`
- `storage_path`
- `file_name`
- `mime_type`
- `size_bytes`
- `is_sensitive`
- `uploaded_by`
- `created_at`

### `audit_logs`

- `id`
- `actor_user_id`
- `entity_type`
- `entity_id`
- `action`
- `metadata_json`
- `created_at`

### `notification_events`

- `id`
- `user_id`
- `type`
- `channel`
- `payload_json`
- `status`
- `sent_at`

### `search_index`

- `document_id`
- `document_version_id`
- `title`
- `body_plaintext`
- `tags_text`
- `author_text`
- `status`

## Relações críticas

- um projeto possui muitos documentos;
- um documento possui muitas versões;
- uma revisão sempre aponta para uma versão específica;
- comentários pertencem a versões, não ao documento abstrato;
- vínculos entre artefatos preservam documento e versão de origem;
- aprovação não é herdada por uma nova versão.

## Estratégia de Persistência

### Banco

- `SQLite` como banco principal;
- acesso via `better-sqlite3`;
- schema e queries modelados com `Drizzle ORM`;
- migrations geradas e executadas via `Drizzle Kit`.

### Arquivos e anexos

- anexos armazenados em filesystem local dentro de volume persistente;
- metadados dos anexos armazenados no banco;
- validação por tipo, tamanho e autorização;
- backup de anexos permanece como preocupação operacional separada do banco e deve ser formalizado antes de produção.

### Busca

- implementação inicial com `SQLite FTS5`;
- sincronização do índice textual a partir das versões publicadas/salvas;
- fallback para consultas simples por metadados quando necessário.

## Estrutura do Projeto

```text
/
|-- AGENTS.md
|-- docs/
|   |-- PITCH.md
|   |-- PRD.md
|   `-- RFC.md
|-- drizzle/
|   |-- schema/
|   |-- migrations/
|   `-- meta/
|-- src/
|   |-- app/
|   |   |-- (auth)/
|   |   |-- dashboard/
|   |   |-- projects/
|   |   |-- documents/
|   |   |-- api/
|   |   `-- manifest.ts
|   |-- modules/
|   |   |-- auth/
|   |   |-- projects/
|   |   |-- documents/
|   |   |-- templates/
|   |   |-- versions/
|   |   |-- reviews/
|   |   |-- comments/
|   |   |-- attachments/
|   |   |-- search/
|   |   |-- exports/
|   |   |-- notifications/
|   |   |-- audit/
|   |   `-- pwa/
|   |-- lib/
|   |   |-- db/
|   |   |-- auth/
|   |   |-- validation/
|   |   |-- ids/
|   |   |-- files/
|   |   |-- mail/
|   |   `-- pdf/
|   |-- components/
|   |-- styles/
|   `-- types/
|-- public/
|-- tests/
|   |-- unit/
|   |-- integration/
|   `-- e2e/
|-- Dockerfile
|-- fly.toml
|-- Caddyfile
`-- package.json
```

## Convenções estruturais

- `src/app` concentra rotas, páginas e route handlers;
- `src/modules` concentra regras de negócio;
- `src/lib` concentra infraestrutura e integrações;
- `nanoid` será o padrão para IDs públicos;
- autorização deve ser executada no backend, não só na UI.

## Contratos de API

## Convenções gerais

- APIs em JSON;
- autenticação por sessão;
- validação com `Zod` em todas as entradas externas;
- todas as mutações relevantes geram `audit_log`;
- envelope padrão de erro:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Endpoints principais

### Autenticação

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

### Projetos

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`

### Documentos

- `GET /api/projects/:projectId/documents`
- `POST /api/projects/:projectId/documents`
- `GET /api/documents/:documentId`
- `PATCH /api/documents/:documentId`
- `POST /api/documents/:documentId/archive`

### Versões

- `GET /api/documents/:documentId/versions`
- `POST /api/documents/:documentId/versions`
- `GET /api/versions/:versionId`
- `POST /api/versions/:versionId/revert`
- `GET /api/versions/:versionId/diff/:baseVersionId`

### Revisão e Aprovação

- `POST /api/documents/:documentId/review-requests`
- `GET /api/review-requests/:reviewRequestId`
- `POST /api/review-requests/:reviewRequestId/assignments`
- `POST /api/review-requests/:reviewRequestId/approve`
- `POST /api/review-requests/:reviewRequestId/request-changes`

### Comentários

- `GET /api/versions/:versionId/comments`
- `POST /api/versions/:versionId/comments`
- `PATCH /api/comments/:commentId`
- `POST /api/comments/:commentId/resolve`

### Anexos

- `POST /api/versions/:versionId/attachments`
- `GET /api/attachments/:attachmentId/download`

### Busca

- `GET /api/search?q=...`

### Exportação

- `POST /api/documents/:documentId/export/pdf`
- `POST /api/documents/:documentId/export/markdown`

### Auditoria

- `GET /api/audit-logs`

## Algoritmos-chave

## 1. Cálculo de quorum

Regras:

- `MAJORITY`: aprova quando `approved > total / 2`;
- `UNANIMOUS`: aprova quando todos os revisores atribuídos aprovam;
- `FIXED_COUNT`: aprova quando `approved >= quorum_value`.

Restrições:

- nova versão invalida avanço baseado na revisão anterior;
- votos antigos não são reaproveitados;
- o documento só muda para `APPROVED` quando a condição do quorum for satisfeita na versão correta.

## 2. Encadeamento entre artefatos

Ao criar PRD a partir de Pitch ou RFC a partir de PRD:

- validar se o documento de origem está `APPROVED`;
- validar se a versão usada foi explicitamente selecionada;
- criar vínculo em `document_links`;
- registrar auditoria.

## 3. Busca textual

Índice por:

- título;
- conteúdo normalizado;
- tags;
- autor;
- tipo;
- status.

Ordenação inicial:

- relevância textual;
- peso maior para match em título;
- atualização mais recente como desempate.

## Infraestrutura e Deploy

## Ambientes

- `local`
- `staging`
- `production`

## Componentes

- app `Next.js`;
- `SQLite` em volume persistente;
- `Litestream` para backup do banco;
- `Caddy` para HTTPS;
- SMTP para notificações;
- `Fly.io` como alvo principal de deploy.

## Estratégia de deploy

- build em `Docker`;
- container único por ambiente;
- volume persistente anexado à aplicação;
- migrações executadas no ciclo de deploy;
- restore do banco documentado e testado;
- configuração passível de portar para Railway, Render ou VPS.

## Variáveis de ambiente mínimas

```env
NODE_ENV=
DATABASE_URL=
AUTH_SECRET=
APP_BASE_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
LITESTREAM_BUCKET=
LITESTREAM_ACCESS_KEY_ID=
LITESTREAM_SECRET_ACCESS_KEY=
WHATSAPP_PROVIDER=
EVOLUTION_API_URL=
EVOLUTION_API_TOKEN=
WHATSAPP_CLOUD_ACCESS_TOKEN=
NOMINATIM_BASE_URL=
```

## Segurança

- hashing de senhas com `Argon2id`;
- cookies HTTP-only e sessão segura;
- proteção contra CSRF em mutações;
- autorização no backend por papel e recurso;
- sanitização da renderização de Markdown;
- validação de uploads por tipo e tamanho;
- downloads protegidos para anexos sensíveis;
- logs de auditoria para eventos críticos;
- rate limiting em login, comentários, exportações e upload;
- isolamento de secrets por ambiente.

## Estratégia de Testes

### Unitários

- cálculo de quorum;
- políticas de autorização;
- transições de status;
- criação de vínculos;
- geração de audit log;
- validações `Zod`;
- utilitários de renderização e sanitização.

### Integração

- CRUD de projetos e documentos;
- criação e reversão de versões;
- fluxo completo de revisão/aprovação;
- upload e download de anexos;
- busca;
- exportação;
- autenticação com sessão.

### E2E

- login;
- criação de projeto;
- criação de Pitch;
- revisão e aprovação;
- criação de PRD derivado;
- criação de RFC derivado;
- consulta de auditoria;
- exportação.

### Ferramentas

- `Vitest` para testes unitários e integração;
- `Playwright` para testes e2e.

## Observabilidade

- logs estruturados em JSON;
- correlação por `request_id`;
- métricas mínimas:
- tempo de resposta;
- taxa de erro;
- tempo de busca;
- tempo de exportação;
- tempo médio de aprovação;
- status de replicação do `Litestream`;
- alertas para falhas de login, e-mail, backup e erros 5xx.

## Plano de Entrega Técnica

### Fase 0: Fundação

- setup da aplicação `Next.js`;
- autenticação com `Lucia Auth`;
- schema inicial em `Drizzle`;
- CRUD de projetos;
- templates e criação de documentos;
- base do deploy em `Docker` + `Fly.io`.

### Fase 1: Núcleo documental

- versionamento;
- comentários inline;
- workflow de revisão;
- cálculo de quorum;
- vínculo entre documentos;
- auditoria básica.

### Fase 2: Operação do MVP

- busca textual em `SQLite FTS5`;
- exportação PDF/Markdown;
- notificações por e-mail;
- PWA com `Serwist`;
- dashboard básico.

### Fase 3: Hardening

- segurança aplicada;
- testes de integração e e2e;
- observabilidade;
- backup e restore documentados;
- ajustes de performance.

## Decisões em Aberto

- quorum padrão por tipo de documento;
- política formal de retenção de anexos;
- estratégia de backup de anexos além do banco;
- fidelidade visual desejada para PDF;
- estratégia exata de diff entre versões Markdown;
- se mensageria via WhatsApp entrará no produto ou permanecerá apenas como capacidade técnica;
- se geocodificação fará parte de algum fluxo futuro do produto.

## Riscos Técnicos

- comentários inline exigem âncoras estáveis entre versões;
- operação single-node exige disciplina de backup e restore;
- anexos em filesystem local precisam de estratégia operacional clara;
- PWA pode induzir cache incorreto se não houver política conservadora;
- crescimento futuro pode pressionar limites do `SQLite` dependendo do perfil de escrita.

## Conclusão

Esta versão do RFC alinha o projeto à stack aprovada e prioriza simplicidade operacional, baixo custo e velocidade de execução. A arquitetura proposta é adequada ao MVP do CGintegra e permite evolução futura sem comprometer a clareza entre produto, arquitetura e implementação.
