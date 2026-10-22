# Portfólio Lucas Balica — Cloudflare Pages

Este subprojeto é um site estático e usa `dist/` como pasta de publicação.

Os arquivos são gerados da aplicação original em `app/` e `components/`, sem manter uma segunda implementação. Para atualizar, execute `node scripts/build-cloudflare.mjs` na raiz do repositório e envie o resultado para o GitHub.

## Configuração do Cloudflare Pages

- Repositório conectado: `lcbldcunha-lgtm/Sites-animados`
- Branch de produção: `main`
- Diretório raiz: `cloudflare-portfolio`
- Comando de build: deixar vazio
- Diretório de saída: `dist`

O Cloudflare Pages publicará novas versões automaticamente quando houver mudanças nesse diretório na branch `main`.
