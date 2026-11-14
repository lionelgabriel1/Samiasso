# Diretrizes de Frontend, Design e UX — ITPSS Samiasso

Estas regras complementam o `AGENTS.md` e aplicam-se a qualquer agente ou editor de código que altere a interface do Samiasso.

## 1. Identidade institucional inegociável

Manter a paleta oficial:
- Azul primário: `#1456A0`
- Azul escuro: `#10385F`
- Laranja: `#F28C28`
- Superfície clara: `#F4F6F9`
- Branco: `#FFFFFF`

Não introduzir uma nova cor de marca, nem substituir a paleta por tendências visuais. Tons derivados, transparências e gradientes subtis só são permitidos quando usam estas cores e melhoram contraste ou hierarquia.

Manter a tipografia existente como ponto de partida: Plus Jakarta Sans para títulos e Inter para interface e texto. Não trocar fontes por preferência pessoal sem comparar legibilidade, personalidade, carregamento e consistência.

## 2. Direção de arte: evitar interfaces genéricas

Antes de codificar uma página ou grande componente:
1. Identificar o público, a tarefa principal e o contexto institucional.
2. Definir uma direção visual coerente com uma instituição técnica de saúde em Angola.
3. Rever fotografias e ativos reais disponíveis antes de escolher imagens.
4. Definir hierarquia, grelha, ritmo, espaçamento e comportamento responsivo.
5. Verificar se cada elemento decorativo tem função visual ou funcional.

Evitar:
- Gradientes roxos ou paletas alheias à marca.
- Hero, dashboard e cartões com a mesma composição genérica em todas as páginas.
- Excesso de cartões, sombras, bordas arredondadas e ícones decorativos.
- Animações de entrada em todos os elementos ou movimento contínuo sem finalidade.
- Fotografias de stock apresentadas como instalações, estudantes ou atividades reais do Samiasso.
- Texto promocional inventado, estatísticas não confirmadas ou testemunhos fictícios.

O resultado deve parecer um website institucional próprio, não uma demonstração genérica gerada por IA.

## 3. Sistema de interface

Consolidar tokens reutilizáveis para:
- Tipografia e escala de títulos.
- Espaçamento e largura de conteúdo.
- Raios, bordas e sombras.
- Cores semânticas e estados.
- Botões, campos, cartões, tabelas, tabs, menus, modais, alertas e notificações.

Manter consistência sem forçar todos os componentes a terem a mesma composição. Priorizar legibilidade, alinhamento, contraste e previsibilidade de interação.

## 4. Movimento, carrosséis e microinterações

Animações devem explicar estado, orientar atenção ou confirmar uma ação. Usar transições curtas e discretas; não atrasar tarefas administrativas.

Carrosséis são permitidos quando melhoram a descoberta de cursos, fotografias ou conteúdos:
- Controlos visíveis e acessíveis por teclado.
- Swipe em dispositivos táteis.
- Indicador de posição.
- Pausa do autoplay durante interação e quando a página não está visível.
- Não depender apenas de autoplay.
- Respeitar `prefers-reduced-motion`.

Respeitar `prefers-reduced-motion` em toda a interface. Não esconder conteúdo essencial atrás de animações. Evitar layout shifts e animações que provoquem reflow constante.

## 5. Acessibilidade e responsividade

- Usar HTML semântico, labels visíveis e nomes acessíveis.
- Garantir foco de teclado visível e ordem de navegação lógica.
- Não comunicar estados apenas por cor.
- Fornecer texto alternativo útil para imagens informativas.
- Verificar contraste com as cores institucionais.
- Alvos de toque confortáveis em dispositivos móveis.
- Testar pelo menos 390, 768, 1024 e 1440 px.
- Evitar overflow horizontal da página; tabelas podem ter scroll interno.

## 6. Engenharia React e manutenção

- Preferir componentes pequenos, reutilizáveis e com responsabilidades claras.
- Usar composição em vez de componentes monolíticos com muitas condições.
- Manter separação entre apresentação, estado e regras de negócio.
- Evitar duplicação de componentes e estilos.
- Não adicionar dependências de UI ou animação sem verificar primeiro o que já existe.
- Justificar qualquer nova dependência pelo benefício e custo de bundle/manutenção.
- Não fazer refactors amplos quando uma alteração localizada resolve o problema.

## 7. Performance

- Otimizar imagens e definir dimensões/aspect ratio para evitar CLS.
- Usar lazy loading fora da primeira área visível.
- Evitar fontes e pesos desnecessários.
- Evitar re-renderizações e efeitos que possam ser resolvidos por CSS.
- Medir o impacto de bibliotecas novas.
- Verificar consola, build e experiência em dispositivos modestos.

## 8. Limites funcionais e dados

O redesign é uma alteração de apresentação, não uma autorização para mudar regras de negócio.

Preservar:
- `DataRepository` e persistência LocalStorage nesta fase.
- Autenticação simulada atual.
- Separação entre Secretaria e Estudante.
- Importação, validação, versões, auditoria e publicação explícita de pautas.
- Serviços académicos, comprovativos e justificações.

Não introduzir backend, base de dados, sincronização ou autenticação real nesta etapa visual.

### Matriz curricular de referência

Os três cursos — Enfermagem Geral, Análises Clínicas e Cardiopneumologia — partilham as mesmas 13 disciplinas:
1. L. Portuguesa
2. Inglês
3. Matemática
4. Biologia
5. Química
6. Física
7. Informática
8. Ed. Física
9. Anatomia
10. F. A. I
11. Ética
12. Í. E. C
13. Í. T. L

Preservar as designações oficiais e abreviaturas nos documentos importados/exportados. Não criar matrizes diferentes por curso sem confirmação institucional.

## 9. Skills, ferramentas e referências externas

### Skills já presentes no repositório
Consultar primeiro as skills existentes em `.agents/skills/`. Dar prioridade a:
- `design-taste-frontend` — direção de arte, hierarquia visual e verificação de interface.
- `frontend-ui-engineering` — arquitetura React, acessibilidade e responsividade.
- `performance-optimization` — bundle, imagens, renderização e Core Web Vitals.
- `test-driven-development` — testes e prevenção de regressões.
- `debugging-and-error-recovery` — diagnóstico por causa raiz.
- `browser-testing-with-devtools` — inspeção e testes no navegador.
- `code-review-and-quality` e `code-simplification` — revisão e simplificação.
- `security-and-hardening` — validação, importações e isolamento de perfis.

### Referências adicionais indicadas para este projeto
O utilizador também indicou as seguintes ferramentas e coleções. Devem fazer parte da referência de trabalho do agente, sempre que os respetivos materiais estejam disponíveis:

1. **Anthropic Frontend Design** — usar como referência para direção visual, intenção estética e construção de interfaces com identidade própria.
2. **Impeccable** — considerar os seus 23 comandos, incluindo `/polish`, `/audit` e `/distill`, para polimento visual, auditoria de interface e simplificação. Aplicar apenas comandos efetivamente disponíveis no ambiente.
3. **UI/UX Pro Max** — consultar para padrões de UI/UX, combinações visuais, tipografia, cores, layouts e experiência responsiva.
4. **Vercel Web Design Guidelines** — usar como checklist de qualidade de interface, acessibilidade, semântica e comportamento web.
5. **Vercel React Best Practices** — consultar as 57 regras para decisões de React, desempenho, composição e manutenção; aplicar as regras relevantes sem refactors desnecessários.
6. **Vercel Composition Patterns** — usar para estruturar componentes compostos, APIs de componentes e separar responsabilidades sem criar abstrações excessivas.
7. **AccessLint / Bencium UX Designer** — usar como apoio à auditoria de acessibilidade e à avaliação da experiência de utilização.

### Regras de utilização
- Estas referências adicionais foram indicadas para orientar o trabalho; a sua menção neste documento **não significa que estejam instaladas** no repositório ou disponíveis no agente.
- Antes de usar uma ferramenta, confirmar a instalação, a versão e as instruções oficiais no ambiente.
- Não inventar comandos, resultados de auditoria, métricas ou conformidade. Se uma ferramenta não estiver disponível, aplicar manualmente apenas os princípios conhecidos e documentados, assinalando essa limitação.
- Evitar sobreposição: não executar várias auditorias que verificam exatamente os mesmos pontos sem uma razão concreta.
- Resolver conflitos pela seguinte ordem: identidade visual e requisitos do Samiasso; regras de negócio e segurança do projeto; acessibilidade; desempenho; recomendações genéricas das ferramentas.
- Não copiar cegamente regras de uma skill. Adaptá-las ao contexto, à identidade visual e às necessidades reais do Samiasso.

## 10. Critérios de conclusão

Consultar as skills já existentes em `.agents/skills/` antes de implementar. Dar prioridade a design-taste-frontend, frontend-ui-engineering, performance-optimization, browser-testing-with-devtools, code-review-and-quality e security-and-hardening.

Diretrizes externas como Impeccable, UI/UX Pro Max, Vercel Web Design Guidelines, React Best Practices, Composition Patterns e ferramentas de acessibilidade podem ser usadas como referências quando estiverem disponíveis e forem compatíveis. Não declarar uma skill instalada sem confirmar que os seus ficheiros e instruções existem no repositório.

Não copiar cegamente regras de uma skill. Adaptá-las ao contexto, à identidade visual e às necessidades reais do Samiasso.

## 10. Critérios de conclusão

Uma alteração visual deve incluir:
- Resumo dos componentes/páginas alterados.
- Confirmação de que as regras de negócio foram preservadas.
- Resultado de typecheck e build.
- Testes funcionais relevantes.
- Verificação visual responsiva.
- Lista explícita de limitações ou verificações não executadas.
