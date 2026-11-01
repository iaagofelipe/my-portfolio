# my-portfolio

Portfólio pessoal — HTML, CSS e JavaScript escritos à mão. Sem framework, sem build,
sem dependência de terceiro em runtime.

**No ar:** https://iaagofelipe.github.io/my-portfolio/

## Estrutura

```
.
├── index.html                     página principal
├── curriculo.html                 currículo em HTML (A4, com folha de impressão)
├── curriculo.pdf                  currículo em PDF, gerado a partir do HTML
├── og-image.png                   1200×630 para compartilhamento
├── favicon.svg
├── sitemap.xml · robots.txt · .nojekyll
├── projetos/
│   └── slinks/index.html          case study do Slinks
└── assets/
    ├── css/site.css               sistema visual inteiro
    ├── js/site.js                 única função: marcar a seção visível no menu
    ├── fonts/                     Archivo e Spline Sans Mono (OFL, variable, woff2)
    ├── img/                       capturas reais dos projetos
    └── og/og-source.html          fonte da imagem de compartilhamento
```

## Decisões de engenharia

**Zero build.** O GitHub Pages serve a raiz da `main`. Não existe etapa de compilação,
`node_modules` nem artefato intermediário — editar um arquivo e dar `push` é o deploy.

**Zero terceiros.** As duas fontes são self-hosted (woff2 variable, licença OFL em
`assets/fonts/`). Não há Google Fonts, CDN de ícones, analytics nem pixel. O site
funciona offline e não entrega o visitante a nenhum domínio externo.

**Conteúdo visível sem JavaScript.** Nenhum texto depende de JS para aparecer. O único
script marca `aria-current` na seção visível; se ele falhar, nada se perde.

**Um só momento de animação.** O caminho crítico da planta se desenha uma vez, via
`stroke-dashoffset` normalizado por `pathLength="1"`. Respeita `prefers-reduced-motion`.

**Mundo visual "planta de sistemas".** Tinta `#0A0A0B`, fio de 1px, cobre `#E0983F` como
único acento, mono só para dado e medida. Os tokens vivem no topo de
`assets/css/site.css`.

## Como atualizar

1. Edite o HTML ou o CSS.
2. Se mexer em fonte/token, verifique contraste e as larguras de 390px, 768px e 1440px.
3. Regenere o PDF do currículo e a imagem de compartilhamento:

```powershell
# PDF do currículo (Edge ou Chrome headless)
msedge --headless=new --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="curriculo.pdf" "file:///$PWD/curriculo.html"

# imagem de compartilhamento 1200×630
msedge --headless=new --disable-gpu --hide-scrollbars `
  --screenshot="og-image.png" --window-size=1200,630 `
  "file:///$PWD/assets/og/og-source.html"
```

## Verificação

O workflow em `.github/workflows/checks.yml` roda em cada push:

- `html-validate` nos três documentos HTML;
- checagem de links externos e internos;
- falha se o `curriculo.pdf` ou o `og-image.png` estiverem ausentes.

## Licença

O código (HTML/CSS/JS) é livre para consulta. O conteúdo — textos, currículo, capturas
de tela e a marca — é pessoal e não deve ser reutilizado. As fontes seguem a SIL Open
Font License, em `assets/fonts/`.
