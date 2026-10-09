# Correções do Modo Escuro no EvoluFísico v8.9 Estável

Este documento detalha todos os ajustes visuais, de contraste e de superfícies aplicados ao modo escuro (`ef-dark-mode` / `dark-mode`) do **EvoluFísico v8.9 Estável**, com foco nas falhas identificadas nas capturas de tela do usuário.

---

## 1. Problemas Identificados e Corrigidos

### A. Campo de Seleção e Inputs em Foco no Módulo de Cobrança (`#tab-cobranca`)
* **Sintoma visual**: Ao clicar ou focar no campo de seleção de aluno (`#cob_select_aluno1`, `#cob_select_aluno2`) ou no tipo de serviço (`#cob_servico_select`), a caixa do campo ficava com fundo branco puro (`#ffffff`) e o texto ficava branco (`#f8fafc`), tornando tudo ilegível.
* **Causa técnica**: Uma regra legada `.input-group input:focus, .input-group select:focus { background: #fff !important; }` sobrescrevia o tema escuro no momento em que o elemento recebia foco (`:focus`).
* **Solução aplicada**: Regras de alta especificidade para `html.ef-dark-mode :focus` definindo fundo escuro (`#1e293b !important`), borda azul destacada (`#007aff !important`), anel de foco (`box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.35) !important`) e texto nítido em branco (`#ffffff !important`).

### B. Menu de Opções Suspenso (`<select>` e `<option>`)
* **Sintoma visual**: Ao abrir o dropdown de serviços ou alunos, a lista nativa exibia opções com texto branco sobre fundo branco (invisíveis), exceto a opção destacada.
* **Causa técnica**: O elemento `<select>` possuía cor de texto clara (`#f8fafc`), mas os itens `<option>` não tinham cor de fundo explícita definida para o tema escuro, fazendo com que o navegador (Chromium/Windows) renderizasse o popup padrão claro com o texto herdado branco. Além disso, faltava `color-scheme: dark !important` no elemento.
* **Solução aplicada**: 
  - Adicionado `color-scheme: dark !important;` em todos os `<select>` e no contêiner da página.
  - Estilização explícita de `html.ef-dark-mode select option` com fundo escuro (`#1a2332 !important`) e texto claro (`#f8fafc !important`).
  - Destaque das opções selecionadas/em foco com fundo azul vibrante (`#007aff !important`) e texto branco.
  - Substituição da seta do dropdown para SVG com traço claro visível (`stroke="#94a3b8"` normal, `stroke="#60a5fa"` focado).

### C. Cartão do Ponto de Restauração de Segurança (Safety Snapshot) na Central de Backup
* **Sintoma visual**: Na aba *Saúde dos Dados* do modal de backup, o quadro do Safety Snapshot exibia uma caixa branca ofuscante (`#f8fafc`) com textos escuros (`#0f172a`), e os botões de ação e dicas ficavam desarmônicos.
* **Causa técnica**: O contêiner possuía estilos inline fixos `style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; ..."`.
* **Solução aplicada**:
  - Sobrescrita de estilo para o cartão com fundo escuro elegante (`#161f2e !important`) e borda suave (`#2d3a4e !important`).
  - Título `<h4>` e textos convertidos para branco (`#f8fafc !important`) e cinza-azulado (`#94a3b8 !important`).
  - Botão secundário ("📸 Criar Ponto de Restauração Agora") ajustado para pílula escura de alto contraste (`background: #253346 !important; border: 1px solid #3b4d66 !important; color: #f8fafc !important;`).
  - Botão de contorno ("↩️ Reverter para Último Ponto de Segurança") estilizado com borda azul viva (`#3b82f6 !important`) e texto azul suave (`#60a5fa !important`).
  - Bloco de *Boas práticas de backup recomendadas* ajustado com texto em cinza claro legível (`#cbd5e1 !important`) e títulos em branco.

### D. Botão do Combo Dupla no Módulo de Cobrança
* **Sintoma visual**: O botão "⚡ Aplicar Combo Dupla (15% OFF)" continha estilo inline rígido com fundo branco (`background:#ffffff; border-color:#0071e3;`).
* **Solução aplicada**: Sobrescrita para fundo escuro (`#1e293b !important`), borda azul (`#3b82f6 !important`) e texto em azul claro (`#60a5fa !important`) com transição suave no hover.

---

## 2. Resumo das Cores no Modo Escuro

| Componente | Fundo (Background) | Texto (Color) | Borda (Border) |
| :--- | :--- | :--- | :--- |
| **Inputs / Selects (Normal)** | `#111b2a` | `#f8fafc` | `#3b4d66` |
| **Inputs / Selects (Focado)** | `#1e293b` | `#ffffff` | `#007aff` |
| **Opções do Dropdown (`<option>`)** | `#1a2332` | `#f8fafc` | — |
| **Opção Selecionada / Hover** | `#007aff` | `#ffffff` | — |
| **Cartão Safety Snapshot** | `#161f2e` | `#f8fafc` / `#94a3b8` | `#2d3a4e` |
| **Cartões de Cobrança (`.cob-card`)** | `#1b2432` | `#f8fafc` | `#344256` |
| **Controle Segmentado (1 ou 2 Pessoas)** | `rgba(15,23,42,0.6)` | `#94a3b8` (Ativo: `#60a5fa`) | `#2d3a4e` |