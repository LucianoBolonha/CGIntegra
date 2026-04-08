# CGintegra: PRD

Versão: 0.1  
Data: 2026-03-xx  
Autor: [Nome do Product Owner]

## Sumário Executivo

CGintegra é uma plataforma documental para gerenciar o ciclo Pitch -> PRD -> RFC -> Implementação com versionamento, workflows de revisão e aprovação, rastreabilidade e integrações como SSO, repositórios e notificações. O objetivo do MVP é permitir que times de produto e engenharia criem, iterem e aprovem documentos com regras que garantam que somente documentos aprovados avancem ao próximo estágio.

Critério de sucesso do MVP: reduzir o tempo médio entre Pitch inicial e RFC final em 30% para 3 projetos-piloto e garantir que 90% das equipes adotem o fluxo documentado.

---

## Contexto e Problema

Times gastam tempo desnecessário em reuniões longas e reescrita de documentos por falta de um fluxo padronizado e de ferramentas que garantam versionamento, comentários estruturados e aprovação formal. Também falta integração entre decisões de negócio e decisões técnicas registradas.

---

## Objetivos do Produto (OKRs Iniciais)

- O1: Padronizar e acelerar o pipeline documental (Pitch -> PRD -> RFC).
- KR1: Tempo médio Pitch -> PRD <= 2 semanas para projetos do MVP.
- KR2: Tempo médio PRD -> RFC <= 3 semanas.
- O2: Garantir rastreabilidade de decisões.
- KR1: 100% dos RFCs vinculados a um PRD aprovado.
- KR2: Audit trail disponível para todas as versões.
- O3: Facilitar colaboração assíncrona.
- KR1: Sistema de comentários e revisão com aprovação em todos os documentos.

---

## Personas

- Product Owner (PO): cria Pitch, define escopo do PRD e solicita aprovações.
- Product Manager / Sponsor: aprova Pitch e prioriza roadmap.
- Designer: contribui com wireframes e revisa o PRD.
- Tech Lead / Arquiteto: revisa o PRD e escreve ou autoriza o RFC.
- Desenvolvedor: consulta o RFC e implementa.
- Revisor / Stakeholder: revisa e aprova documentos.
- Operações / DevOps: consome RFCs para infraestrutura e deploy.
- Auditor / Compliance: consulta histórico e evidências de aprovação.

---

## Escopo do MVP

### O que entra

- Criação de documentos com templates de Pitch, PRD e RFC em editor Markdown enriquecido.
- Versionamento automático com salvamento de versões e ramificações.
- Workflow de revisão com atribuição de revisores, comentários inline e aprovação formal, com quorum configurável por documento.
- Vinculação entre documentos, por exemplo: criar PRD a partir de Pitch aprovado e criar RFC a partir de PRD aprovado.
- Dashboard de projeto com status dos documentos, responsáveis e próximos passos.
- Exportação para PDF e exportação completa em Markdown.
- Busca full-text por documentos e metadados, como autor, tags e status.
- Autenticação básica com conta local e papéis como Admin, PO, Revisor e Dev.
- Notificações por e-mail para criação, comentários e solicitações de aprovação.
- Audit log das ações principais, como criação, edição, aprovação e exportação.

### O que fica fora do MVP

- SSO via SAML ou OAuth e integração com LDAP corporativo.
- Integração com GitHub e GitLab para sincronização de RFC, issues e PRs.
- Integração com Slack e Microsoft Teams para notificações.
- Automação da transformação de PRD -> RFC com templates avançados.
- Analytics avançado, como tempo médio por fase e adoção.
- Editor colaborativo em tempo real, estilo Google Docs.
- Controle de versão com branching avançado em estilo Git.

---

## Requisitos Funcionais (RFs)

Cada requisito inclui descrição breve e critérios de aceitação.

### RF-01: Autenticação e Autorização

- Descrição: usuários se autenticam e possuem papéis com permissões associadas.
- Papéis mínimos: `Admin`, `ProductOwner`, `Revisor`, `Developer`, `Viewer`.
- Critérios de aceitação:
- Usuário com credenciais válidas consegue login.
- Admin configura usuários e papéis.
- PO pode criar e editar documentos de seu projeto.
- Revisor pode comentar e aprovar quando atribuído.
- Viewer visualiza apenas documentos públicos ou compartilhados.

### RF-02: Criação de Projeto e Metadados

- Descrição: criar projetos, por exemplo "Integração X", com nome, dono e tags.
- Critérios de aceitação:
- PO cria projeto com nome, descrição e tags.
- Projeto aparece no dashboard e pode ser filtrado por tag.

### RF-03: Editor Markdown Enriquecido + Templates

- Descrição: editor com suporte a Markdown, upload de anexos, imagens e placeholders para templates de Pitch, PRD e RFC.
- Critérios de aceitação:
- Usuário pode selecionar template ao criar documento.
- Markdown é renderizado corretamente na visualização.
- Anexos vinculados persistem na versão do documento.

### RF-04: Versionamento e Histórico

- Descrição: cada salvamento cria um snapshot, com possibilidade de nomear versões como `v0.1` e `v1.0`, comparar diffs e reverter.
- Critérios de aceitação:
- Histórico mostra autor, timestamp e comentário de versão.
- Usuário com permissão pode reverter para versão anterior.

### RF-05: Workflow de Revisão e Aprovação

- Descrição: fluxo configurável de enviar para revisão -> atribuir revisores -> comentar -> aprovar ou rejeitar, com quorum configurável e validação por unanimidade ou maioria.
- Critérios de aceitação:
- PO envia documento para revisão.
- Revisores recebem notificação e podem comentar inline.
- Quando o quorum é alcançado, o documento muda automaticamente para status `Aprovado`.
- É impedido criar PRD a partir de um Pitch não aprovado.

### RF-06: Vinculação entre Documentos

- Descrição: relacionar documentos do fluxo Pitch -> PRD -> RFC com link e metadados de origem, como ID e versão.
- Critérios de aceitação:
- Ao criar PRD, o sistema pergunta qual Pitch aprovado deve ser vinculado.
- O vínculo aparece no PRD.
- O histórico do Pitch mostra links para PRDs e RFCs derivados.

### RF-07: Busca e Filtros

- Descrição: busca full-text por conteúdo e metadados, com filtros por projeto, status, autor, tag e data.
- Critérios de aceitação:
- Resultados retornam documentos relevantes com trecho de contexto.
- Filtros podem ser combinados.

### RF-08: Export e Import

- Descrição: exportar documentos para PDF e baixar Markdown com anexos. Importar Markdown simples com metadados mínimos.
- Critérios de aceitação:
- Export gera PDF com capa, título, autor, versão e sumário.
- Import cria rascunho com o conteúdo importado.

### RF-09: Dashboards e Status

- Descrição: painel por projeto com estado de cada documento, como rascunho, em revisão, aprovado ou rejeitado.
- Critérios de aceitação:
- PO visualiza lista com status e prazos.
- Widget exibe métricas básicas, como número de documentos, aprovados e tempo médio de aprovação.

### RF-10: Notificações

- Descrição: envio de e-mail ao criar, atribuir, comentar, solicitar aprovação e atingir eventos do workflow.
- Critérios de aceitação:
- Notificações são enviadas em eventos configuráveis.
- Cada usuário pode ativar ou desativar preferências.

### RF-11: Audit Log

- Descrição: registrar ações importantes com usuário, timestamp, ação e documento.
- Critérios de aceitação:
- Admin pode consultar audit log filtrando por documento, usuário e período.

### RF-12: Permissões de Acesso a Documentos (Compartilhamento)

- Descrição: compartilhar documento com usuários externos ao projeto por link, opcionalmente com senha e expiração, e controlar visibilidade como privada, por projeto ou pública.
- Critérios de aceitação:
- Links protegidos por senha funcionam e expiram conforme configuração.
- Acesso respeita os papéis definidos.

---

## Requisitos Não Funcionais (RNFs)

### RNF-01: Performance

- Objetivo: página de documento renderizar em <= 300 ms para 95% das requisições em condições normais.
- Objetivo: busca retornar resultados básicos em <= 1 s para dataset de até 10 mil documentos.

### RNF-02: Disponibilidade

- Objetivo: SLA mensal de 99,5% para o serviço principal, incluindo editor, leitura e workflow.

### RNF-03: Escalabilidade

- Sistema inicialmente otimizado para deploy simples em container único com volume persistente, com evolução incremental conforme crescimento de usuários e documentos.

### RNF-04: Segurança

- Transporte com TLS 1.2+.
- Senhas armazenadas com hashing `bcrypt` ou `argon2`.
- Proteção contra XSS e CSRF.
- Controle de acesso por papel e verificação de autorização em endpoints.
- Critérios de aceitação:
- Teste básico de penetração executado e vulnerabilidades críticas mitigadas antes do rollout.

### RNF-05: Backup e Recuperação

- Backups diários dos metadados e anexos.
- Backup contínuo do banco local com replicação externa.
- RTO alvo: 4 horas.
- RPO alvo: 24 horas.

### RNF-06: Observabilidade

- Logs estruturados, métricas como tempo de resposta e filas, além de alertas para erros críticos.

### RNF-07: Acessibilidade

- Interfaces principais conformes a WCAG 2.1 AA.

### RNF-08: Localização

- Interface em `pt-BR` inicialmente, com arquitetura pronta para i18n.

---

## Regras de Negócio (RB)

- RB-01: um documento só pode avançar ao próximo estágio se o estágio corrente estiver com status `Aprovado` e atender ao quorum configurado.
- RB-02: versões marcadas como `v1.0` ou superiores são consideradas versões estáveis; somente `Admin` e `PO` podem marcar.
- RB-03: comentários e aprovações ficam associados à versão do documento; alterações subsequentes geram nova versão.
- RB-04: quando um RFC é criado a partir de um PRD, ele deve referenciar explicitamente a versão utilizada.
- RB-05: itens sensíveis anexados, como planos de custo, exigem permissão especial para download, configurável por projeto.
- RB-06: prazos de revisão, com padrão de 7 dias, geram lembretes automáticos; ao expirar, o PO recebe notificação e pode reconfigurar quorum e prazo.

---

## Jornadas de Usuário

### J1: Criar Pitch e Obter Aprovação

1. PO cria projeto e seleciona template de Pitch.
2. PO escreve o Pitch no editor.
3. PO salva versões e envia para revisão, atribuindo 2 revisores.
4. Revisores recebem e comentam inline.
5. Revisores aprovam; quando o quorum por maioria é atingido, o status muda para `Aprovado`.
6. PO marca Pitch `v1.0` e cria um PRD a partir dele.

### J2: Produzir PRD a Partir do Pitch Aprovado

1. PO inicia PRD vinculando um Pitch aprovado e sua versão.
2. Preenche seções como Personas, Escopo e Requisitos.
3. Designer e Tech Lead adicionam comentários e anexam wireframes.
4. PO envia o PRD para revisão técnica e de negócio.
5. Após aprovação, o PRD muda para `Aprovado` e autoriza a criação de RFC.

### J3: Criar RFC e Preparar Implementação

1. Tech Lead cria RFC a partir do PRD aprovado, com referência versionada.
2. RFC contém decisões, schema e contratos de API com alta granularidade.
3. A revisão técnica ocorre com aprovação de DevOps e Arquitetura.
4. RFC aprovado aciona o início da implementação.

### J4: Busca e Auditoria Retroativa

1. Auditor filtra por projeto e seleciona versões aprovadas.
2. Auditor exporta PDF com histórico de aprovações.

---

## Wireframes / Layouts (Descrição Textual)

### Tela Inicial / Dashboard do Projeto

- Cabeçalho com nome do projeto, dono e botões `Novo documento` e `Importar`.
- Cards por documento com título, tipo, status, última versão, responsáveis e prazo.
- Filtros laterais por status, tipo, tag e responsáveis.
- Mapa rápido com número de documentos em rascunho, revisão e aprovados.

### Editor de Documento

- Painel esquerdo com editor Markdown, toolbar para headings, negrito, listas e imagens.
- Painel direito com preview renderizado e comentários inline.
- Topbar com seletor de template e botões `Salvar versão`, `Enviar para revisão` e `Exportar PDF`.
- Dropdown de versões com histórico.

### Tela de Revisão

- Lista de revisores com status como aguardando, aceito e rejeitado.
- Feed de comentários com contexto de versão.
- Botões `Aprovar` e `Solicitar alterações`.

### Página de Vínculo Entre Documentos

- Visualização em árvore do fluxo Pitch -> PRD -> RFC com links e badges de versão.
- Botão `Criar PRD a partir deste Pitch`.

---

## Integrações

### Prioridade do MVP

- E-mail via SMTP para notificações.
- Deploy com volume persistente e estratégia de backup contínuo do banco.

### Roadmap

- SSO via OAuth2 ou SAML para integração corporativa.
- GitHub e GitLab para vincular RFCs a repositórios e criar issues ou PRs.
- Slack e Microsoft Teams para notificações e aprovações rápidas.
- Evolution API e WhatsApp Cloud API para mensageria operacional, se essa capacidade entrar no produto.
- Jira e Asana para gerar tasks a partir de itens do PRD e RFC.

---

## Métricas / KPIs

- Tempo médio Pitch -> PRD em dias.
- Tempo médio PRD -> RFC em dias.
- Percentual de documentos aprovados dentro do SLA de 7 dias.
- Número de versões por documento como indicador de clareza.
- Adoção: percentual de projetos que usam CGintegra em relação ao total.
- Número de issues de implementação atribuídas a RFCs, como métrica de rastreabilidade.
- Satisfação dos usuários, via NPS interno trimestral.

---

## Roadmap de Entregas

### Fase 0 (0-4 semanas): Preparação

- Infraestrutura básica, repositório, definição de templates e base de deploy.
- Protótipo do editor com save e load.
- Backlog final do MVP.

### Fase 1 (4-12 semanas): MVP

- Implementar RF-01 a RF-06, incluindo editor, templates, versionamento, workflow e vinculação.
- Dashboard básico, exportação em PDF e busca simples.
- Notificações por e-mail.
- Auditoria básica e logs.

### Fase 2 (12-20 semanas): Integrações e Melhorias

- SSO via OAuth, melhorias de busca full-text com filtros avançados e expansão operacional da infraestrutura.
- Exportação avançada com sumário automático e importação de Markdown.
- Painel inicial de métricas.

### Fase 3 (20-36 semanas): Escala e Automações

- Integração com GitHub, GitLab, Slack e Jira.
- Analytics, relatórios, políticas de retenção e compliance.
- Editor colaborativo opcional e acessibilidade avançada.

---

## Critérios de Pronto para o PRD (Definition of Ready)

- Todos os requisitos funcionais do MVP documentados com critérios de aceitação claros.
- Personas validadas com stakeholders-chave.
- Wireframes das telas críticas, como editor, revisão e dashboard.
- Lista inicial de integrações priorizadas.
- Roadmap com milestones e owners definidos.
- Riscos e dependências identificados.

---

## Riscos, Dependências e Mitigações

### Risco 1: Baixa adesão por mudança de fluxo

- Mitigação: treinamentos curtos, pilotos com times influentes e UX simples.

### Risco 2: Integração com identidade corporativa pode atrasar o rollout

- Mitigação: implementar autenticação local no MVP e deixar SSO para a fase 2.

### Risco 3: Complexidade de aprovação e governança

- Mitigação: configuração inicial conservadora e ajustes por projeto.

### Dependências

- Serviço de e-mail SMTP.
- Plataforma de deploy com volume persistente e rotina de backup contínuo.
- Apoio da área de segurança para requisitos de compliance.

---

## Open Issues / Perguntas a Resolver

1. Qual deve ser o quorum padrão por documento: maioria simples ou unanimidade?
2. Qual política de retenção de versões e anexos é exigida por compliance?
3. Qual o nível de integração com repositórios de código: apenas links ou sincronização automática de RFC <-> repositório?
4. Como deve funcionar o fluxo de aprovação para documentos cross-team, com owners e revisores obrigatórios?

---

## Plano de Validação do MVP

- Rodar 3 pilotos com times compostos por PO, 3 desenvolvedores e 1 designer durante 4-6 semanas.
- Coletar métricas de tempo, número de revisões e feedback qualitativo.
- Ajustar e estabilizar antes do rollout mais amplo.

---

## Anexos

- Templates iniciais de Pitch, PRD e RFC.
- Checklist de segurança para release.
- Guia rápido de uso, de 1 página, para PO e Revisor.

---

## Próximos Possíveis Passos

Se desejado, este PRD pode ser desdobrado em:

- Templates Markdown de Pitch, PRD e RFC prontos para importação no editor.
- Wireframes em SVG ou PNG com base nas descrições.
- Backlog de histórias de usuário com estimativas.
- Recomendações para responder às Open Issues.
