# The Watcher - Security Report Extension

## Descrição
"The Watcher" é uma extensão de navegador para Firefox projetada para aumentar a segurança e a privacidade dos usuários ao navegar na web. Esta extensão detecta e relata várias métricas de segurança, incluindo solicitações a domínios de terceiros, uso de cookies, armazenamento local, riscos de sequestro de navegador (hijacking), e tentativas de fingerprint de canvas.

## Funcionalidades
- **Monitoramento de Solicitações de Terceiros**: Detecta e conta as solicitações feitas a domínios que não são da página principal.
- **Detecção de Cookies de Primeira e Terceira Parte**: Diferencia e conta cookies de primeira e terceira parte usados pelas páginas.
- **Uso de Armazenamento Local**: Monitora o uso de `localStorage` e `sessionStorage`.
- **Detecção de Riscos de Sequestro de Navegador**: Avalia se o navegador pode estar sob risco de hijacking, baseado em portas usadas nas solicitações.
- **Detecção de Fingerprint de Canvas**: Verifica se há tentativas de fingerprinting através do canvas HTML5.
- **Avaliação de Privacidade**: Calcula uma pontuação de privacidade baseada nas métricas coletadas para dar ao usuário uma visão rápida do nível de segurança de uma página.

## Instalação
Para instalar "The Watcher" no seu navegador Firefox, siga estes passos:

1. Clone ou baixe este repositório para o seu computador.
2. Abra o Firefox e digite `about:debugging` na barra de endereços.
3. Clique em "This Firefox" (ou "Este Firefox") na barra lateral esquerda.
4. Clique em "Load Temporary Add-on" (ou "Carregar Complemento Temporário") e selecione o arquivo `manifest.json` dentro da pasta do projeto clonado/baixado.
5. A extensão agora deve estar ativa em seu navegador.

## Uso
Após a instalação, a extensão funcionará automaticamente ao navegar. Você pode visualizar o relatório de segurança a qualquer momento clicando no ícone da extensão na barra de ferramentas do navegador. As informações serão apresentadas em um popup, onde você pode ver as métricas detalhadas para a página atual.
