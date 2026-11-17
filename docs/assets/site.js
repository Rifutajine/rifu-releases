/*
 * Site RIFU : réglages en tête de fichier, lien de téléchargement de la dernière version,
 * puis les animations et interactions de la page d'accueil (barre de progression, frise des
 * quatre moments, points d'intérêt sur les captures, démo de draft jouable avec aperçu
 * d'import en 1 clic, filtre des fonctions, dock flottant et palette de commande Ctrl + K).
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
    gaps: {
      ap: ['Il vous manque des dégâts magiques', 'Dégâts magiques : réglé'],
      front: ['Frontline faible', 'Frontline : réglée'],
    },
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
    importReady: 'Tout importer dans League',
    importDone: '✓ Runes, sorts et objets importés',
    setups: {
      Galio: {
        runes: 'Après-coup · Bouclier anti-magie',
        spells: 'Saut éclair + Téléportation',
        items: 'Égide solaire → Sablier de Zhonya',
      },
      Orianna: {
        runes: 'Invocation d’Aery · Ruban de mana',
        spells: 'Saut éclair + Barrière',
        items: ' Tourment de Liandry → Sablier de Zhonya',
      },
      Ahri: {
        runes: 'Électrocution · Goût du sang',
        spells: 'Saut éclair + Embrasement',
        items: 'Malédiction de Malfaisance → Zhonya',
      },
    },
    cmdTitle: 'Navigation rapide RIFU',
    cmdPlaceholder: 'Aller à un écran, télécharger, Discord…',
    cmdClose: 'Échap',
    cmdItems: [
      { label: 'Télécharger RIFU pour Windows (.exe)', tag: 'Action', href: 'telecharger.html?dl=1' },
      { label: 'Demander un code bêta sur Discord', tag: 'Communauté', discord: true },
      { label: 'Essayer la démo de draft interactive', tag: 'Démo', href: '#demo' },
      { label: '1 · Sélection des champions', tag: 'Parcours', href: '#selection' },
      { label: '2 · Écran de chargement (10 joueurs)', tag: 'Parcours', href: '#chargement' },
      { label: '3 · Overlays en partie (Ctrl + X, HUD)', tag: 'Parcours', href: '#en-partie' },
      { label: '4 · Bilan de fin de partie (Note / 100)', tag: 'Parcours', href: '#bilan' },
      { label: 'Suivi de progression & défauts récurrents', tag: 'Section', href: '#progression' },
      { label: 'Modes : Faille, ARAM & ARAM Mayhem', tag: 'Section', href: '#modes' },
      { label: 'Tier list, Collection de skins & Fonctions', tag: 'Section', href: '#fonctions' },
      { label: 'Comparatif : RIFU vs Porofessor vs DPM', tag: 'Section', href: '#comparatif' },
      { label: 'Installation en 2 minutes & raccourcis', tag: 'Guide', href: '#installer' },
      { label: 'Questions fréquentes (FAQ)', tag: 'Aide', href: '#faq' },
      { label: 'Switch to English version', tag: 'Langue', href: 'en/' },
    ],
  },
  en: {
    locale: 'en-GB',
    megabytes: 'MB',
    version: 'Version',
    notes: 'Release notes',
    fallbackMeta: 'Windows 10 and 11 · installer on the releases page',
    gaps: {
      ap: ['You lack magic damage', 'Magic damage: covered'],
      front: ['Weak frontline', 'Frontline: covered'],
    },
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
    importReady: 'Import all to League',
    importDone: '✓ Runes, spells & items imported',
    setups: {
      Galio: {
        runes: 'Aftershock · Nullifying Orb',
        spells: 'Flash + Teleport',
        items: 'Hollow Radiance → Zhonya’s Hourglass',
      },
      Orianna: {
        runes: 'Summon Aery · Manaflow Band',
        spells: 'Flash + Barrier',
        items: 'Blackfire Torch → Zhonya’s Hourglass',
      },
      Ahri: {
        runes: 'Electrocute · Taste of Blood',
        spells: 'Flash + Ignite',
        items: 'Malignance → Zhonya’s Hourglass',
      },
    },
    cmdTitle: 'RIFU Quick Command',
    cmdPlaceholder: 'Jump to a section, download, Discord…',
    cmdClose: 'Esc',
    cmdItems: [
      { label: 'Download RIFU for Windows (.exe)', tag: 'Action', href: 'download.html?dl=1' },
      { label: 'Request a beta code on Discord', tag: 'Community', discord: true },
      { label: 'Try the interactive draft demo', tag: 'Demo', href: '#demo' },
      { label: '1 · Champion Select & Draft', tag: 'Journey', href: '#selection' },
      { label: '2 · Loading Screen (All 10 players)', tag: 'Journey', href: '#chargement' },
      { label: '3 · In-Game Overlays (Ctrl + X, HUD)', tag: 'Journey', href: '#en-partie' },
      { label: '4 · Post-Game Breakdown (Score / 100)', tag: 'Journey', href: '#bilan' },
      { label: 'Progression & recurring mistakes loop', tag: 'Section', href: '#progression' },
      { label: 'Game Modes: Rift, ARAM & ARAM Mayhem', tag: 'Section', href: '#modes' },
      { label: 'Tier List, Skin Collection & All Features', tag: 'Section', href: '#fonctions' },
      { label: 'Comparison: RIFU vs Porofessor vs DPM', tag: 'Section', href: '#comparatif' },
      { label: '2-Minute Install Guide & Shortcuts', tag: 'Guide', href: '#installer' },
      { label: 'Frequently Asked Questions (FAQ)', tag: 'Help', href: '#faq' },
      { label: 'Passer à la version française', tag: 'Language', href: '../' },
    ],
  },
};
const isEn = document.documentElement.lang.startsWith('en');
const T = isEn ? TEXTS.en : TEXTS.fr;

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
  document.querySelectorAll('[data-contact-fallback]').forEach((el) => {
    el.hidden = Boolean(RIFU_SITE.contactEmail || RIFU_SITE.discordUrl);
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** En-tête opaque dès qu'on quitte le haut de la page + jauge de progression de lecture. */
function wireHeader() {
  const top = document.querySelector('.top');
  if (!top) return;
  const wrap = top.querySelector('.wrap');
  const update = () => {
    const y = window.scrollY;
    top.classList.toggle('is-scrolled', y > 12);
    if (wrap) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      wrap.style.setProperty('--scroll-p', Math.min(1, Math.max(0, y / max)).toFixed(3));
    }
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/** Dock flottant d'action rapide : visible après le héros, masqué près de la fin de page. */
function wireFloatingDock() {
  const dock = document.querySelector('[data-floating-dock]');
  const hero = document.querySelector('.hero');
  const finalSec = document.querySelector('.final');
  if (!dock || !hero) return;
  let pastHero = false;
  let nearEnd = false;
  const sync = () => dock.classList.toggle('is-visible', pastHero && !nearEnd);
  if ('IntersectionObserver' in window) {
    const ioHero = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    }, { threshold: 0.05 });
    ioHero.observe(hero);
    if (finalSec) {
      const ioEnd = new IntersectionObserver(([e]) => {
        nearEnd = e.isIntersecting;
        sync();
      }, { rootMargin: '120px 0px 0px 0px' });
      ioEnd.observe(finalSec);
    }
  }
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
  }, { rootMargin: '-38% 0px -54% 0px' });
  sections.forEach((s) => s && io.observe(s));
}

/** Points d'intérêt interactifs (Hotspots) sur les captures des 4 moments d'une partie. */
function wireHotspots() {
  document.querySelectorAll('.chapter').forEach((chapter) => {
    const spots = [...chapter.querySelectorAll('.hotspot[data-spot]')];
    const items = [...chapter.querySelectorAll('.checks li[data-spot-target]')];
    if (!spots.length) return;

    const activate = (id) => {
      spots.forEach((s) => s.classList.toggle('is-open', s.dataset.spot === id));
      items.forEach((li) => li.classList.toggle('is-active', li.dataset.spotTarget === id));
    };

    spots.forEach((s) => {
      const pin = s.querySelector('.hotspot-pin');
      const id = s.dataset.spot;
      pin?.addEventListener('mouseenter', () => activate(id));
      pin?.addEventListener('focus', () => activate(id));
      pin?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const already = s.classList.contains('is-open');
        activate(already ? '' : id);
      });
    });

    items.forEach((li) => {
      const id = li.dataset.spotTarget;
      li.addEventListener('mouseenter', () => activate(id));
      li.addEventListener('mouseleave', () => activate(''));
      li.addEventListener('click', () => {
        const already = li.classList.contains('is-active');
        activate(already ? '' : id);
      });
    });

    chapter.addEventListener('mouseleave', () => activate(''));
  });
}

/** Filtre par catégorie sur la matrice des fonctions (#fonctions). */
function wireFeatureFilter() {
  const buttons = [...document.querySelectorAll('[data-filter-btn]')];
  const cards = [...document.querySelectorAll('.index > div[data-cat]')];
  if (!buttons.length || !cards.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filterBtn;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      cards.forEach((c) => {
        c.hidden = cat !== 'all' && c.dataset.cat !== cat;
      });
    });
  });
}

/*
 * Démo de draft : les picks tombent un par un, les barres de compo se remplissent et le pentagone
 * s'allume segment par segment, puis RIFU signale les manques et propose trois options.
 * Un survol prévisualise les gains d'axes (+X), et un clic verrouille le champion et affiche
 * la barre d'import en 1 clic (runes, sorts, objets).
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
  const importBar = q('[data-import-bar]');
  const importMeta = q('[data-import-meta]');
  const importBtn = q('[data-import-btn]');
  const options = qa('[data-option]');
  const bars = Object.fromEntries(qa('[data-axis]').map((b) => [b.dataset.axis, b]));
  const ad = q('[data-dmg] .ad');
  const adOut = q('[data-dmg-out]');
  const you = q('[data-you]');
  const youImg = you.querySelector('img');
  const youName = you.querySelector('b');

  // Reflet spéculaire discret qui suit le pointeur sur la console
  demo.addEventListener('pointermove', (e) => {
    const r = demo.getBoundingClientRect();
    demo.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
    demo.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
  }, { passive: true });

  const seg = (name) => {
    const paths = [...document.querySelectorAll(`[data-seg="${name}"]`)];
    return { classList: { add: (c) => paths.forEach((p) => p.classList.add(c)), remove: (c) => paths.forEach((p) => p.classList.remove(c)) } };
  };
  const setTimer = (n) => { timer.firstElementChild.textContent = String(n); timer.style.setProperty('--t', String(n / 30)); };
  let timeouts = [];
  let base = null;
  let lockedOption = null;

  const later = (ms, fn) => timeouts.push(setTimeout(fn, ms));
  const slot = (p) => q(`[data-${p.side}="${p.i}"]`);

  function setAxes(totals, adShare, markLow, deltas = null) {
    for (const [axis, bar] of Object.entries(bars)) {
      const v = Math.min(totals[axis] || 0, 10);
      const d = deltas ? (deltas[axis] || 0) : 0;
      bar.querySelector('i').style.width = `${v * 10}%`;
      const out = bar.nextElementSibling;
      out.textContent = String(v);
      if (d > 0) {
        const em = document.createElement('em');
        em.textContent = `+${d}`;
        out.append(em);
      }
      bar.classList.toggle('is-low', markLow && v < LOW);
      bar.classList.toggle('is-boosted', d > 0);
    }
    ad.style.width = adShare === null ? '50%' : `${Math.round(adShare * 100)}%`;
    adOut.textContent = adShare === null ? '—' : `${Math.round(adShare * 100)} % AD`;
  }

  function setGaps(apOk, frontOk) {
    const chip = (pair, ok) => Object.assign(document.createElement('span'), { className: ok ? 'gap-chip is-ok' : 'gap-chip', textContent: pair[ok ? 1 : 0] });
    gaps.replaceChildren(chip(T.gaps.ap, apOk), chip(T.gaps.front, frontOk));
  }

  function clearChoice() {
    lockedOption = null;
    options.forEach((o) => o.setAttribute('aria-pressed', 'false'));
    you.classList.remove('is-picked');
    youImg.hidden = true;
    youName.textContent = T.you;
    seg('you').classList.remove('on');
    if (importBar) importBar.hidden = true;
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

  function showImportBar(champName) {
    if (!importBar || !importMeta || !importBtn) return;
    const setup = T.setups?.[champName];
    if (!setup) { importBar.hidden = true; return; }
    importMeta.replaceChildren();
    const title = document.createElement('b');
    title.textContent = `${champName} vs Zed`;
    const rSpan = document.createElement('span');
    rSpan.textContent = setup.runes;
    const sSpan = document.createElement('span');
    sSpan.textContent = setup.spells;
    const iSpan = document.createElement('span');
    iSpan.textContent = setup.items;
    importMeta.append(title, rSpan, sSpan, iSpan);
    importBtn.textContent = T.importReady;
    importBtn.classList.remove('is-done');
    importBar.hidden = false;
  }

  function choose(option) {
    if (!base) return;
    clearChoice();
    lockedOption = option;
    option.setAttribute('aria-pressed', 'true');
    const add = option.dataset.axes.split(',').map(Number);
    const deltas = Object.fromEntries(AXES.map((axis, i) => [axis, add[i]]));
    const totals = Object.fromEntries(AXES.map((axis, i) => [axis, base.totals[axis] + add[i]]));
    setAxes(totals, base.adSum / 5, true, deltas);
    setGaps(true, totals.frontline >= LOW);
    youImg.src = option.querySelector('img').src;
    youImg.hidden = false;
    youName.textContent = option.dataset.name;
    you.classList.add('is-picked');
    seg('you').classList.add('on');
    verdict.textContent = option.dataset.verdict;
    showImportBar(option.dataset.name);
  }

  function previewOption(option) {
    if (!base || lockedOption) return;
    const add = option.dataset.axes.split(',').map(Number);
    const deltas = Object.fromEntries(AXES.map((axis, i) => [axis, add[i]]));
    const totals = Object.fromEntries(AXES.map((axis, i) => [axis, base.totals[axis] + add[i]]));
    setAxes(totals, base.adSum / 5, true, deltas);
  }

  function unpreviewOption() {
    if (!base || lockedOption) return;
    setAxes(base.totals, base.adSum / 4, true, null);
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => {
      importBtn.textContent = T.importDone;
      importBtn.classList.add('is-done');
    });
  }

  function play() {
    reset();
    const totals = {};
    let adSum = 0;
    let allies = 0;
    const step = reducedMotion ? 0 : 540;
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
      if (step) later(280 + n * step, run); else run();
    });
    const end = () => {
      finish(totals, adSum);
      options.forEach((o, i) => (step ? later(180 + i * 140, () => o.classList.add('is-in')) : o.classList.add('is-in')));
    };
    if (step) later(280 + DEMO_PICKS.length * step + 220, end); else end();
  }

  options.forEach((o) => {
    o.addEventListener('click', () => choose(o));
    o.addEventListener('mouseenter', () => previewOption(o));
    o.addEventListener('mouseleave', () => unpreviewOption());
  });
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
 * Palette de commande rapide (Ctrl + K ou bouton dans l'en-tête), inspirée directement
 * du raccourci signature de l'application RIFU.
 */
function wireCommandPalette() {
  if (typeof HTMLDialogElement !== 'function') return;
  const triggers = document.querySelectorAll('[data-cmd-open]');
  const dialog = document.createElement('dialog');
  dialog.className = 'cmd-dialog';
  dialog.setAttribute('aria-label', T.cmdTitle);
  dialog.innerHTML = `
    <div class="cmd-head">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input class="cmd-input" type="search" placeholder="${T.cmdPlaceholder}" autocomplete="off" spellcheck="false">
      <button class="cmd-close" type="button">${T.cmdClose}</button>
    </div>
    <div class="cmd-list" role="listbox"></div>
  `;
  document.body.append(dialog);
  const input = dialog.querySelector('.cmd-input');
  const list = dialog.querySelector('.cmd-list');
  const closeBtn = dialog.querySelector('.cmd-close');
  let activeIdx = 0;
  let visibleLinks = [];

  function render(query = '') {
    const q = query.trim().toLowerCase();
    list.replaceChildren();
    visibleLinks = [];
    T.cmdItems.forEach((item) => {
      if (item.discord && !RIFU_SITE.discordUrl) return;
      if (q && !item.label.toLowerCase().includes(q) && !item.tag.toLowerCase().includes(q)) return;
      const a = document.createElement('a');
      a.className = 'cmd-item';
      a.setAttribute('role', 'option');
      a.href = item.discord ? RIFU_SITE.discordUrl : item.href;
      if (item.discord) { a.target = '_blank'; a.rel = 'noopener'; }
      const span = document.createElement('span');
      span.textContent = item.label;
      const small = document.createElement('small');
      small.textContent = item.tag;
      a.append(span, small);
      a.addEventListener('click', () => dialog.close());
      list.append(a);
      visibleLinks.push(a);
    });
    activeIdx = 0;
    highlight();
  }

  function highlight() {
    visibleLinks.forEach((a, i) => a.classList.toggle('is-selected', i === activeIdx));
    visibleLinks[activeIdx]?.scrollIntoView({ block: 'nearest' });
  }

  function openPalette() {
    render('');
    input.value = '';
    dialog.showModal();
    input.focus();
  }

  triggers.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openPalette();
  }));
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (!visibleLinks.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % visibleLinks.length;
      highlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + visibleLinks.length) % visibleLinks.length;
      highlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      visibleLinks[activeIdx]?.click();
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) dialog.close();
      else openPalette();
    }
  });
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
wireFloatingDock();
wireRail();
wireHotspots();
wireFeatureFilter();
wireDemo();
wireCommandPalette();
void wireDownloads();
