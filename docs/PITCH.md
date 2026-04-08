# Visão Geral do Processo

O desenvolvimento do CGintegra segue um pipeline documental de três estágios. Cada documento responde a uma pergunta diferente, e a resposta de um habilita a construção do próximo.

| Pitch | PRD | RFC | Código |
| :---- | :-- | :-- | :----- |
| Por que fazer? | O que fazer? | Como fazer? | Implementação |

Cada estágio passa por ciclos iterativos de revisão até atingir uma versão estável. Só então avançamos para o próximo documento. Isso evita retrabalho: não faz sentido detalhar APIs (RFC) se os requisitos de negócio (PRD) ainda estão indefinidos.

## 1. Pitch: "Por que fazer?"

### Propósito

Convencer stakeholders, técnicos e não técnicos, de que o problema existe, é relevante e que a solução proposta é viável. O Pitch é um documento de venda de ideia, não de especificação.

### O que deve conter

| Seção | Descrição |
| :---- | :-------- |
| O Problema | Dor real, tangível, com exemplos do dia a dia. |
| A Solução | Visão de alto nível: fluxo principal e funcionalidades macro. |
| Diferenciais | O que torna esta solução melhor que o processo atual. |
| Arquitetura (alto nível) | Stack escolhida e por quê. Sem detalhamento. |
| Roadmap | Fases e milestones com horizonte temporal. |
| Custos | Estimativa de infraestrutura e operação. |
| Riscos e Mitigações | Principais riscos e como serão tratados. |

### Características

- Tom: persuasivo, direto e acessível a não técnicos.
- Extensão: 3-5 páginas, conciso por design.
- Audiência: liderança, patrocinadores e decisores.
- Critério de avanço: stakeholders aprovam a ideia e autorizam o detalhamento.

### O que não entra no Pitch

- Requisitos funcionais detalhados; isso é PRD.
- Schema de banco, contratos de API e algoritmos; isso é RFC.
- Critérios de aceitação, personas detalhadas e jornadas; isso é PRD.

---

## 2. PRD: "O que fazer?"

### Propósito

Traduzir a visão aprovada no Pitch em requisitos de produto concretos, mensuráveis e priorizados. O PRD é o contrato entre negócio e engenharia sobre o que será construído, sem definir como.

### O que deve conter

| Seção | Descrição |
| :---- | :-------- |
| Visão Geral | Recap do problema e proposta de valor, com link ao Pitch. |
| Personas | Quem usa, em qual contexto, necessidades e frustrações. |
| Escopo do MVP | O que entra e o que não entra. |
| Requisitos Funcionais | Módulos com campos, comportamentos e critérios de aceitação. |
| Requisitos Não Funcionais | Performance, segurança, disponibilidade e acessibilidade. |
| Regras de Negócio | Lógica de domínio: ciclo de vida, prioridades e restrições. |
| Jornadas de Usuário | Passo a passo de cada fluxo principal. |
| Wireframes | Referência visual das telas principais. |
| Integrações | Sistemas externos com os quais o produto se comunica. |
| KPIs | Como saberemos se o produto está funcionando. |
| Roadmap de Entregas | Fases em semanas com entregas específicas. |

### Características

- Tom: preciso, orientado a requisitos e sem ambiguidade.
- Extensão: 10-20 páginas.
- Audiência: Product Owner, engenharia, QA e design.
- Critério de avanço: requisitos estáveis, sem pendências de escopo.

### O que não entra no PRD

- Decisões de implementação, como ORM ou biblioteca de autenticação; isso é RFC.
- Código, schemas SQL e diagramas de classe; isso é RFC.
- Argumentação de por que o projeto existe; isso é Pitch.

---

## 3. RFC: "Como fazer?"

### Propósito

Definir como os requisitos do PRD serão implementados. O RFC é o documento de decisão técnica: registra escolhas arquiteturais, trade-offs aceitos e serve como contrato técnico antes de escrever código.

### O que deve conter

| Seção | Descrição |
| :---- | :-------- |
| Resumo Executivo | O que este RFC cobre e qual PRD referencia. |
| ADRs | Cada decisão com contexto, decisão, consequências e mitigação. |
| Schema do Banco | Diagrama ER, definição completa e convenções. |
| Estrutura do Projeto | Árvore de diretórios com responsabilidade de cada módulo. |
| Contratos de API | Endpoints, métodos, payloads e auth/authz. |
| Algoritmos-chave | Implementação de lógicas complexas, como um match engine. |
| Infraestrutura e Deploy | Dockerfile, docker-compose, backup, restore e env vars. |
| Segurança | Checklist com implementação específica. |
| Estratégia de Testes | Camadas, ferramentas e cobertura. |
| Decisões em Aberto | Questões não resolvidas com opções e deadline. |

### Características

- Tom: técnico, detalhado e opinado, com decisões justificadas.
- Extensão: 15-30+ páginas.
- Audiência: desenvolvedores, arquitetos e DevOps.
- Critério de avanço: RFC revisado sem objeções bloqueantes.

### O que não entra no RFC

- Justificativa de negócio; isso é Pitch.
- Requisitos funcionais ou critérios de aceitação; isso é PRD.
- Código de produção; isso é a implementação em si.

---

## Nosso Processo de Trabalho

### Princípio: um documento por vez

Não avançamos para o próximo documento até que o atual esteja em uma versão estável e revisada. Isso não significa perfeição; significa que as decisões daquele nível estão tomadas e não há pendências bloqueantes.

### Fluxo Prático

1. **Pitch v0.1** -> revisões iterativas -> **Pitch v1.0** -> aprovado
2. **PRD v0.1** (baseado no Pitch v1.0) -> revisões -> **PRD v1.0** -> aprovado
3. **RFC v0.1** (baseado no PRD v1.0) -> revisões -> **RFC v1.0** -> aprovado
4. **Implementação** -> código baseado no RFC v1.0

### Feedback Loops

Restrições técnicas descobertas no RFC podem retroalimentar o PRD. Da mesma forma, durante o PRD podemos descobrir que o escopo do Pitch era ambicioso demais para o MVP. O importante é que o fluxo principal seja top-down (Pitch -> PRD -> RFC), e os feedback loops sejam exceção documentada, não regra.

### Onde Estamos Agora

- `[###--]` Pitch: estamos aqui, iterando até a v1.0
- `[-----]` PRD: aguardando Pitch v1.0
- `[-----]` RFC: aguardando PRD v1.0
- `[-----]` Implementação: aguardando RFC v1.0

> O Pitch v0.1 já está criado. Vamos revisá-lo e ajustá-lo até uma versão estável. A partir dela, iniciaremos o PRD seguindo o mesmo processo iterativo.

---

## Resumo Comparativo

| Aspecto | Pitch | PRD | RFC |
| :------ | :---- | :-- | :-- |
| Pergunta central | Por que fazer? | O que fazer? | Como fazer? |
| Tom | Persuasivo | Preciso | Técnico |
| Audiência | Decisores | Produto / Eng / QA | Devs / Arquitetos |
| Extensão | 3-5 páginas | 10-20 páginas | 15-30+ páginas |
| Nível de detalhe | Alto nível | Requisitos detalhados | Implementação |
| Decisões | Problema e viabilidade | Escopo e regras | Arquitetura e APIs |
| Critério de pronto | Ideia aprovada | Requisitos estáveis | Sem objeções |

CGintegra: _da ideia à implementação com intencionalidade._
