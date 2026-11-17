/*
 * Site RIFU : réglages en tête de fichier, lien de téléchargement de la dernière version, puis les
 * interactions (démo de draft avec le pentagone 3D, parcours en quatre temps, onglets, palette Ctrl + K,
 * agrandissement des captures, bouton adapté à l'appareil, mesure d'audience sans cookie).
 * Les réglages laissés vides ('') désactivent simplement ce qui en dépend.
 */
const RIFU_SITE = {
  /** Dépôt GitHub qui publie les installeurs (même source que les mises à jour automatiques). */
  releasesRepo: 'Rifutajine/rifu-releases',
  /** Invitation Discord publique, pour demander un code bêta et donner son avis. */
  discordUrl: 'https://discord.gg/CGRcbW4SVw',
  /** Adresse de contact affichée sur le site et dans la politique de confidentialité. */
  contactEmail: 'rifutajine@gmail.com',
  /**
   * Code du site GoatCounter (mesure d'audience sans cookie), par exemple 'rifu' pour rifu.goatcounter.com.
   * Vide : aucune mesure, aucun script tiers chargé.
   */
  goatcounter: '',
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
const SCRIPT_URL = document.currentScript?.src || '';

/** Textes écrits par le script, selon la langue de la page (français par défaut, anglais pour /en/). */
const TEXTS = {
  fr: {
    locale: 'fr-FR',
    megabytes: 'Mo',
    version: 'Version',
    updated: 'mise à jour',
    notes: 'Notes de version',
    fallbackMeta: 'Windows 10 et 11 · installeur sur la page des versions',
    gaps: {
      ap: ['Il vous manque des dégâts magiques', 'Dégâts magiques : réglé'],
      front: ['Frontline faible', 'Frontline : réglée'],
    },
    draftStart: 'La draft commence…',
    yourTurn: 'À vous : trois options de votre pool',
    pickOne: 'Choisissez une option pour voir ce qu’elle change à la compo.',
    complete: 'Compo complète',
    you: 'Vous',
    started: 'Le téléchargement démarre. Rien ne se passe ? Cliquez sur le bouton.',
    allyPicks: 'Votre équipe choisit…',
    enemyPicks: "L'adversaire choisit…",
    zoomLabel: 'Capture agrandie',
    close: 'Fermer',
    zoomHint: ' · Cliquez sur l’image pour la voir en taille réelle.',
    importReady: 'Tout importer dans League',
    importDone: '✓ Runes, sorts et objets importés',
    importNudge: ['C’est ce que RIFU fait pour de vrai, en sélection. ', 'Installer RIFU'],
    sendLink: 'Envoyer le lien sur mon PC',
    sendShort: 'Envoyer le lien',
    shareTitle: 'RIFU pour Windows',
    shareText: 'L’app compagnon League of Legends gratuite, à installer sur mon PC :',
    linkCopied: 'Lien copié : ouvrez-le sur votre PC Windows.',
    downloadPage: 'telecharger.html',
    setups: {
      Galio: { runes: 'Après-coup · Bouclier anti-magie', spells: 'Saut éclair + Téléportation', items: 'Égide solaire → Sablier de Zhonya' },
      Orianna: { runes: 'Invocation d’Aery · Ruban de mana', spells: 'Saut éclair + Barrière', items: 'Tourment de Liandry → Sablier de Zhonya' },
      Ahri: { runes: 'Électrocution · Goût du sang', spells: 'Saut éclair + Embrasement', items: 'Malédiction de Malfaisance → Zhonya' },
    },
    screens: ['RIFU · Sélection des champions', 'RIFU · Chargement plein écran', 'RIFU · Panneau Ctrl + X et HUD', 'RIFU · Bilan et note sur 100'],
    cmdTitle: 'Navigation rapide RIFU',
    cmdPlaceholder: 'Aller à un écran, télécharger, Discord…',
    cmdClose: 'Échap',
    cmdEmpty: 'Rien de trouvé. Essayez « draft », « bilan » ou « Discord ».',
    cmdItems: [
      { label: 'Télécharger RIFU pour Windows', tag: 'Action', href: 'telecharger.html?dl=1' },
      { label: 'Demander un code bêta sur Discord', tag: 'Communauté', discord: true },
      { label: 'Essayer la démo de draft', tag: 'Démo', home: '#demo' },
      { label: 'Sélection des champions', tag: 'Parcours', home: '#selection' },
      { label: 'Écran de chargement : les dix joueurs', tag: 'Parcours', home: '#chargement' },
      { label: 'Overlays en partie : Ctrl + X et HUD', tag: 'Parcours', home: '#en-partie' },
      { label: 'Bilan de partie et note sur 100', tag: 'Parcours', home: '#bilan' },
      { label: 'Progression et défauts qui reviennent', tag: 'Section', home: '#progression' },
      { label: 'Modes : Faille, ARAM et Mayhem', tag: 'Section', home: '#modes' },
      { label: 'Toutes les fonctions en détail', tag: 'Page', href: 'fonctions.html' },
      { label: 'Comparatif RIFU, Porofessor et DPM', tag: 'Section', home: '#comparatif' },
      { label: 'RIFU, alternative à Porofessor', tag: 'Page', href: 'alternative-porofessor.html' },
      { label: 'RIFU, alternative à DPM', tag: 'Page', href: 'alternative-dpm.html' },
      { label: 'Installer en deux minutes', tag: 'Guide', href: 'telecharger.html#etapes' },
      { label: 'Questions fréquentes', tag: 'Aide', home: '#faq' },
      { label: 'Confidentialité', tag: 'Légal', href: 'confidentialite.html' },
      { label: 'English version', tag: 'Langue', lang: 'en' },
    ],
  },
  en: {
    locale: 'en-GB',
    megabytes: 'MB',
    version: 'Version',
    updated: 'updated',
    notes: 'Release notes',
    fallbackMeta: 'Windows 10 and 11 · installer on the releases page',
    gaps: {
      ap: ['You lack magic damage', 'Magic damage: covered'],
      front: ['Weak frontline', 'Frontline: covered'],
    },
    draftStart: 'Draft starting…',
    yourTurn: 'Your turn: three options from your pool',
    pickOne: 'Pick an option to see what it changes for the comp.',
    complete: 'Comp complete',
    you: 'You',
    started: 'Your download is starting. Nothing happening? Click the button.',
    allyPicks: 'Your team is picking…',
    enemyPicks: 'The enemy is picking…',
    zoomLabel: 'Enlarged screenshot',
    close: 'Close',
    zoomHint: ' · Click the image to see it at full size.',
    importReady: 'Import all to League',
    importDone: '✓ Runes, spells and items imported',
    importNudge: ['That’s what RIFU really does in champ select. ', 'Install RIFU'],
    sendLink: 'Send the link to my PC',
    sendShort: 'Send the link',
    shareTitle: 'RIFU for Windows',
    shareText: 'The free League of Legends companion app, to install on my PC:',
    linkCopied: 'Link copied: open it on your Windows PC.',
    downloadPage: 'download.html',
    setups: {
      Galio: { runes: 'Aftershock · Nullifying Orb', spells: 'Flash + Teleport', items: 'Hollow Radiance → Zhonya’s Hourglass' },
      Orianna: { runes: 'Summon Aery · Manaflow Band', spells: 'Flash + Barrier', items: 'Blackfire Torch → Zhonya’s Hourglass' },
      Ahri: { runes: 'Electrocute · Taste of Blood', spells: 'Flash + Ignite', items: 'Malignance → Zhonya’s Hourglass' },
    },
    screens: ['RIFU · Champion select', 'RIFU · Full-screen loading', 'RIFU · Ctrl + X panel and HUD', 'RIFU · Post-game review and score'],
    cmdTitle: 'RIFU quick navigation',
    cmdPlaceholder: 'Jump to a screen, download, Discord…',
    cmdClose: 'Esc',
    cmdEmpty: 'Nothing found. Try “draft”, “review” or “Discord”.',
    cmdItems: [
      { label: 'Download RIFU for Windows', tag: 'Action', href: 'download.html?dl=1' },
      { label: 'Request a beta code on Discord', tag: 'Community', discord: true },
      { label: 'Try the draft demo', tag: 'Demo', home: '#demo' },
      { label: 'Champion select', tag: 'Journey', home: '#selection' },
      { label: 'Loading screen: all ten players', tag: 'Journey', home: '#chargement' },
      { label: 'In-game overlays: Ctrl + X and HUD', tag: 'Journey', home: '#en-partie' },
      { label: 'Post-game review and score out of 100', tag: 'Journey', home: '#bilan' },
      { label: 'Progress and recurring mistakes', tag: 'Section', home: '#progression' },
      { label: 'Modes: Rift, ARAM and Mayhem', tag: 'Section', home: '#modes' },
      { label: 'Every feature in detail', tag: 'Page', href: 'features.html' },
      { label: 'Comparison: RIFU, Porofessor and DPM', tag: 'Section', home: '#comparatif' },
      { label: 'RIFU, a Porofessor alternative', tag: 'Page', href: 'porofessor-alternative.html' },
      { label: 'RIFU, a DPM alternative', tag: 'Page', href: 'dpm-alternative.html' },
      { label: 'Install in two minutes', tag: 'Guide', href: 'download.html#etapes' },
      { label: 'Frequently asked questions', tag: 'Help', home: '#faq' },
      { label: 'Privacy', tag: 'Legal', href: '../confidentialite.html#english' },
      { label: 'Version française', tag: 'Language', lang: 'fr' },
    ],
  },
};
const isEn = document.documentElement.lang.startsWith('en');
const T = isEn ? TEXTS.en : TEXTS.fr;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Appareil : RIFU s'installe sur un PC Windows ---------- */
const DEVICE = (() => {
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const mobile = navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const windows = /win/i.test(platform) || /Windows/i.test(ua);
  return { mobile, windows: windows && !mobile };
})();
if (!DEVICE.windows) document.documentElement.classList.add('not-windows');

/* ---------- Mesure d'audience sans cookie (GoatCounter), seulement si un code est réglé ---------- */
function whenShown(fn) {
  if (document.prerendering) document.addEventListener('prerenderingchange', fn, { once: true });
  else fn();
}
function wireAnalytics() {
  const code = RIFU_SITE.goatcounter;
  if (!code) return;
  whenShown(() => {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    document.head.append(s);
  });
}
const track = (name) => {
  try { window.goatcounter?.count?.({ path: name, title: name, event: true }); } catch { /* mesure facultative */ }
};

/* ---------- Dernière version publiée ---------- */
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
 * L'API GitHub sans compte est limitée à 60 appels par heure et par adresse IP. On garde donc la dernière
 * réponse valide dans le navigateur et on la réutilise si l'API refuse, après une nouvelle tentative.
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

const formatSize = (bytes) => `${Math.round(bytes / 1e6)} ${T.megabytes}`;
function formatAge(iso) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(T.locale, { numeric: 'auto' });
  if (Math.abs(days) < 1) return rtf.format(0, 'day');
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  return new Date(iso).toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/*
 * Téléchargement. Les boutons mènent à la page de téléchargement avec « ?dl=1 » : elle lance l'installeur
 * toute seule (sur Windows seulement) et affiche les étapes. Sur cette page, le bouton pointe droit sur
 * l'installeur. Sans script, il mène à la page des versions de GitHub. La page peut être pré-rendue au
 * survol (règles de spéculation) : le téléchargement automatique attend alors qu'elle soit affichée.
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
    track('telechargement-exe');
    if (b.href.endsWith('.exe') || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    try { window.location.assign((await release).url); } catch { window.location.assign(releasesPage); }
  }));
  const params = new URLSearchParams(window.location.search);
  const auto = buttons.length > 0 && params.get('dl') === '1' && DEVICE.windows;
  if (params.has('dl')) window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  try {
    const r = await release;
    buttons.forEach((b) => { b.href = r.url; b.setAttribute('download', ''); });
    versions.forEach((v) => { v.textContent = r.version; });
    metas.forEach((m) => {
      m.textContent = `${T.version} ${r.version} · ${T.updated} ${formatAge(r.date)} · ${formatSize(r.size)} · `;
      const notes = document.createElement('a');
      notes.href = r.page;
      notes.textContent = T.notes;
      m.append(notes);
    });
    if (auto) {
      whenShown(() => {
        if (status) { status.textContent = T.started; status.hidden = false; }
        track('telechargement-auto');
        window.location.assign(r.url);
      });
    }
  } catch {
    buttons.forEach((b) => { b.href = releasesPage; });
    metas.forEach((m) => { m.textContent = T.fallbackMeta; });
  }
}

/* Hors Windows (mobile, Mac) : les boutons principaux proposent d'envoyer le lien vers son PC. */
function wireDeviceCta() {
  if (DEVICE.windows) return;
  const target = new URL(`${document.querySelector('.brand')?.getAttribute('href') || './'}${T.downloadPage}`, location.href).href;
  document.querySelectorAll('[data-dl-label], [data-dl-label-short]').forEach((label) => {
    const btn = label.closest('a');
    if (!btn) return;
    label.textContent = label.hasAttribute('data-dl-label-short') ? T.sendShort : T.sendLink;
    btn.querySelector('use')?.setAttribute('href', '#i-share');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      track('envoyer-lien');
      const data = { title: T.shareTitle, text: T.shareText, url: target };
      if (navigator.share) {
        try { await navigator.share(data); return; } catch (err) { if (err?.name === 'AbortError') return; }
      }
      try { await navigator.clipboard.writeText(target); toast(T.linkCopied); } catch { window.location.assign(target); }
    });
  });
}

let toastTimer;
function toast(text) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = Object.assign(document.createElement('div'), { className: 'toast', role: 'status' });
    document.body.append(el);
  }
  el.textContent = text;
  requestAnimationFrame(() => el.classList.add('is-on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
}

function wireContacts() {
  document.querySelectorAll('[data-discord]').forEach((el) => {
    if (!RIFU_SITE.discordUrl) { el.hidden = true; return; }
    el.href = RIFU_SITE.discordUrl;
    el.target = '_blank';
    el.rel = 'noopener';
    el.addEventListener('click', () => track('discord'));
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

/* ---------- En-tête et dock ---------- */
function wireHeader() {
  const top = document.querySelector('.top');
  if (!top) return;
  const update = () => top.classList.toggle('is-scrolled', window.scrollY > 12);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/** Dock d'action : visible une fois le héros passé, masqué au bloc final où les mêmes boutons sont déjà là. */
function wireDock() {
  const dock = document.querySelector('[data-dock]');
  const hero = document.querySelector('.hero');
  if (!dock || !hero || !('IntersectionObserver' in window)) return;
  const end = document.querySelector('.launch');
  let past = false;
  let atEnd = false;
  const sync = () => dock.classList.toggle('is-visible', past && !atEnd);
  new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }, { threshold: 0 }).observe(hero);
  if (end) new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; sync(); }, { rootMargin: '0px 0px -10% 0px' }).observe(end);
}

/* ---------- Onglets accessibles (modes de jeu) ---------- */
function wireTabs() {
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role=tab]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        select(tabs[(i + d + tabs.length) % tabs.length], true);
      });
    });
  });
}

/* ---------- Boucle de progression : repéré → priorité → corrigé ---------- */
function wireLoop() {
  const root = document.querySelector('[data-loop]');
  if (!root) return;
  const rail = root.querySelector('.loop-track');
  const tabs = [...root.querySelectorAll('[data-loop-tab]')];
  let idx = 0;
  let timer = null;
  let touched = false;
  const show = (i, focus) => {
    idx = i;
    tabs.forEach((t, n) => {
      t.setAttribute('aria-selected', String(n === i));
      t.tabIndex = n === i ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = n !== i;
    });
    rail.style.setProperty('--p', String(i / 2));
    if (focus) tabs[i].focus();
  };
  const stop = () => { touched = true; clearInterval(timer); };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { stop(); show(i); });
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      stop();
      show((i + d + 3) % 3, true);
    });
  });
  show(0);
  if (reducedMotion || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting && !touched) timer = setInterval(() => show((idx + 1) % 3), 3600);
  }, { threshold: 0.4 }).observe(root);
}

/* ---------- Parcours : l'écran collant suit l'étape lue ---------- */
function wireJourney() {
  const root = document.querySelector('[data-journey]');
  if (!root || !('IntersectionObserver' in window)) return;
  const steps = [...root.querySelectorAll('.jstep')];
  const screens = [...root.querySelectorAll('[data-screen]')];
  const floats = [...root.querySelectorAll('[data-float]')];
  const dots = [...root.querySelectorAll('[data-dot]')];
  const title = root.querySelector('[data-screen-title]');
  const set = (i) => {
    steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    screens.forEach((s) => s.classList.toggle('is-on', Number(s.dataset.screen) === i));
    floats.forEach((f) => f.classList.toggle('is-on', Number(f.dataset.float) === i));
    dots.forEach((d) => d.classList.toggle('is-on', Number(d.dataset.dot) === i));
    if (title) title.textContent = T.screens[i] || '';
  };
  set(0);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) set(steps.indexOf(e.target));
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => io.observe(s));
}

/*
 * Démo de draft : les picks tombent un par un, les barres de compo se remplissent et les lames du
 * pentagone se matérialisent, puis RIFU signale les manques et propose trois options. Le survol montre
 * les gains d'axes ; le clic pose la lame « vous » et affiche l'import en un clic.
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
  const svgSeg = (name) => [...demo.querySelectorAll(`.penta-svg [data-seg="${name}"]`)];

  // Pentagone 3D : chargé à la demande, la démo marche aussi sans (pentagone SVG)
  let penta = null;
  const canvas = q('[data-penta-canvas]');
  if (canvas && SCRIPT_URL && 'WebGL2RenderingContext' in window) {
    import(new URL('penta3d.js', SCRIPT_URL).href).then(({ mountPenta3D }) => {
      penta = mountPenta3D(canvas, { reduced: reducedMotion });
      if (!penta) return;
      demo.classList.add('has-3d');
      demo.addEventListener('penta-lost', () => { penta = null; demo.classList.remove('has-3d'); });
      // rattrape l'état déjà joué par la démo avant le chargement du module
      for (const p of svgSeg('0').concat(svgSeg('1'), svgSeg('2'), svgSeg('3'), svgSeg('you'))) if (p.classList.contains('on')) penta.lock(p.dataset.seg);
    }).catch(() => {});
  }
  const lock = (name) => { svgSeg(name).forEach((p) => p.classList.add('on')); penta?.lock(name); };
  const release = (name) => { svgSeg(name).forEach((p) => p.classList.remove('on')); penta?.release(name); };

  const setTimer = (n) => { timer.lastElementChild.textContent = String(n); timer.style.setProperty('--t', String(n / 30)); };
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
      if (d > 0) out.append(Object.assign(document.createElement('em'), { textContent: `+${d}` }));
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
    release('you');
    penta?.complete(false);
    demo.classList.remove('is-complete');
    importBar.hidden = true;
  }

  function reset() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    base = null;
    demo.classList.remove('is-waiting');
    qa('.slot[data-ally], .slot[data-enemy]').forEach((s) => s.classList.remove('is-picked'));
    ['0', '1', '2', '3'].forEach(release);
    penta?.reset();
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
    demo.classList.add('is-waiting');
  }

  function showImportBar(champ) {
    const setup = T.setups?.[champ];
    if (!setup) { importBar.hidden = true; return; }
    const title = Object.assign(document.createElement('b'), { textContent: `${champ} vs Zed` });
    importMeta.replaceChildren(title, Object.assign(document.createElement('span'), { textContent: [setup.runes, setup.spells, setup.items].join(' · ') }));
    importBtn.textContent = T.importReady;
    importBtn.classList.remove('is-done');
    importBar.hidden = false;
  }

  const plan = (option) => {
    const add = option.dataset.axes.split(',').map(Number);
    return {
      deltas: Object.fromEntries(AXES.map((axis, i) => [axis, add[i]])),
      totals: Object.fromEntries(AXES.map((axis, i) => [axis, base.totals[axis] + add[i]])),
    };
  };

  function choose(option) {
    if (!base) return;
    const was = lockedOption;
    clearChoice();
    demo.classList.remove('is-waiting');
    lockedOption = option;
    option.setAttribute('aria-pressed', 'true');
    const { deltas, totals } = plan(option);
    setAxes(totals, base.adSum / 5, true, deltas);
    setGaps(true, totals.frontline >= LOW);
    youImg.src = option.querySelector('img').src;
    youImg.hidden = false;
    youName.textContent = option.dataset.name;
    you.classList.add('is-picked');
    later(was ? 120 : 0, () => lock('you'));
    later(650, () => { penta?.complete(true); demo.classList.add('is-complete'); phase.textContent = `${T.complete} · ${option.dataset.name}`; });
    verdict.textContent = option.dataset.verdict;
    showImportBar(option.dataset.name);
    setTimer(18);
    track(`demo-${option.dataset.name.toLowerCase()}`);
  }

  options.forEach((o) => {
    o.addEventListener('click', () => choose(o));
    o.addEventListener('pointerenter', () => {
      if (!base || lockedOption) return;
      const { deltas, totals } = plan(o);
      setAxes(totals, base.adSum / 5, true, deltas);
      penta?.hover(true);
    });
    o.addEventListener('pointerleave', () => {
      if (!base || lockedOption) return;
      setAxes(base.totals, base.adSum / 4, true, null);
      penta?.hover(false);
    });
  });

  importBtn.addEventListener('click', () => {
    importBtn.textContent = T.importDone;
    importBtn.classList.add('is-done');
    const link = Object.assign(document.createElement('a'), { href: isEn ? 'download.html?dl=1' : 'telecharger.html?dl=1', textContent: T.importNudge[1] });
    link.addEventListener('click', () => track('demo-installer'));
    verdict.replaceChildren(document.createTextNode(T.importNudge[0]), link);
    track('demo-import');
  });

  function play() {
    reset();
    const totals = {};
    let adSum = 0;
    let allies = 0;
    const step = reducedMotion ? 0 : 520;
    DEMO_PICKS.forEach((p, n) => {
      const run = () => {
        slot(p).classList.add('is-picked');
        if (p.axes) {
          for (const [k, v] of Object.entries(p.axes)) totals[k] = (totals[k] || 0) + v;
          adSum += p.ad;
          allies += 1;
          lock(String(p.i));
        }
        setAxes(totals, allies ? adSum / allies : null, false);
        setTimer(30 - Math.round((n + 1) * 0.9));
        phase.textContent = p.side === 'ally' ? T.allyPicks : T.enemyPicks;
      };
      if (step) later(500 + n * step, run); else run();
    });
    const end = () => {
      finish(totals, adSum);
      options.forEach((o, i) => (step ? later(160 + i * 130, () => o.classList.add('is-in')) : o.classList.add('is-in')));
    };
    if (step) later(500 + DEMO_PICKS.length * step + 240, end); else end();
  }

  q('[data-replay]')?.addEventListener('click', () => { play(); track('demo-rejouer'); });
  reset();
  if (!('IntersectionObserver' in window)) { play(); return; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    whenShown(play);
  }, { threshold: 0.25 });
  io.observe(demo);
}

/* ---------- Palette de commande (Ctrl + K), comme dans l'app ---------- */
function wireCommandPalette() {
  if (typeof HTMLDialogElement !== 'function') return;
  const home = document.querySelector('.brand')?.getAttribute('href') || './';
  const alt = (lang) => document.querySelector(`link[rel=alternate][hreflang=${lang}]`)?.href;
  const dialog = document.createElement('dialog');
  dialog.className = 'cmd-dialog';
  dialog.setAttribute('aria-label', T.cmdTitle);
  dialog.innerHTML = `
    <div class="cmd-head">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input class="cmd-input" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="cmd-list">
      <button class="cmd-close" type="button"></button>
    </div>
    <div class="cmd-list" id="cmd-list" role="listbox"></div>`;
  document.body.append(dialog);
  const input = dialog.querySelector('.cmd-input');
  input.placeholder = T.cmdPlaceholder;
  input.setAttribute('aria-label', T.cmdPlaceholder);
  const list = dialog.querySelector('.cmd-list');
  const closeBtn = dialog.querySelector('.cmd-close');
  closeBtn.textContent = T.cmdClose;
  let active = 0;
  let links = [];
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function render(query = '') {
    const qn = norm(query.trim());
    list.replaceChildren();
    links = [];
    T.cmdItems.forEach((item, n) => {
      if (item.discord && !RIFU_SITE.discordUrl) return;
      if (qn && !norm(`${item.label} ${item.tag}`).includes(qn)) return;
      const href = item.discord ? RIFU_SITE.discordUrl : item.lang ? alt(item.lang) : item.home ? `${home}${item.home}` : `${home}${item.href}`;
      if (!href) return;
      const a = document.createElement('a');
      a.className = 'cmd-item';
      a.id = `cmd-${n}`;
      a.setAttribute('role', 'option');
      a.href = href;
      if (item.discord) { a.target = '_blank'; a.rel = 'noopener'; }
      a.append(Object.assign(document.createElement('span'), { textContent: item.label }), Object.assign(document.createElement('small'), { textContent: item.tag }));
      a.addEventListener('click', () => dialog.close());
      list.append(a);
      links.push(a);
    });
    if (!links.length) list.append(Object.assign(document.createElement('p'), { className: 'cmd-empty', textContent: T.cmdEmpty }));
    active = 0;
    highlight();
  }
  function highlight() {
    links.forEach((a, i) => { a.classList.toggle('is-selected', i === active); a.setAttribute('aria-selected', String(i === active)); });
    if (links[active]) { input.setAttribute('aria-activedescendant', links[active].id); links[active].scrollIntoView({ block: 'nearest' }); }
  }
  function open() { render(''); input.value = ''; dialog.showModal(); input.focus(); track('palette'); }

  document.querySelectorAll('[data-cmd-open]').forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (!links.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % links.length; highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + links.length) % links.length; highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); links[active]?.click(); }
  });
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) dialog.close(); else open();
    }
  });
}

/* ---------- Captures agrandies : un clic sur l'image la passe en taille réelle ---------- */
function wireLightbox() {
  const links = document.querySelectorAll('a.zoom');
  if (!links.length || typeof HTMLDialogElement !== 'function') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', T.zoomLabel);
  dialog.innerHTML = '<div class="lightbox-stage"><img alt=""></div><p class="lightbox-bar"></p><button class="lightbox-close" type="button">×</button>';
  document.body.append(dialog);
  const img = dialog.querySelector('img');
  const bar = dialog.querySelector('.lightbox-bar');
  const closeBtn = dialog.querySelector('.lightbox-close');
  closeBtn.setAttribute('aria-label', T.close);
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-stage').addEventListener('click', (e) => { if (e.target !== img) dialog.close(); });
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
    bar.append(Object.assign(document.createElement('span'), { textContent: T.zoomHint }));
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
  }));
}

wireAnalytics();
wireContacts();
wireLightbox();
wireHeader();
wireDock();
wireTabs();
wireLoop();
wireJourney();
wireDemo();
wireCommandPalette();
wireDeviceCta();
void wireDownloads();
