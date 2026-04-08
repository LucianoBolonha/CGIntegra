# CGintegra: Design System

Versao: 0.1  
Data: 2026-04-07  
Status: Draft  
Derivado de: `docs/PITCH.md`, `docs/PRD.md` v0.1, `docs/RFC.md` v0.2  
Referencia visual externa: `https://www.cgguarulhos.com.br/`

## 1. Contexto do projeto

O CGintegra ainda esta em fase documental. O Pitch descreve que o fluxo oficial do projeto ainda esta consolidando a etapa de definicao do produto, enquanto o PRD e o RFC ja servem como base inicial para estruturar o MVP e a implementacao futura.

Este design system existe como artefato de alinhamento visual para o MVP, sem substituir wireframes aprovados nem transformar hipoteses de interface em requisitos fechados. Ele foi desenhado para apoiar principalmente:

- dashboard por projeto;
- editor Markdown enriquecido;
- revisao com comentarios inline;
- fluxo de aprovacao por quorum;
- busca;
- exportacao;
- autenticacao basica com papeis;
- audit log.

## 2. Direcao de design

O produto deve comunicar governanca, rastreabilidade e clareza operacional. A interface precisa parecer institucional e confiavel, mas sem ficar burocratica ou fria.

Diretrizes centrais:

- visual claro, com neutros quentes e boa respiracao;
- acento principal em vermelho institucional inspirado no site de referencia;
- contraste alto para leitura longa de documentos;
- componentes com cantos arredondados, porem firmes;
- hierarquia forte para diferenciar estados documentais, aprovacoes e riscos;
- layout responsivo com foco em desktop primeiro, sem perder uso em mobile.

## 3. Paleta de cores

As cores abaixo foram definidas a partir da referencia visual informada. O CSS do site consultado mostrou alta recorrencia de `#DA2337`, `#F6F2E9`, `#F5EFE5`, `#FAF8F4`, `#191711`, `#262626` e `#3F3F3F`.

### 3.1 Cores principais

| Token | Hex | Uso recomendado |
| :---- | :-- | :-------------- |
| `brand-primary` | `#DA2337` | CTA principal, destaques, links importantes, estados de aprovacao pendente |
| `brand-primary-hover` | `#B71C2D` | hover e pressed do CTA principal |
| `brand-primary-soft` | `#F9D7DC` | fundos suaves de destaque e badges |
| `brand-secondary` | `#223744` | contraste institucional, cabecalho, paineis de navegacao |
| `brand-secondary-strong` | `#00112F` | header escuro, graficos, blocos de enfase |

### 3.2 Neutros quentes

| Token | Hex | Uso recomendado |
| :---- | :-- | :-------------- |
| `bg-canvas` | `#F6F2E9` | fundo geral da aplicacao |
| `bg-subtle` | `#F5EFE5` | secoes, paineis secundarios |
| `surface-default` | `#FAF8F4` | cards, modais, tabelas, formularios |
| `surface-raised` | `#FFFFFF` | camadas elevadas e areas de leitura longa |
| `border-soft` | `#E3D8C8` | bordas leves |
| `border-strong` | `#C8B8A5` | divisores importantes e estados ativos |

### 3.3 Texto e semantica

| Token | Hex | Uso recomendado |
| :---- | :-- | :-------------- |
| `text-primary` | `#191711` | titulos e textos de alta prioridade |
| `text-body` | `#262626` | corpo, labels, listas |
| `text-muted` | `#3F3F3F` | apoio visual e conteudo secundario |
| `text-inverse` | `#F4F4F4` | texto sobre fundo escuro ou vermelho |
| `success` | `#2E7D32` | documento aprovado, confirmacoes |
| `warning` | `#C77700` | revisao pendente, quorum parcial |
| `danger` | `#A61B2B` | rejeicao, bloqueios, risco |
| `info` | `#2C5F7B` | informacao auxiliar e auditoria |

## 4. Tipografia

### Familia principal

- `Rubik`, `ui-sans-serif`, `system-ui`, `sans-serif`

Justificativa:

- a referencia utiliza Rubik;
- a familia tem leitura limpa e institucional;
- funciona bem em dashboards, tabelas e textos de interface.

### Escala sugerida

| Estilo | Tamanho | Peso | Uso |
| :----- | :------ | :--- | :-- |
| `display` | `48/52` | 700 | hero, capas e telas vazias |
| `h1` | `36/42` | 700 | titulo de pagina |
| `h2` | `28/34` | 700 | secao principal |
| `h3` | `22/28` | 600 | cards, modais |
| `h4` | `18/24` | 600 | subtitulos e cabecalhos menores |
| `body-lg` | `18/30` | 400 | descricoes e introducoes |
| `body` | `16/26` | 400 | texto padrao |
| `body-sm` | `14/22` | 400 | labels, metadata |
| `caption` | `12/18` | 500 | badges, suporte, audit trail |

## 5. Espacamento, raio e sombra

### Espacamento base

- unidade base: `4px`
- escala recomendada: `4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`

### Raios

- `radius-sm`: `10px`
- `radius-md`: `16px`
- `radius-lg`: `24px`
- `radius-pill`: `999px`

### Sombras

- `shadow-soft`: `0 10px 30px rgba(34, 55, 68, 0.08)`
- `shadow-medium`: `0 18px 40px rgba(25, 23, 17, 0.12)`
- `shadow-focus`: `0 0 0 4px rgba(218, 35, 55, 0.18)`

## 6. Tokens de interface

### Estados de documento

| Estado | Cor principal | Fundo |
| :----- | :------------ | :---- |
| `Rascunho` | `#223744` | `#EAF0F3` |
| `Em revisao` | `#C77700` | `#FFF1D6` |
| `Aprovado` | `#2E7D32` | `#DFF3E3` |
| `Rejeitado` | `#A61B2B` | `#F8D9DE` |
| `Arquivado` | `#6B6B6B` | `#ECE8E2` |

### Estados de comentario

- comentario aberto: borda `brand-primary`, fundo `surface-raised`
- comentario resolvido: borda `border-soft`, texto `text-muted`
- comentario bloqueante: icone ou marcador em `danger`

### Estados de aprovacao

- revisor aguardando: neutro quente
- aprovado: `success`
- solicitou alteracoes: `danger`
- quorum parcial: `warning`

## 7. Principios de composicao

### 7.1 Dashboard

- cards de documentos devem exibir tipo, status, ultima versao, dono e proximo passo;
- o status deve ser visivel sem abrir detalhes;
- filtros precisam ficar sempre acessiveis em desktop e recolhiveis em mobile.

### 7.2 Editor documental

- area de escrita e area de leitura devem coexistir com foco em concentracao;
- comentarios inline precisam parecer conectados a uma versao especifica;
- botoes de salvar, enviar para revisao e exportar devem ter hierarquia clara.

### 7.3 Fluxo de aprovacao

- quorum deve ser legivel com indicadores visuais simples;
- listas de revisores devem mostrar estado individual e impacto no estado geral;
- a interface deve deixar evidente quando o proximo estagio esta bloqueado.

## 8. Biblioteca inicial de componentes

Componentes prioritarios para o MVP:

- topbar institucional;
- sidebar de navegacao;
- card de projeto;
- card de documento;
- badge de status;
- botao primario, secundario e fantasma;
- campo de busca;
- input, select, textarea e area de upload;
- abas de contexto;
- painel de metadados do documento;
- bloco de comentario inline;
- timeline de versoes;
- lista de revisores;
- tabela de audit log;
- modal de confirmacao;
- toast de feedback;
- empty state;
- bloco de exportacao.

## 9. Comportamento responsivo

- `>= 1280px`: dashboard com filtros laterais, cards em 3 colunas e editor em 2 paines;
- `768px - 1279px`: dashboard em 2 colunas, editor com paines empilhados por contexto;
- `< 768px`: navegacao compacta, cards em coluna unica, acoes fixadas no topo do documento.

## 10. Acessibilidade

- contraste minimo alinhado a WCAG 2.1 AA;
- foco sempre visivel com anel em `brand-primary`;
- alvos interativos com area minima de `44px`;
- nao depender apenas de cor para indicar aprovacao, rejeicao ou pendencia;
- badges e alertas devem combinar texto, icone e cor.

## 11. Implementacao futura

Quando a implementacao visual comecar, recomenda-se converter este design system em:

- tokens CSS em `:root`;
- extensoes de tema no `Tailwind CSS`;
- componentes compartilhados para `Button`, `Badge`, `Card`, `Input`, `Tabs`, `Table` e `Toast`;
- documentacao viva ou storybook em fase posterior.

## 12. Decisoes em aberto

Este documento nao fecha os seguintes pontos:

- tema dark mode nao faz parte do MVP;
- iconografia oficial ainda nao esta definida;
- linguagem visual de graficos do dashboard ainda depende de wireframes aprovados;
- PDF exportado pode precisar de adaptacao propria, sem reproduzir toda a UI do produto.

## 13. Artefato complementar

O arquivo `docs/design-system/index.html` apresenta uma vitrine estatica com componentes de exemplo para orientar produto, design e implementacao futura.
