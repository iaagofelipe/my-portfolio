// Único comportamento do site: marcar a seção visível no menu.
// Nada aqui é necessário para ler ou navegar — o conteúdo é HTML estático.
(() => {
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const sections = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  let current = null;

  const mark = (id) => {
    if (id === current) return;
    current = id;
    links.forEach((a) => a.removeAttribute('aria-current'));
    const link = byId.get(id);
    if (link) link.setAttribute('aria-current', 'true');
  };

  const visible = new Map();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      });

      if (!visible.size) {
        mark(null);
        return;
      }

      let best = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      });
      if (best) mark(best);
    },
    { rootMargin: '-20% 0px -35% 0px', threshold: [0, 0.15, 0.35, 0.6, 1] }
  );

  sections.forEach((section) => io.observe(section));
})();
