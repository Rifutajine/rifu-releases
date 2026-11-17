/*
 * Site RIFU : réglages en tête de fichier, lien de téléchargement de la dernière version,
 * puis les animations de la page d'accueil (frise des quatre moments, démo de draft jouable).
 * Les liens laissés vides ('') sont simplement masqués.
 */
const RIFU_SITE = {
  /** Dépôt GitHub qui publie les installeurs (même source que les mises à jour automatiques). */
  releasesRepo: 'Rifutajine/rifu-releases',
  /** Invitation Discord publique (« https://discord.gg/… »), pour demander un code bêta et donner son avis. */
  discordUrl: 'https://discord.gg/CGRcbW4SVw',
  /** Adresse de contact affichée sur le site et dans la politique de confidentialité. */
  contactEmail: 'rifutajine@gmail.com',
  /**
   * Installeur de secours, servi quand l'API GitHub ne répond pas (quota, réseau) et que le navigateur
   * n'a aucune réponse en mémoire. Facultatif à mettre à jour : l'app se met à jour seule après l'installation.
   */
  fallback: {
    version: '0.3.0-beta.23',
    date: '2026-11-14T18:36:12Z',
    size: 107033320,
    url: 'https://github.com/Rifutajine/rifu-releases/releases/download/v0.3.0-beta.23/RIFU-Setup-0.3.0-beta.23.exe',
    page: 'https://github.com/Rifutajine/rifu-releases/releases/tag/v0.3.0-beta.23',
  },
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
    gaps: { ap: ['Il vous manque des dégâts magiques', 'Dégâts magiques : réglé'], front: ['Frontline faible', 'Frontline : réglée'] },
    draftStart: 'La draft commence…',
    yourTurn: 'À vous : trois options de votre pool',
    pickOne: 'Cliquez sur une option pour voir ce qu’elle change à la compo.',
    you: 'Vous',
    started: 'Le téléchargement démarre. Rien ne se passe ? Cliquez sur le bouton.',
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
    gaps: { ap: ['You lack magic damage', 'Magic damage: covered'], front: ['Weak frontline', 'Frontline: covered'] },
    draftStart: 'Draft starting…',
    yourTurn: 'Your turn: three options from your pool',
    pickOne: 'Click an option to see what it changes for the comp.',
    you: 'You',
    started: 'Your download is starting. Nothing happening? Click the button.',
    allyPicks: 'Your team is picking…',
    enemyPicks: 'The enemy is picking…',
    zoomLabel: 'Enlarged screenshot',
    close: 'Close',
    zoomHint: ' · Click the image to see it at full size.',
  },
};
const T = document.documentElement.lang.startsWith('en') ? TEXTS.en : TEXTS.fr;

/** Dernière version publiée (pré-versions comprises : la bêta est publiée en pré-version). */
async function fetchLatestRelease() {
  const res = await fetch(`https://api.github.com/repos/${RIFU_SITE.releasesRepo}/releases?per_page=10`, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const releases = await res.json();
  for (const release of releases) {
    if (release.draft) continue;
    const exe = (release.assets || []).find((a) => /^RIFU-Setup-.*\.exe$/i.test(a.name) && a.state !== 'starter');
    if (exe) return { version: release.tag_name.replace(/^v/, ''), date: release.published_at, url: exe.browser_download_url, size: exe.size, page: release.html_url };
  }
  throw new Error('Aucun installeur publié');
}

/*
 * L'API GitHub sans compte est limitée à 60 appels par heure et par adresse IP (box partagée, 4G,
 * plusieurs onglets…). Au-delà, le bouton retombait sur la page des versions au lieu de lancer le
 * téléchargement. On garde donc la dernière réponse valide dans le navigateur et on la réutilise
 * si l'API refuse, et on retente une fois après une courte pause.
 */
const CACHE_KEY = 'rifu-latest-release';
const readCache = () => {
  try {
    const r = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    return r && typeof r.url === 'string' && r.url.startsWith('https://github.com/') ? r : null;
  } catch { return null; }
};
const writeCache = (r) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(r)); } catch { /* stockage bloqué */ } };

async function latestRelease() {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetchLatestRelease();
      writeCache(r);
      return r;
    } catch (err) {
      if (attempt === 0) await new Promise((ok) => setTimeout(ok, 1500));
      else {
        const cached = readCache();
        if (cached) return cached;
        if (RIFU_SITE.fallback?.url) return RIFU_SITE.fallback;
        throw err;
      }
    }
  }
  throw new Error('inaccessible');
}

const formatDate = (iso) => new Date(iso).toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric' });
const formatSize = (bytes) => `${Math.round(bytes / 1e6)} ${T.megabytes}`;

/*
 * Téléchargement. Les boutons de l'accueil mènent à la page de téléchargement avec « ?dl=1 » : elle lance
 * l'installeur toute seule et affiche les étapes d'installation. Sur cette page, le bouton pointe droit
 * sur l'installeur de la dernière version. Sans script, le bouton mène à la page des versions de GitHub.
 */
async function wireDownloads() {
  const buttons = document.querySelectorAll('[data-download]');
  const metas = document.querySelectorAll('[data-download-meta]');
  const versions = document.querySelectorAll('[data-version]');
  const status = document.querySelector('[data-download-status]');
  if (!buttons.length && !metas.length && !versions.length) return;
  const release = latestRelease();
  release.catch(() => {});
  // Un clic avant la réponse de GitHub : on attend la réponse plutôt que de suivre l'adresse de secours.
  buttons.forEach((b) => b.addEventListener('click', async (e) => {
    if (b.href.endsWith('.exe') || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    try { window.location.assign((await release).url); } catch { window.location.assign(releasesPage); }
  }));
  const auto = buttons.length > 0 && new URLSearchParams(window.location.search).get('dl') === '1';
  if (auto) window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  try {
    const r = await release;
    buttons.forEach((b) => { b.href = r.url; b.setAttribute('download', ''); });
    versions.forEach((v) => { v.textContent = r.version; });
    metas.forEach((m) => {
      m.textContent = `${T.version} ${r.version} · ${formatDate(r.date)} · ${formatSize(r.size)} · `;
      const notes = document.createElement('a');
      notes.href = r.page;
      notes.textContent = T.notes;
      m.append(notes);
    });
    if (auto) {
      if (status) { status.textContent = T.started; status.hidden = false; }
      window.location.assign(r.url);
    }
  } catch {
    // Ni GitHub, ni mémoire du navigateur, ni installeur de secours : on renvoie vers la page des versions.
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

/** Frise des quatre moments : l'étape affichée à l'écran est mise en avant. */
function wireRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail || !('IntersectionObserver' in window)) return;
  const links = [...rail.querySelectorAll('a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a, i) => a.setAttribute('aria-current', String(sections[i] === e.target)));
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => s && io.observe(s));
}

/*
 * Démo de draft : les picks tombent un par un, les barres de compo se remplissent et le pentagone
 * s'allume segment par segment, puis RIFU signale les manques et propose trois options. Un clic sur
 * une option la verrouille et montre ce qu'elle change. Scénario illustratif.
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
const AXES = ['frontline', 'engage', 'peel', 'cc'];
const LOW = 5;

function wireDemo() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;
  const q = (s) => demo.querySelector(s);
  const qa = (s) => [...demo.querySelectorAll(s)];
  const timer = q('[data-timer]');
  const phase = q('[data-phase]');
  const gaps = q('[data-gaps]');
  const verdict = q('[data-verdict-out]');
  const options = qa('[data-option]');
  const bars = Object.fromEntries(qa('[data-axis]').map((b) => [b.dataset.axis, b]));
  const ad = q('[data-dmg] .ad');
  const adOut = q('[data-dmg-out]');
  const you = q('[data-you]');
  const youImg = you.querySelector('img');
  const youName = you.querySelector('b');
  // Le grand pentagone du héros porte les mêmes segments que celui de la console : ils s'allument ensemble.
  const seg = (name) => {
    const paths = [...document.querySelectorAll(`[data-seg="${name}"]`)];
    return { classList: { add: (c) => paths.forEach((p) => p.classList.add(c)), remove: (c) => paths.forEach((p) => p.classList.remove(c)) } };
  };
  const setTimer = (n) => { timer.firstElementChild.textContent = String(n); timer.style.setProperty('--t', String(n / 30)); };
  let timeouts = [];
  let base = null;

  const later = (ms, fn) => timeouts.push(setTimeout(fn, ms));
  const slot = (p) => q(`[data-${p.side}="${p.i}"]`);

  function setAxes(totals, adShare, markLow) {
    for (const [axis, bar] of Object.entries(bars)) {
      const v = Math.min(totals[axis] || 0, 10);
      bar.querySelector('i').style.width = `${v * 10}%`;
      bar.nextElementSibling.textContent = String(v);
      bar.classList.toggle('is-low', markLow && v < LOW);
    }
    ad.style.width = adShare === null ? '50%' : `${Math.round(adShare * 100)}%`;
    adOut.textContent = adShare === null ? '—' : `${Math.round(adShare * 100)} % AD`;
  }

  function setGaps(apOk, frontOk) {
    const chip = (pair, ok) => Object.assign(document.createElement('span'), { className: ok ? 'gap-chip is-ok' : 'gap-chip', textContent: pair[ok ? 1 : 0] });
    gaps.replaceChildren(chip(T.gaps.ap, apOk), chip(T.gaps.front, frontOk));
  }

  function clearChoice() {
    options.forEach((o) => o.setAttribute('aria-pressed', 'false'));
    you.classList.remove('is-picked');
    youImg.hidden = true;
    youName.textContent = T.you;
    seg('you').classList.remove('on');
  }

  function reset() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    base = null;
    qa('.slot[data-ally], .slot[data-enemy]').forEach((s) => {
      s.classList.remove('is-picked');
      s.querySelector('[data-name]').textContent = '…';
    });
    document.querySelectorAll('[data-seg]').forEach((p) => p.classList.remove('on'));
    options.forEach((o) => { o.classList.remove('is-in'); o.disabled = true; });
    clearChoice();
    gaps.replaceChildren();
    verdict.textContent = '';
    setAxes({}, null, false);
    setTimer(30);
    phase.textContent = T.draftStart;
  }

  function finish(totals, adSum) {
    base = { totals: { ...totals }, adSum };
    setAxes(totals, adSum / 4, true);
    setGaps(false, false);
    setTimer(22);
    phase.textContent = T.yourTurn;
    verdict.textContent = T.pickOne;
    options.forEach((o) => { o.disabled = false; });
  }

  function choose(option) {
    if (!base) return;
    clearChoice();
    option.setAttribute('aria-pressed', 'true');
    const add = option.dataset.axes.split(',').map(Number);
    const totals = Object.fromEntries(AXES.map((axis, i) => [axis, base.totals[axis] + add[i]]));
    setAxes(totals, base.adSum / 5, true);
    setGaps(true, totals.frontline >= LOW);
    youImg.src = option.querySelector('img').src;
    youImg.hidden = false;
    youName.textContent = option.dataset.name;
    you.classList.add('is-picked');
    seg('you').classList.add('on');
    verdict.textContent = option.dataset.verdict;
  }

  function play() {
    reset();
    const totals = {};
    let adSum = 0;
    let allies = 0;
    const step = reducedMotion ? 0 : 560;
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
          seg(String(p.i)).classList.add('on');
        }
        setAxes(totals, allies ? adSum / allies : null, false);
        setTimer(30 - Math.round((n + 1) * 0.9));
        phase.textContent = p.side === 'ally' ? T.allyPicks : T.enemyPicks;
      };
      if (step) later(300 + n * step, run); else run();
    });
    const end = () => {
      finish(totals, adSum);
      options.forEach((o, i) => (step ? later(200 + i * 160, () => o.classList.add('is-in')) : o.classList.add('is-in')));
    };
    if (step) later(300 + DEMO_PICKS.length * step + 250, end); else end();
  }

  options.forEach((o) => o.addEventListener('click', () => choose(o)));
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
wireRail();
wireDemo();
void wireDownloads();
