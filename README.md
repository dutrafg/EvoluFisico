# EvoluFísico v8.9 Estável — Clinical Suite

Aplicativo web progressivo (PWA) de alta performance para **Avaliação Física & Bioimpedância**, composição corporal, antropometria completa (protocolo Pollock 7 Dobras), laudos clínicos comparativos, registro fotográfico e gestão financeira/cobrança.

---

## 🚀 Como Publicar no Vercel

O projeto já está configurado com `vercel.json`, `sw.js` e `manifest.webmanifest`. Você pode colocá-lo no ar em menos de 1 minuto:

### Opção 1: Vercel CLI (Linha de Comando)
1. Extraia o conteúdo deste arquivo `.zip` em uma pasta no seu computador.
2. Abra o terminal nessa pasta.
3. Se ainda não tiver a CLI do Vercel instalada:
   ```bash
   npm i -g vercel
   ```
4. Execute o comando de publicação:
   ```bash
   vercel --prod
   ```
5. Pronto! O Vercel fornecerá o link HTTPS público e seguro (ex: `https://seu-evolufisico.vercel.app`).

### Opção 2: Pelo Painel Web da Vercel (com GitHub/GitLab)
1. Crie um novo repositório no seu GitHub (público ou privado).
2. Suba todos os arquivos desta pasta para o repositório.
3. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
4. Selecione o seu repositório.
5. O Vercel detectará automaticamente como um projeto estático (`Other` / `None`).
6. Clique em **Deploy**.

---

## 📦 Estrutura dos Arquivos do Pacote

* **`index.html`**: Ponto de entrada principal do aplicativo web com todos os módulos, estilos e scripts embutidos.
* **`evolufisico.html`**: Cópia idêntica e independente para uso local direto no navegador (duplo-clique).
* **`sw.js`**: Service Worker inteligente configurado com estratégia *Network-First* e cache offline via Cache Storage API.
* **`manifest.webmanifest`**: Manifesto PWA que permite instalar o aplicativo na tela inicial do celular (Android/iOS) ou no computador (Windows/macOS).
* **`vercel.json`**: Configurações de rotas limpas e cabeçalhos de controle de cache para o Service Worker e manifesto.
* **`favicon.svg`**, **`icon-192.png`**, **`icon-512.png`**: Ícones de alta resolução e adaptáveis para instalação PWA.
* **`COMO_CONFIGURAR_PASTA_FIXA.md`**: Guia passo a passo para manter a pasta do computador conectada sem reconfirmações.
* **`CORRECOES_MODO_ESCURO.md`**: Detalhamento técnico dos contrastes e modais escuros ajustados.

---

## ✨ Recursos da Versão 8.9 Estável

1. **Título Padronizado**: Cabeçalho principal unificado como **Avaliação Física & Bioimpedância**.
2. **PWA & Offline Completo**: Funciona 100% sem internet após o primeiro acesso graças ao cache automático.
3. **Persistência de Pasta Local**: O identificador da pasta selecionada pelo usuário é salvo no IndexedDB (`EvoluFisico_FS_DB`), permitindo reconexão imediata com 1 clique ao recarregar.
4. **Modo Escuro Imersivo**: Modais de Backup, Dados do Profissional/CREF, Cofre de Segurança e Visualização com contraste e legibilidade ajustados.
5. **Zero Dependências Externas**: Todas as bibliotecas de gráficos, PDFs e ícones são embutidas, garantindo privacidade e velocidade máxima.
