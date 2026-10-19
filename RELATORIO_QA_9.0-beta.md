# Relatório de QA — EvoluFísico 9.0-beta

**Artefato testado:** `EvoluFisico_9.0-beta_QA_Notificacoes.html`  
**SHA-256:** `d347947b60a291566bce7a823178676a521a848065cd3a9ccbb3721e2ecc6d3e`  
**Tamanho:** 1,250,694 bytes  
**Ambiente:** Chromium headless em desktop e emulações de telas móveis. Dados fictícios e armazenamento isolado.

## Resultado

- **70 verificações funcionais/de interface aprovadas; 0 reprovações** na bateria principal.
- **8 testes de Service Worker aprovados**.
- **1 verificação de impressão aprovada**.
- **27 módulos JavaScript e 27 blocos incorporados** sem erros de sintaxe.
- **3 testes extras aprovados:** fechamento automático da tela de abertura; chamada simulada de vibração; ausência de erros JavaScript no fluxo simulado.
- **6 larguras de tela:** 360, 390, 768, 1024, 1365 e 1920 px. **7 rotas cada**, sem rolagem horizontal da página e sem erros de JavaScript detectados.
- **HTML único autônomo:** sem dependências de arquivo JavaScript ou CSS externos via tags `script src` ou `link rel=stylesheet`.

## Melhorias e correções aplicadas

1. Seção **Configurações → Notificações** com som sintetizado localmente (Web Audio API), vibração quando a API é suportada, volume, antecedência e controles independentes.
2. Alertas de atendimentos enquanto a página estiver aberta, com prevenção de alertas duplicados e desconsideração de compromissos cancelados/concluídos.
3. Correção de escape de identificadores/textos em eventos de agenda e cartões de histórico para reduzir o risco de execução de código ao clicar em dados importados.
4. Revisão de alinhamento do cartão Aparência ao lado de Notificações.
5. Correção de texto antigo em inglês na apresentação e no aviso da agenda.

## Bateria funcional

- Boot: página carregada
- Home: calendário e agenda visíveis
- Agenda: cadastrar com local e duração
- Agenda: impede sobreposição de intervalos
- Agenda: preenche local ao editar
- Agenda: reagendar e alterar local
- Agenda: confirmar presença
- Agenda: filtro por local criado
- Tarefas: cadastrar
- Tarefas: concluir
- Tarefas: excluir
- Segurança: escape de eventos e texto importados — {'attacked': False, 'input': "O'Brien"}
- Agenda: excluir
- Configurações: Notificações presente
- Notificações: controles salvam — {'reminders': False, 'sound': True, 'vibration': False, 'minutes': 5, 'volume': 70}
- Notificações: som é acionável
- Aparência: cinco cores diferentes — [{'key': 'verde', 'color': '#75d7a9'}, {'key': 'azul', 'color': '#73aef9'}, {'key': 'roxo', 'color': '#ad95ff'}, {'key': 'laranja', 'color': '#f9b276'}, {'key': 'rosa', 'color': '#f3a5c5'}]
- Aparência: cor salva
- Notificações: lembrete único sem duplicação — ['Atendimento de Pessoa QA começa em 4 min. Local: Academia Norte.']
- Notificações: cancelados não geram lembretes
- JavaScript: sem exceções detectadas

## Cobertura de responsividade

O teste navegou por Início, Avaliações, Evolução, Calculadora, Cobranças, Diagnóstico e Configurações nas seis larguras. Verificações automatizadas confirmaram aba correta e ausência de *overflow* horizontal do documento. Tabelas que precisam de rolagem própria podem mantê-la.

## Limitações e cuidados importantes

- **Não é certificação de segurança ou teste de invasão completo.** A análise de vulnerabilidades foi focada em comportamento de interface, dados injetados, links/recursos e pontos de código estudados.
- **A agenda e as tarefas continuam armazenadas no navegador local**, sem garantia de criptografia específica em repouso. Em dispositivos compartilhados, preserve acesso ao aparelho e mantenha backup seguro. A proteção adicional destes registros requer projeto de migração/criptografia e testes de recuperação.
- A vibração foi comprovada por API simulada, **não por hardware Android/iOS real**. Alguns navegadores móveis, especialmente no iOS, não expõem `navigator.vibrate`.
- Áudio automático pode ser bloqueado até ocorrer interação do usuário. Mesmo que a API retorne êxito no teste, volume físico e permissões variam por dispositivo.
- Notificações funcionam **somente com o aplicativo aberto**, não em segundo plano com ele fechado.
- Alguns fluxos de integração legados que dependem de `jsdom`/`fake-indexeddb` não foram executados por ausência das dependências no ambiente. Portanto, gravação/reabertura do IndexedDB, criptografia do cofre e restauração real de backup devem ser confirmadas adicionalmente antes de uso com dados sensíveis.
- A abertura direta de arquivos `.html` em `file://` varia conforme permissões e recursos de navegador, especialmente Service Worker, instalação PWA e seleção de pastas. Testamos o código autônomo no Chromium, não em todos os navegadores e dispositivos físicos.

**Publicação:** nenhuma alteração enviada ao GitHub. Versão mantida em `9.0-beta`.
