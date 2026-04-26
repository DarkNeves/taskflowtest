# Brainstorm de Design — TaskFlow

## Contexto
Aplicação de gerenciamento de demandas com 4 abas: Visão Geral (gráficos/insights), Pendentes (lista ativa), Adicionar (formulário rápido) e Concluídas. Foco em produtividade, clareza e velocidade de uso.

---

<response>
<text>

## Ideia 1 — "Swiss Productivity" (Design Suíço / International Style)

**Design Movement:** Estilo Tipográfico Internacional (Swiss Design) aplicado a ferramentas de produtividade.

**Core Principles:**
- Grid rigoroso com alinhamento matemático
- Hierarquia tipográfica como elemento principal de navegação
- Redução ao essencial — cada pixel tem propósito
- Contraste alto entre elementos funcionais e espaço vazio

**Color Philosophy:** Fundo off-white quente (#FAFAF8) com acentos em verde-escuro (#1B4332) para ações positivas e vermelho-terra (#C1292E) para urgência. Cinzas neutros quentes para hierarquia textual. A paleta transmite confiança e calma profissional.

**Layout Paradigm:** Layout assimétrico com sidebar de navegação fixa à esquerda (ícones + texto), conteúdo principal com grid de 12 colunas. Gráficos ocupam blocos retangulares com proporções áureas.

**Signature Elements:**
- Linhas divisórias finas (1px) como estrutura visual
- Números grandes em fonte mono para contadores
- Indicadores de status com barras verticais coloridas à esquerda dos cards

**Interaction Philosophy:** Transições mínimas e instantâneas. Feedback visual através de mudança de cor/peso tipográfico, não animações elaboradas.

**Animation:** Fade-in sutil (150ms) para troca de abas. Sem bounce, sem spring. Barra de progresso com transição linear.

**Typography System:** Syne (800) para títulos/números grandes. DM Sans (400/500) para corpo. Monospace (JetBrains Mono) para contadores e datas.

</text>
<probability>0.06</probability>
</response>

---

<response>
<text>

## Ideia 2 — "Organic Dashboard" (Biomorphic / Nature-Tech)

**Design Movement:** Design biomorfo combinado com estética de dashboard moderno — formas orgânicas encontram dados estruturados.

**Core Principles:**
- Cantos arredondados generosos e formas suaves
- Gradientes sutis inspirados em natureza (verde-musgo a azul-céu)
- Microinterações que imitam movimentos naturais (folhas, água)
- Camadas de profundidade com sombras difusas

**Color Philosophy:** Base em verde-floresta (#0D3B2E) com superfícies em creme (#F5F0E8). Acentos em âmbar (#E8A838) para alertas e turquesa (#2EC4B6) para sucesso. A paleta evoca uma floresta ao amanhecer — produtividade com tranquilidade.

**Layout Paradigm:** Cards flutuantes com bordas suaves dispostos em grid orgânico (tamanhos variados). Navegação por abas no topo com indicador animado que desliza. Gráficos com cantos arredondados e preenchimento gradiente.

**Signature Elements:**
- Cards com sombra difusa (20px blur) e borda translúcida
- Ícones com estilo line-art orgânico
- Background com padrão sutil de ondas/topografia

**Interaction Philosophy:** Hover com escala sutil (1.02) e elevação de sombra. Cliques com feedback tátil (scale down 0.98). Tudo respira.

**Animation:** Spring physics para transições de página (framer-motion). Cards entram com stagger de 60ms. Gráficos animam de 0 ao valor final com easing orgânico.

**Typography System:** Syne (700/800) para headings com letter-spacing negativo. DM Sans (300/400/500) para corpo com line-height generoso (1.6). Tamanhos contrastantes — títulos 2x maiores que corpo.

</text>
<probability>0.04</probability>
</response>

---

<response>
<text>

## Ideia 3 — "Brutalist Clarity" (Neo-Brutalism Funcional)

**Design Movement:** Neo-brutalismo funcional — bordas duras, sombras sólidas, cores primárias fortes. Anti-corporate, mas extremamente legível.

**Core Principles:**
- Bordas sólidas (2-3px) em preto/escuro em vez de sombras difusas
- Cores saturadas e primárias para categorização instantânea
- Tipografia bold e oversized para hierarquia imediata
- Sem gradientes, sem blur — tudo é direto e honesto

**Color Philosophy:** Fundo branco puro (#FFFFFF) com bordas pretas (#1A1A1A). Vermelho vivo (#FF3B30) para alta prioridade, amarelo (#FFD60A) para média, verde (#34C759) para baixa. Cada cor é imediatamente reconhecível sem legenda.

**Layout Paradigm:** Blocos empilhados com bordas grossas. Navegação por abas com estilo de "folder tabs" físicos. Cards com offset shadow (4px 4px 0px). Layout em coluna única para máxima legibilidade.

**Signature Elements:**
- Sombras sólidas offset (sem blur) em todos os cards
- Badges de prioridade com fundo sólido e texto branco bold
- Botões com borda grossa e hover que inverte cores

**Interaction Philosophy:** Hover com deslocamento de sombra (de 4px para 2px, simulando "pressionar"). Clique com sombra zero (botão "afunda"). Feedback instantâneo e tátil.

**Animation:** Mínima — apenas slide horizontal para troca de abas (200ms, ease-out). Sem fade, sem scale. Gráficos aparecem instantaneamente.

**Typography System:** Syne (800) em tamanhos grandes para tudo que é importante. DM Sans (500) para corpo. Sem itálico, sem light — apenas regular e bold.

</text>
<probability>0.08</probability>
</response>

---

## Decisão

Escolho a **Ideia 2 — "Organic Dashboard"** por equilibrar sofisticação visual com usabilidade. As formas orgânicas e gradientes naturais criam uma experiência agradável para uso diário de produtividade, enquanto a estrutura de dashboard mantém a clareza dos dados. As microinterações com spring physics tornam a navegação fluida e prazerosa.
