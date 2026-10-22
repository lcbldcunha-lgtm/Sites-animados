# Meu portfólio — Lucas Balica

Portfólio de fotografia em Next.js, TypeScript, Tailwind CSS, GSAP e Lenis.

Repositório: [lcbldcunha-lgtm/Sites-animados](https://github.com/lcbldcunha-lgtm/Sites-animados).

## Publicação atual

O site está hospedado em [Cloudflare Pages](https://lucas-balica-fotografia.pages.dev/), com integração ao GitHub. Execute `node scripts/build-cloudflare.mjs` para atualizar `cloudflare-portfolio/dist` e envie as alterações para `main`. A configuração do Cloudflare está documentada em `cloudflare-portfolio/README.md`.

O workflow legado `.github/workflows/deploy-pages.yml` não roda em envios ao repositório nem por agendamento. Ele foi mantido apenas para execução manual, caso uma publicação no GitHub Pages seja necessária no futuro. A publicação automática atual é feita pelo Cloudflare.

## Desenvolvimento

Requer Node.js >= 20.9 e pnpm. Na pasta do projeto:

```sh
pnpm install
pnpm dev
```

Abra o endereço local informado pelo terminal. Para verificar a versão de produção:

```sh
pnpm build
pnpm start
```

## Fotografias

`data/photos.json` contém títulos editoriais provisórios, categorias e textos alternativos. As cópias otimizadas ficam em `public/photos`. Os originais permanecem na pasta Fotos, fora do projeto. Nenhum dado EXIF dos originais é incluído nas cópias WebP.

O script `scripts/prepare_photos.py` recria as cópias com Python e Pillow, a partir da pasta irmã `Fotos/Fotos para portfólio`.

Ele sincroniza todas as imagens da pasta, remove apenas cópias web que ficaram obsoletas e gera nomes por conteúdo para evitar cache de fotos antigas. Os originais são preservados. O campo `source` no catálogo identifica o arquivo de origem. Novas fotos sem descrição editorial recebem um título provisório para revisão.

Na abertura, somente Lucas Balica, Meu portfólio e Infinitas maneiras de sentir digitam, pausam nove segundos e apagam em ciclos automáticos. Os demais textos da abertura são estáticos. A faixa preta do topo mantém somente o movimento original. Os textos da galeria, legendas, filtros, apresentação e rodapé usam digitação vinculada à rolagem: aparecem letra a letra ao descer e apagam na ordem inversa ao subir. No visualizador, a digitação ocorre uma vez ao abrir ou trocar o texto, já que a rolagem da página fica bloqueada. As frases decorativas do fundo preservam seus ciclos automáticos. O espaço dos textos e os nomes acessíveis dos botões são preservados; a preferência por movimento reduzido exibe os textos completos.

## Primeira versão

A direção visual foi atualizada a partir da referência fornecida e personalizada com amarelo dourado como cor principal, laranja como apoio, fundo creme, títulos condensados, colagem com fotografias próprias, faixa animada com botão de pausa e links com texto deslizante. O HTML de referência fica fora da aplicação e não integra o material publicado.

- Abertura, galeria com filtros e seção sobre Lucas Balica.
- Visualizador com modal nativo, foco, Escape e setas de navegação.
- Animações respeitam a preferência por movimento reduzido.
- Fontes do sistema para desenvolvimento independente de downloads de fontes.
- Contatos e redes sociais aguardam os dados reais do fotógrafo.
- Código e fotos otimizadas versionados no GitHub; publicação atual pelo Cloudflare Pages.

Antes de publicar, revisar fotos, títulos, apresentação e contatos. Não foram inventados clientes, depoimentos ou dados de contato.
