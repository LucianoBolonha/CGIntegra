export type DocumentType = "PITCH" | "PRD" | "RFC";

export interface DocumentTemplate {
  type: DocumentType;
  contentMarkdown: string;
}

const templates: Record<DocumentType, DocumentTemplate> = {
  PITCH: {
    type: "PITCH",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## O Problema",
      "",
      "## A Solução",
      "",
      "## Diferenciais",
      "",
      "## Arquitetura de Alto Nível",
      "",
      "## Roadmap",
      "",
      "## Custos",
      "",
      "## Riscos e Mitigações"
    ].join("\n")
  },
  PRD: {
    type: "PRD",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## Sumário Executivo",
      "",
      "## Personas",
      "",
      "## Escopo do MVP",
      "",
      "## Requisitos Funcionais",
      "",
      "## Regras de Negócio",
      "",
      "## Jornadas de Usuário"
    ].join("\n")
  },
  RFC: {
    type: "RFC",
    contentMarkdown: [
      "# {{title}}",
      "",
      "## Resumo Executivo",
      "",
      "## ADRs",
      "",
      "## Arquitetura Proposta",
      "",
      "## Schema do Banco",
      "",
      "## Contratos de API",
      "",
      "## Estratégia de Testes"
    ].join("\n")
  }
};

export function getDocumentTemplate(type: DocumentType): DocumentTemplate {
  return templates[type];
}
