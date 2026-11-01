// Verifica links internos e externos sem dependência nenhuma.
// Interno: o arquivo precisa existir no repositório.
// Externo: 2xx/3xx passa; 404/5xx falha; 403/429/999 avisa e não derruba
// (LinkedIn e alguns CDNs bloqueiam requisição automatizada por definição).
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(process.cwd());
const PAGES = ["index.html", "curriculo.html", "projetos/slinks/index.html"];

const OWN_HOST = "iaagofelipe.github.io";

const TOLERATED_HOSTS = [
  "linkedin.com",
  "www.linkedin.com",
  "twitter.com",
  "x.com",
  "instagram.com",
];

const findings = [];
let checked = 0;

function attrValues(html, attr) {
  const out = [];
  const re = new RegExp(`${attr}\\s*=\\s*"([^"]+)"`, "gi");
  let m;
  while ((m = re.exec(html))) out.push(m[1].trim());
  return out;
}

for (const page of PAGES) {
  if (!existsSync(join(ROOT, page))) {
    findings.push({ level: "fail", page, url: page, reason: "página não existe" });
    continue;
  }
  const html = await readFile(join(ROOT, page), "utf8");
  const base = dirname(join(ROOT, page));
  const urls = [...attrValues(html, "href"), ...attrValues(html, "src")];

  for (const url of urls) {
    if (!url || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) continue;
    checked++;

    if (url.startsWith("http://") || url.startsWith("https://")) {
      if (url.includes(OWN_HOST)) continue;
      const host = (() => {
        try {
          return new URL(url).host;
        } catch {
          return "";
        }
      })();
      let status = 0;
      let note = "";
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        let res = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: controller.signal,
          headers: { "user-agent": "Mozilla/5.0 (compatible; portfolio-link-check)" },
        });
        if (res.status === 405 || res.status === 403 || res.status === 501) {
          res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: { "user-agent": "Mozilla/5.0 (compatible; portfolio-link-check)" },
          });
        }
        clearTimeout(timer);
        status = res.status;
      } catch (error) {
        note = error.name === "AbortError" ? "tempo esgotado" : String(error.message ?? error);
      }

      const tolerated = TOLERATED_HOSTS.some((h) => host === h || host.endsWith("." + h));

      if (status >= 200 && status < 400) continue;
      if (tolerated || status === 403 || status === 429 || status === 999 || status === 0) {
        findings.push({
          level: "warn",
          page,
          url,
          reason: note || `status ${status} (host bloqueia bot ou instável)`,
        });
      } else {
        findings.push({ level: "fail", page, url, reason: note || `status ${status}` });
      }
      continue;
    }

    // interno
    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = clean.startsWith("/") ? join(ROOT, clean) : resolve(base, clean);
    try {
      await stat(target);
    } catch {
      findings.push({ level: "fail", page, url, reason: "arquivo local não encontrado" });
    }
  }
}

const fails = findings.filter((f) => f.level === "fail");
const warns = findings.filter((f) => f.level === "warn");

for (const w of warns) console.log(`aviso  ${w.page}  ${w.url}  — ${w.reason}`);
for (const f of fails) console.log(`ERRO   ${f.page}  ${f.url}  — ${f.reason}`);

console.log(`\n${checked} links verificados · ${fails.length} erro(s) · ${warns.length} aviso(s)`);
if (fails.length) process.exit(1);
