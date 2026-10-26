/*
 * Site RIFU : réglages en tête de fichier, lien de téléchargement de la dernière version,
 * puis les animations de la page d'accueil (apparitions, démo de draft).
 * Les liens laissés vides ('') sont simplement masqués.
 */
const RIFU_SITE = {
  /** Dépôt GitHub qui publie les installeurs (même source que les mises à jour automatiques). */
  releasesRepo: 'Rifutajine/rifu-releases',
  /** Invitation Discord publique (« https://discord.gg/… »), pour demander un code bêta et donner son avis. */
  discordUrl: 'https://discord.gg/CGRcbW4SVw',
  /** Adresse de contact affichée sur le site et dans la politique de confidentialité. */
  contactEmail: 'rifutajine@gmail.com',
};

const releasesPage = `https://github.com/${RIFU_SITE.releasesRepo}/releases`;

/** Textes écrits par le script, selon la langue de la page (français par défaut, anglais pour /en/). */
const TEXTS = {
  fr: {
    locale: 'fr-FR',
    megabytes: 'Mo',
    version: 'Version',
    notes: 'Notes de version',
    fallbackMeta: 'Windows 10 et 11 · installeur sur la page des versions',
    gaps: ['Il vous manque des dégâts magiques', 'Frontline faible'],
    draftStart: 'La draft commence…',
    yourTurn: 'À vous : trois options pour votre compo',
    allyPicks: 'Votre équipe choisit…',
    enemyPicks: "L'adversaire choisit…",
    zoomLabel: 'Capture agrandie',
    close: 'Fermer',
    zoomHint: ' · Cliquez sur l’image pour la voir en taille réelle.',
  },
  en: {
    locale: 'en-GB',
    megabytes: 'MB',
    version: 'Version',
    notes: 'Release notes',
    fallbackMeta: 'Windows 10 and 11 · installer on the releases page',
    gaps: ['You lack magic damage', 'Weak frontline'],
    draftStart: 'Draft starting…',
    yourTurn: 'Your turn: three options for your comp',
    allyPicks: 'Your team is picking…',
    enemyPicks: 'The enemy is picking…',
    zoomLabel: 'Enlarged screenshot',
    close: 'Close',
    zoomHint: ' · Click the image to see it at full size.',
  },
};
const T = document.documentElement.lang.startsWith('en') ? TEXTS.en : TEXTS.fr;

/** Dernière version publiée (pré-versions comprises : la bêta est publiée en pré-version). */
async function latestRelease() {
  const res = await fetch(`https://api.github.com/repos/${RIFU_SITE.releasesRepo}/releases?per_page=10`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const releases = await res.json();
  for (const release of releases) {
    if (release.draft) continue;
    const exe = (release.assets || []).find((a) => /^RIFU-Setup-.*\.exe$/i.test(a.name));
    if (exe) return { version: release.tag_name.replace(/^v/, ''), date: release.published_at, url: exe.browser_download_url, size: exe.size, page: release.html_url };
  }
  throw new Error('Aucun installeur publié');
}

const formatDate = (iso) => new Date(iso).toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric' });
const formatSize = (bytes) => `${Math.round(bytes / 1e6)} ${T.megabytes}`;

async function wireDownloads() {
  const buttons = document.querySelectorAll('[data-download]');
  const metas = document.querySelectorAll('[data-download-meta]');
  if (!buttons.length) return;
  try {
    const r = await latestRelease();
    buttons.forEach((b) => { b.href = r.url; b.setAttribute('download', ''); });
    metas.forEach((m) => {
      m.textContent = `${T.version} ${r.version} · ${formatDate(r.date)} · ${formatSize(r.size)} · `;
      const notes = document.createElement('a');
      notes.href = r.page;
      notes.textContent = T.notes;
      m.append(notes);
    });
  } catch {
    // Quota de l'API GitHub atteint ou réseau coupé : on renvoie vers la page des versions.
    buttons.forEach((b) => { b.href = releasesPage; });
    metas.forEach((m) => { m.textContent = T.fallbackMeta; });
  }
}

function wireContacts() {
  document.querySelectorAll('[data-discord]').forEach((el) => {
    if (RIFU_SITE.discordUrl) el.href = RIFU_SITE.discordUrl;
    else el.hidden = true;
  });
  document.querySelectorAll('[data-contact]').forEach((el) => {
    if (!RIFU_SITE.contactEmail) { el.hidden = true; return; }
    const a = el.tagName === 'A' ? el : el.querySelector('a');
    if (a) { a.href = `mailto:${RIFU_SITE.contactEmail}`; a.textContent = RIFU_SITE.contactEmail; }
  });
  // Texte de repli quand aucun contact n'est configuré.
  document.querySelectorAll('[data-contact-fallback]').forEach((el) => {
    el.hidden = Boolean(RIFU_SITE.contactEmail || RIFU_SITE.discordUrl);
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** En-tête opaque dès qu'on quitte le haut de la page. */
function wireHeader() {
  const top = document.querySelector('.top');
  if (!top) return;
  const update = () => top.classList.toggle('is-scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/** Apparition des blocs au défilement, en léger décalé pour les voisins. */
function wireReveal() {
  const items = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window) || reducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/** Lumière des tuiles qui suit la souris, et légère inclinaison du visuel du héros. */
function wirePointer() {
  if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('pointermove', (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
  const scene = document.querySelector('.scene');
  const inner = scene?.querySelector('[data-tilt]');
  if (!scene || !inner) return;
  scene.addEventListener('pointermove', (e) => {
    if (window.innerWidth <= 960) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${-14 + x * 10}deg) rotateX(${6 - y * 8}deg)`;
  });
  scene.addEventListener('pointerleave', () => { inner.style.transform = ''; });
}

/*
 * Démo de draft : les picks tombent un par un, les barres de compo se remplissent,
 * puis RIFU signale les manques et propose trois options. Scénario illustratif.
 */
const DEMO_PICKS = [
  { side: 'ally', i: 0, axes: { frontline: 2, engage: 1, peel: 0, cc: 1 }, ad: 1 },
  { side: 'enemy', i: 0 },
  { side: 'enemy', i: 1 },
  { side: 'ally', i: 1, axes: { frontline: 1, engage: 3, peel: 1, cc: 2 }, ad: 1 },
  { side: 'ally', i: 2, axes: { frontline: 0, engage: 0, peel: 0, cc: 1 }, ad: 1 },
  { side: 'enemy', i: 2 },
  { side: 'enemy', i: 3 },
  { side: 'ally', i: 3, axes: { frontline: 1, engage: 3, peel: 4, cc: 3 }, ad: 0.3 },
  { side: 'enemy', i: 4 },
];
const LOW = 5;

function wireDemo() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;
  const q = (s) => demo.querySelector(s);
  const qa = (s) => [...demo.querySelectorAll(s)];
  const timer = q('[data-timer]');
  const phase = q('[data-phase]');
  const gaps = q('[data-gaps]');
  const options = qa('[data-option]');
  const bars = Object.fromEntries(qa('[data-axis]').map((b) => [b.dataset.axis, b]));
  const ad = q('[data-dmg] .ad');
  const adOut = q('[data-dmg-out]');
  let timeouts = [];

  const later = (ms, fn) => timeouts.push(setTimeout(fn, ms));
  const slot = (p) => q(`[data-${p.side}="${p.i}"]`);

  function setAxes(totals, adShare, markLow) {
    for (const [axis, bar] of Object.entries(bars)) {
      const v = totals[axis] || 0;
      bar.querySelector('i').style.width = `${v * 10}%`;
      bar.nextElementSibling.textContent = String(v);
      bar.classList.toggle('is-low', markLow && v < LOW);
    }
    ad.style.width = adShare === null ? '50%' : `${Math.round(adShare * 100)}%`;
    adOut.textContent = adShare === null ? '—' : `${Math.round(adShare * 100)} % AD`;
  }

  function reset() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    qa('.slot[data-ally], .slot[data-enemy]').forEach((s) => {
      s.classList.remove('is-picked');
      s.querySelector('[data-name]').textContent = '…';
    });
    options.forEach((o) => o.classList.remove('is-in'));
    gaps.replaceChildren();
    setAxes({}, null, false);
    timer.textContent = '30';
    phase.textContent = T.draftStart;
  }

  function finish(totals, adShare) {
    setAxes(totals, adShare, true);
    timer.textContent = '22';
    phase.textContent = T.yourTurn;
    gaps.replaceChildren(...T.gaps.map((t) => Object.assign(document.createElement('span'), { className: 'gap-chip', textContent: t })));
  }

  function play() {
    reset();
    const totals = {};
    let adSum = 0;
    let allies = 0;
    const step = reducedMotion ? 0 : 650;
    DEMO_PICKS.forEach((p, n) => {
      const run = () => {
        const s = slot(p);
        s.classList.add('is-picked');
        const name = s.querySelector('[data-name]');
        name.textContent = name.dataset.name;
        if (p.axes) {
          for (const [k, v] of Object.entries(p.axes)) totals[k] = (totals[k] || 0) + v;
          adSum += p.ad;
          allies += 1;
        }
        setAxes(totals, allies ? adSum / allies : null, false);
        timer.textContent = String(30 - Math.round((n + 1) * 0.9));
        phase.textContent = p.side === 'ally' ? T.allyPicks : T.enemyPicks;
      };
      if (step) later(400 + n * step, run); else run();
    });
    const end = () => {
      finish(totals, adSum / allies);
      options.forEach((o, i) => (step ? later(250 + i * 180, () => o.classList.add('is-in')) : o.classList.add('is-in')));
    };
    if (step) later(400 + DEMO_PICKS.length * step + 300, end); else end();
  }

  q('[data-replay]')?.addEventListener('click', play);
  if (!('IntersectionObserver' in window)) { play(); return; }
  reset();
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    play();
  }, { threshold: 0.15 });
  io.observe(demo);
}

/**
 * Captures agrandies au clic, en pleine résolution. Un clic sur l'image l'affiche à sa taille réelle
 * (défilement pour la parcourir), un autre la remet à la taille de l'écran. Sans script, le lien ouvre l'image.
 */
function wireLightbox() {
  const links = document.querySelectorAll('a.zoom');
  if (!links.length || typeof HTMLDialogElement !== 'function') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', T.zoomLabel);
  dialog.innerHTML = `<div class="lightbox-stage"><img alt=""></div><p class="lightbox-bar"></p><button class="lightbox-close" type="button" aria-label="${T.close}">×</button>`;
  document.body.append(dialog);
  const img = dialog.querySelector('img');
  const bar = dialog.querySelector('.lightbox-bar');
  const close = () => dialog.close();
  dialog.querySelector('.lightbox-close').addEventListener('click', close);
  dialog.querySelector('.lightbox-stage').addEventListener('click', (e) => { if (e.target !== img) close(); });
  dialog.addEventListener('close', () => { dialog.classList.remove('is-full'); document.documentElement.style.overflow = ''; });
  img.addEventListener('click', () => {
    const full = dialog.classList.toggle('is-full');
    // Taille réelle : la capture est en 2×, on l'affiche à sa taille en pixels CSS.
    img.style.width = full ? `${img.naturalWidth / 2}px` : '';
  });
  links.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const thumb = a.querySelector('img');
    img.src = a.href;
    img.alt = thumb?.alt ?? '';
    img.style.width = '';
    bar.textContent = thumb?.alt ?? '';
    const hint = document.createElement('span');
    hint.textContent = T.zoomHint;
    bar.append(hint);
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
  }));
}

wireContacts();
wireLightbox();
wireHeader();
wireReveal();
wirePointer();
wireDemo();
void wireDownloads();
