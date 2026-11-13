# AGENTS.md — ITPSS Samiasso (`lionelgabriel1/Samiasso`)

Configuração de agente e convenções de engenharia para a plataforma institucional e académica do **Instituto Técnico Privado de Saúde Samiasso (ITPSS)**.

## Arquitetura e Limites Obrigatórios

- **Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + Recharts + SheetJS (`xlsx`).
- **Persistência**: Manter a camada `DataRepository` (`src/services/dataRepository.ts`) sobre `localStorage` nesta fase.
- **Identidade Visual Oficial**:
  - Navy institucional: `#10385F`
  - Azul primário: `#1456A0`
  - Laranja de destaque/CTA: `#F28C28`
  - Superfície clara: `#F4F6F9`
  - Tipografia: `Plus Jakarta Sans` (títulos) + `Inter` (corpo, navegação e formulários).
- **Regras Académicas e Segurança**:
  - `Matrícula` (`studentNumber`) é o identificador principal; nunca criar estudantes automaticamente em importações.
  - Pautas importadas entram como rascunho (`published: false`) e só ficam visíveis no Portal do Estudante após publicação explícita pela Secretaria.
  - Substituições de pautas existentes exigem confirmação e preservam histórico de versões e auditoria.
  - Utilizar fotografias reais existentes em `public/images/` (sem imagens genéricas de banco).

## Skills Configuradas no Projeto (`.agents/skills/`)

### Direção de Arte e Qualidade Visual (`Leonxlnx/taste-skill`)
- `design-taste-frontend` (`.agents/skills/design-taste-frontend/`): direção de arte, hierarquia tipográfica, ritmo visual, responsividade móvel, verificação visual em navegador e gate de qualidade.
  - **Nota de ambiente**: Ao executar scripts em `.agents/skills/design-taste-frontend/scripts/` neste contentor, definir:
    `CHROME_PATH=/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell`

### Engenharia Frontend (`addyosmani/agent-skills`)
Skills selecionadas em `.agents/skills/` com checklists partilhadas em `.agents/references/`:
- `frontend-ui-engineering` (`../../references/accessibility-checklist.md`) — Arquitetura de componentes React, acessibilidade WCAG e layouts responsivos.
- `performance-optimization` (`../../references/performance-checklist.md`) — Otimização de bundle, re-renderizações, imagens e Core Web Vitals.
- `test-driven-development` (`../../references/testing-patterns.md`) — Desenvolvimento orientado a testes e regressão.
- `debugging-and-error-recovery` — Depuração sistemática por causa raiz.
- `browser-testing-with-devtools` — Inspeção DOM, consola e verificação funcional no navegador.
- `code-review-and-quality` — Revisão multi-eixo de qualidade, legibilidade e arquitetura.
- `code-simplification` — Simplificação estrutural sem alteração de comportamento.
- `security-and-hardening` (`../../references/security-checklist.md`) — Validação de entradas, importações Excel e isolamento entre perfis (Admin/Secretaria vs Estudante).

> **Compatibilidade com o ambiente**: Em Google AI Studio / ambientes sem `agy` CLI no PATH, estas skills em `.agents/skills/` complementam as skills nativas do sistema (como `frontend_design`, `ultra_mode` e `computer_use`). Em Antigravity CLI/IDE, `.agents/skills/` é descoberto automaticamente ao nível do projeto.

## Comandos de Verificação

- **Typecheck**: `npm run lint` (`tsc --noEmit`)
- **Build de produção**: `npm run build`
- **Testes unitários**: `npx --yes tsx --test src/utils/academic.test.ts src/utils/pautaGeral.test.ts`
