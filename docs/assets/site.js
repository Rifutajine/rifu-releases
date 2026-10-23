/*
 * Site RIFU : réglages en tête de fichier, puis lien de téléchargement de la dernière version.
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

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const formatSize = (bytes) => `${Math.round(bytes / 1e6)} Mo`;

async function wireDownloads() {
  const buttons = document.querySelectorAll('[data-download]');
  const metas = document.querySelectorAll('[data-download-meta]');
  if (!buttons.length) return;
  try {
    const r = await latestRelease();
    buttons.forEach((b) => { b.href = r.url; b.setAttribute('download', ''); });
    metas.forEach((m) => {
      m.textContent = `Version ${r.version} · ${formatDate(r.date)} · ${formatSize(r.size)} · `;
      const notes = document.createElement('a');
      notes.href = r.page;
      notes.textContent = 'Notes de version';
      m.append(notes);
    });
  } catch {
    // Quota de l'API GitHub atteint ou réseau coupé : on renvoie vers la page des versions.
    buttons.forEach((b) => { b.href = releasesPage; });
    metas.forEach((m) => { m.textContent = 'Windows 10 et 11 · installeur sur la page des versions'; });
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

wireContacts();
void wireDownloads();
