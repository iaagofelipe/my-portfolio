# Redesign do portfólio — 2026-11-01

**Status:** aprovado em conversa (direção "Planta de sistemas", escopo Profissional).
**Alvo:** `iaagofelipe/my-portfolio`, publicado em `https://iaagofelipe.github.io/my-portfolio/`.

## Problema

O site atual é uma página única de 13 KB que não sustenta a posição profissional
do dono:

1. **Não existe seção de projetos.** O ativo mais forte — trabalho real, com
   testes e CI — não aparece.
2. **O GitHub linkado está errado.** `github.com/iaagosilva` responde 404. A
   conta correta é `iaagofelipe`.
3. **Posicionamento divergente.** O site vende "Full Stack"; o LinkedIn, o
   resumo e o cargo atual dizem sênior em Java/backend, AWS e microsserviços.
4. **A página desaparece sem JS.** `.reveal { opacity: 0 }` sem fallback e sem
   `prefers-reduced-motion`.
5. **Zero metadado de compartilhamento.** Sem `og:image`, favicon ou JSON-LD:
   postar no LinkedIn rende um card vazio.
6. **Duas CDNs externas** (Google Fonts e Font Awesome inteiro) para desenhar
   seis ícones.
7. **Estética de template**: vidro, orbs, texto em gradiente — igual a todo
   portfólio de dev de 2024–2026.

## Objetivo

Um portfólio que funcione como **prancha técnica**: mostra o que foi construído,
qual decisão sustenta cada escolha e onde o trabalho se limita. O visitante
deve, em 10 segundos, saber que é backend Java sênior com experiência em AWS e
arquitetura distribuída; em 60 segundos, ver prova disso.

**Público:** recrutador técnico, tech lead e gerente de engenharia, em geral
chegando do LinkedIn, com pressa, metade no celular.

## Mundo visual — "Planta de sistemas"

Substitui o mundo anterior; não é refinamento dele.

| Token | Valor | Uso |
|---|---|---|
| ink | `#0A0A0B` | fundo |
| sheet | `#101012` | superfície de figura |
| rule | `rgba(244,242,236,0.11)` | fio de 1px |
| rule-strong | `rgba(244,242,236,0.26)` | fio de contorno |
| text | `#F4F2EC` | texto principal |
| text-2 | `#BDBAB2` | corpo secundário |
| text-3 | `#8F8C84` | rótulo mono |
| copper | `#E0983F` | único acento: caminho crítico, ação, medição |
| mint | `#6FCF97` | apenas o indicador de disponibilidade |

- **Tipografia:** Archivo (400/500/600) para voz; Spline Sans Mono (400/500)
  só para dado, medida, nome de serviço e rótulo de aresta. Ambas self-hosted,
  woff2, sem requisição externa.
- **Forma:** raio 3px, fios de 1px, sem sombra, sem blur decorativo, sem
  gradiente em texto.
- **Proibido** (piso de craft): kicker/eyebrow acima de título, número de seção
  sem função, cartões de ícone+título+texto como estrutura, mono como figurino,
  ícone em unicode, halo colorido sem offset.
- **Assinatura:** bloco de título no rodapé, como prancha de engenharia.

## Arquitetura de conteúdo

1. **Hero** — `h1` com a tese ("Backend Java para o caminho crítico."), um
   parágrafo com trajetória em números verificáveis, dois CTAs, status de
   disponibilidade. À direita, a **planta do Slinks** em SVG (figura principal):
   visitante → API → 302/destino, click_event → Postgres, SPA → BFF → API, com
   o caminho crítico em cobre e três notas de decisão.
2. **Projetos** — quatro fichas. Cada uma: nome, posicionamento em uma linha,
   **a decisão** (1 frase), coluna de dados em mono (testes, camadas, CI,
   banco), links. `slinks` abre com destaque e figuras reais.
3. **Decisões** — quatro princípios de engenharia, cada um ancorado num caso
   real do Slinks. É a seção que separa "sei Java" de "eu decido arquitetura".
4. **Trajetória** — tabela densa por empresa, uma linha de impacto cada.
5. **Stack** — matriz por domínio de confiança, sem barras de proficiência.
6. **Formação** — pós em Engenharia de Software (2025) primeiro; certificações
   agrupadas como formação continuada.
7. **Contato** — e-mail, LinkedIn, GitHub correto, CV.
8. **Case study `/projetos/slinks/`** — problema, restrições, planta, cinco
   decisões com trade-off, estratégia de teste, o que ficou de fora, o que faria
   diferente. Figuras com legenda.

## Fatos verificados (fonte)

Nenhuma métrica inventada. Tudo abaixo sai de contagem no código ou de fonte
primária:

- **Slinks:** 54 arquivos Java de produção (~2.400 linhas), 27 arquivos de
  teste, 133 `@Test`; 46 casos no BFF; 30 na SPA — **209 casos**. CI com
  `git diff --exit-code` em `api/openapi.json` e em `bff/src/java`. Java 21,
  Spring Boot, Postgres 17, Flyway, Testcontainers, Fastify 5, React 19.
- **Card Expense Tracker:** 343 arquivos, 37 arquivos de teste, 2 workflows
  (`ci.yml`, `health-monitor.yml`), em produção em `app.cxtrker.lat`
  (verificado 200), React 19 + Vite + Tailwind, Express 5 + Prisma 7 +
  Postgres, app Flutter.
- **E-commerce Platform:** Next.js 14 App Router, TypeScript, Tailwind v4,
  TanStack Query, Zod, Zustand; backend Spring Boot 3 com SQS FIFO e
  transactional outbox; Jest + RTL.
- **PDF Editor:** Python 3.13, PyMuPDF 1.28, Tkinter; 9 arquivos. Sem teste e
  sem CI — apresentado como ferramenta, não como prova de escala.
- **Carreira:** 6 anos (out/2020 → nov/2026), 5 empresas.
- Ficam **fora** `subtracks`, `surf-forecast` e `ecommerce-queue`: sem README e
  sem teste.

## Técnica

- **Zero build.** HTML, CSS e JS puros; deploy continua sendo a raiz da `main`
  no GitHub Pages. Nenhuma dependência de terceiro em runtime.
- **Conteúdo visível sem JS.** A animação é um único momento autorado e só
  roda se `prefers-reduced-motion: no-preference`.
- **Superfícies do navegador** no tema: `::selection`, caret, scrollbar, foco.
- **Acessibilidade:** contraste AA (corpo ≥ 4,5:1), skip link, `aria-current`,
  landmarks, alvo de toque ≥ 44px, figura com `title` descritivo.
- **SEO/social:** `og:*` e `twitter:*`, `og-image.png` 1200×630 gerado por
  headless, favicon SVG, JSON-LD `Person`, `sitemap.xml`, `robots.txt`.
- **CV:** `curriculo.html` em A4 com folha de impressão; PDF gerado por headless
  e versionado no repo.
- **CI:** workflow que valida HTML e não deixa link quebrado entrar.

## Critérios de aceite

1. Nenhuma requisição a domínio de terceiro.
2. Página legível e navegável com JS desabilitado.
3. Nenhum texto abaixo de 4,5:1 de contraste.
4. Sem rolagem horizontal em 390px, 768px, 1024px e 1440px.
5. Todos os links externos resolvem (200) — inclusive o GitHub.
6. `og:image`, `og:title` e `og:url` presentes e corretos.
7. Transferência total < 200 KB; nenhuma imagem acima de 200 KB.
8. Case study do Slinks abre em < 1 s local.

## Fora de escopo

Versão em inglês, domínio próprio, blog, formulário de contato com backend,
currículo em outros idiomas, vídeos, dark/light toggle (a direção é escura por
definição).

## Riscos

- **Captura de tela do Card Expense Tracker:** o seed cria pessoas, cartões e
  categorias, não despesas. Rodar local tende a produzir telas vazias; inventar
  despesas colocaria número falso no portfólio. Decisão: usar logo, diagrama da
  regra de fechamento e dado verificado; captura só se houver dado real.
- **PDF do CV:** gerado por headless, então o texto precisa continuar
  selecionável e a página precisa caber inteira em A4 a 1 página.
