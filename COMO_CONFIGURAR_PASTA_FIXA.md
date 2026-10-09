# Guia de Configuração: Pasta Local Fixa e Persistente no EvoluFísico

Este documento explica como funciona a persistência de pastas locais no **EvoluFísico v8.8** e como configurá-la para que a conexão seja permanente ou reativada com apenas um clique ao recarregar a página.

---

## 1. Como a persistência foi implementada no código

A API nativa do navegador utilizada para salvar arquivos no computador é a **File System Access API**. 

Originalmente, o aplicativo guardava a referência da pasta apenas na memória RAM (variável JavaScript). Toda vez que a página era recarregada, essa variável era limpa e o aplicativo "esquecia" a pasta selecionada.

### O que mudou:
- **Armazenamento no IndexedDB**: Agora, o identificador da pasta (`FileSystemDirectoryHandle`) é salvo de forma estruturada no banco de dados interno do navegador (`EvoluFisico_FS_DB`).
- **Restauração Automática na Inicialização**: Ao recarregar a página, o aplicativo consulta o banco interno, recupera a pasta memorizada e verifica se o navegador já concedeu permissão persistente de leitura/escrita.
- **Botão Inteligente de Status**:
  - 🟢 **Bolinha Verde (`📁 NomeDaPasta`)**: Acesso ativo e sincronizado. Novas avaliações são salvas na pasta do computador automaticamente.
  - 🟡 **Bolinha Âmbar (`📁 Reconectar: NomeDaPasta`)**: A pasta já está memorizada! Você **não precisa procurar a pasta novamente**. Basta dar **1 clique** no botão para reativar o acesso.

---

## 2. Por que o navegador solicita permissão ao recarregar?

Por motivos estritos de segurança do sistema operacional, os navegadores modernos (Google Chrome, Microsoft Edge, Opera, Brave) impedem que páginas web tenham acesso irrestrito de escrita no disco rígido sem consentimento explícito do usuário, evitando que sites maliciosos modifiquem arquivos em segundo plano.

---

## 3. Como deixar a pasta 100% automática sem pedir confirmação

Existem duas maneiras oficiais e seguras de permitir que o navegador mantenha a pasta conectada sem solicitar permissão toda vez que recarregar:

### Método A: Instalar o EvoluFísico como Aplicativo (PWA) — Recomendado
1. Abra o arquivo no Chrome ou Edge.
2. Na barra de endereços (lado direito), clique no ícone de **Instalar Aplicativo** (ou nos três pontinhos do navegador > **Instalar EvoluFísico**).
3. Uma vez instalado como app na sua área de trabalho/sistema, o Chrome trata o aplicativo com privilégios de desktop e mantém as permissões da pasta salvas entre aberturas e reinicializações.

### Método B: Conceder Permissão Permanente nas Configurações do Navegador
1. No Chrome ou Edge, clique no ícone de **controles do site** (ícone de cadeado / ajustes à esquerda da URL na barra de endereços).
2. Clique em **Configurações do site** (*Site settings*).
3. Procure a opção **Edição de arquivos** (*File editing* ou *Acesso ao sistema de arquivos*).
4. Altere de *Perguntar (padrão)* para **Permitir**.
5. Recarregue a página: agora a pasta se conectará automaticamente toda vez que você abrir o app, sem nenhum aviso.

---

## 4. Gerenciamento da Pasta Vinculada

Ao clicar no botão da pasta quando ela já estiver conectada, o app exibirá um menu interativo com opções para:
1. **Sincronizar arquivos agora**: Atualizar e ler novas avaliações da pasta imediatamente.
2. **Trocar de pasta**: Escolher uma pasta diferente no computador.
3. **Desconectar**: Remover a pasta e voltar a operar apenas no banco interno.
