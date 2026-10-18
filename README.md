# EvoluFísico 9.0-beta — versão para teste

Correções locais sobre o commit `c99668a8ac9849a383fef151a58924c105af4bb6` do repositório dutrafg/EvoluFisico. Versão 9.0-beta preparada para atualização do repositório.

## Testar

- Abra `evolufisico.html` para experimentar o aplicativo em arquivo único. Recursos de instalação PWA dependem de HTTPS ou localhost.
- Para testar a SPA completa, execute `python3 -m http.server 8080` na pasta do projeto e abra `http://localhost:8080`.
- Em Android, o modo como o gerenciador de arquivos abre um HTML pode limitar o armazenamento e recursos do navegador. Se aparecer o alerta de armazenamento temporário, exporte o backup antes de fechar.
- Exporte um backup da versão anterior antes de testar a migração com seus próprios dados. Dados de outro domínio ou navegador não são transferidos automaticamente.

## Interface simplificada

- Quatro áreas principais: Início, Avaliações, Evolução e Cobranças.
- Nova avaliação sempre acessível no cabeçalho.
- Ferramentas (Mais no celular) reúne calculadoras, diagnóstico, tema, cofre, profissional, pasta local, backup e importação.
- Resultados em tempo real, análises avançadas, bioimpedância e dados profissionais em seções expansíveis. Os campos e controles anteriores foram preservados.
- Formulário em cinco etapas, com navegação que mantém o rascunho.
- Layout adaptado a telas estreitas e ao modo escuro.

## Correções

- Gravação de avaliações aguarda a conclusão do armazenamento. Falhas não são confirmadas como sucesso e não alteram o histórico em memória.
- Exclusões, migração e importação também aguardam a persistência. A migração de uma cópia antiga não sobrescreve registros já existentes no IndexedDB.
- Clientes recebem um `cliente_id` permanente. Editar o nome preserva o vínculo. O formulário permite selecionar um cliente existente ou criar outro, inclusive com nome igual.
- Na migração, contatos iguais permitem relacionar avaliações. Registros antigos sem contato não são unidos automaticamente só pelo nome: utilize o seletor no formulário ao editar para vincular as avaliações corretas.
- Massa muscular esquelética da BIA e massa magra de Pollock ficam separadas. A ausência de massa magra não é preenchida pelo valor muscular da BIA.
- Cobranças usam o cofre quando a proteção por senha está ativa; troca e remoção de senha preservam o financeiro.
- Backups completos e leves incluem o financeiro, com checksum próprio. Backups individuais não incluem o financeiro geral. Backups antigos sem financeiro continuam aceitos.
- Restauração oferece desfazer com avaliações e financeiro. Uma importação só começa se conseguir criar um ponto de restauração completo; não reduz as fotos silenciosamente.
- Armazenamento em memória apresenta alerta visível e acesso à exportação.
- O cache offline abrange os arquivos do app, preserva caches de outras aplicações e recusa instalação incompleta. Uma versão instalada serve seu HTML e seus recursos juntos. A atualização exige ação no botão “Atualizar agora”.
- Histórico apresenta uma única ação de PDF por cartão.

## Organização

`src/app.template.html`, `assets/js/` e `assets/css/` são as fontes. `index.html` (SPA) e `evolufisico.html` (autônomo) são gerados da mesma fonte. Não edite os HTMLs gerados diretamente.

Execute `python3 tools/build.py` após editar as fontes. A geração também atualiza o pré-cache e a identificação do build.

A separação conserva a ordem dos scripts legados para reduzir regressões. Não é uma migração completa para ES modules ou um framework novo.

## Verificação

Node.js 24+ e Python 3 são necessários para desenvolvimento. Instale dependências com `npm install` e execute `npm test`. As dependências são usadas nos testes; a aplicação não precisa de Node para funcionar.

Consulte `QA.md` para resultados e limites da verificação.

Teste opcional em navegador real: instale Playwright separadamente e execute `node tests/browser-ui.cjs`. Se necessário, defina `EF_CHROMIUM_PATH` com o caminho do Chromium.

Abra `evolufisico.html` para testar o arquivo único. A correção de Cobranças agora pertence ao CSS base e funciona independentemente da interface simplificada.
