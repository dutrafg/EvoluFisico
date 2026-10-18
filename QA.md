# Verificação — EvoluFísico 8.9.2

Data: 16/10/2026. Base: commit c99668a8ac9849a383fef151a58924c105af4bb6.

## Resultado

41 verificações automatizadas aprovadas:

- 19 de integração em Node + JSDOM + fake-indexeddb.
- 8 do Service Worker em VM com CacheStorage simulado.
- 1 da SPA modular, carregando os 26 JavaScripts e 23 folhas de estilo e executando gravação e leitura pelo motor de evolução.

Também foi verificada a sintaxe dos 26 scripts e do Service Worker e a validade dos arquivos JSON de configuração.

Os resultados detalhados estão em `tests/results.json`, `tests/sw-results.json` e `tests/modular-results.json`. Scripts e dependências de teste acompanham o projeto.

13 verificações adicionais no Chromium 153: página inicial, preservação de rascunho, cabeçalho e formulário em 320/390/768/1440 px, dados profissionais, quatro áreas principais, calculadoras e diagnóstico, alternância de tema, Escape, reabertura offline e ausência de erros JavaScript. Resultados em `tests/browser-results.json`.

## Fluxos cobertos

Inicialização, seleção de cliente, persistência e reabertura do banco, separação de homônimos, alteração de nome, ausência de massa magra, falha de escrita sem confirmação indevida, financeiro no backup completo, exclusão do financeiro no backup individual, adulteração de backup financeiro, criptografia de cobranças, troca e remoção de senha, restauração e desfazer, botão único de PDF, fallback sem IndexedDB, cota esgotada e aviso de armazenamento temporário.

Para o cache: falha de pré-cache, existência dos arquivos, preservação de caches externos, navegação e scripts offline, rotas cleanUrls, exclusão de URLs externas/desconhecidas e atualização por mensagem explícita.

## Limitações

Os 28 testes originais usam DOM, banco e cache simulados. Os 13 testes de interface adicionais usam Chromium real em Linux; a largura de celular é simulada.

Permanecem para homologação manual: interação em aparelho Android físico, instalação e atualização da PWA, impressão/PDF efetivamente gerado, fotos grandes, escolha de pasta e importação de um backup real do usuário. A checagem da ação de PDF confirma a existência de um único botão por cartão, não a qualidade do documento impresso.

Nenhum arquivo foi enviado ao GitHub ou publicado na Vercel.

## Ajuste de Cobranças e contornos — 16/10/2026

Correção de transbordamento dos seletores de modalidade e cabeçalho do cartão. No celular, Individual e Dupla são empilhados. Botões principais do menu recebem borda discreta somente no modo claro.

Verificação específica em Chromium real: HTML único e modular, 320/390/768/1440 px, alternância individual/dupla, visibilidade do segundo aluno, limites dos botões e cabeçalhos e bordas do menu. Dez cenários aprovados, sem erros JavaScript. Script: tests/billing-layout.cjs; resultados: tests/billing-layout-results.json.

## Detalhes no modo escuro — 16/10/2026

Fundos fixos brancos da visualização do paciente substituídos por superfícies do tema na tela. Corrigidas cores de títulos, indicadores e textos SVG. Regras limitadas a screen para preservar impressão. Seis cenários em Chromium aprovados: claro, escuro e fundo de impressão, nas versões modular e HTML único. Resultados: tests/details-theme-results.json. Não é validação completa do PDF gerado.

## Cabeçalho dos detalhes — 16/10/2026

Identificação e ações em linhas separadas; fechar em posição própria; botão PDF com rótulo compacto e descrição completa. Dezesseis cenários de layout em Chromium (HTML único/modular, claro/escuro, 320/390/768/1440 px) e fechamento verificados. Resultados: tests/details-header-results.json.

## 8.9.3 — Cobranças independente do tema simplificado

Corrigido CSS base do módulo: modalidade empilhada no celular, botões com quebra de texto, cabeçalho flexível. Testado em Chromium com ef-simple-ui presente e ausente, versões modular e autônoma, em 320/390/768/1440px; alternância entre Individual e Dupla e visibilidade do segundo aluno verificadas. Dezoito cenários aprovados. Resultados em tests/billing-layout-results.json. Android físico não testado.

## 9.0-beta — Navegação das avaliações

- Nova avaliação disponível no cabeçalho somente em Avaliações.
- Removida ação duplicada ao lado da busca.
- Build e 8 testes de service worker aprovados; sintaxe JavaScript verificada.
- Testes de navegador atualizados, mas não executados neste ambiente sem Chromium.
