# rifu-releases

Installeurs Windows de RIFU (publiés en releases, lus par les mises à jour automatiques) et site web de l'app.

## Site web (`docs/`)

Site statique, sans outil de construction : `docs/index.html` (accueil, démo de draft animée, parcours de la sélection au bilan, fonctions, comparatif, installation, FAQ) et `docs/confidentialite.html` (confidentialité et mentions légales).

- **Mise en ligne** : Settings › Pages › Build and deployment › Source « Deploy from a branch », branche `main`, dossier `/docs`. Adresse : <https://rifutajine.github.io/rifu-releases/>.
- **Téléchargement** : le bouton pointe tout seul vers l'installeur `RIFU-Setup-<version>.exe` de la dernière release publiée (pré-versions comprises). Rien à modifier à chaque version.
- **Réglages** : en tête de `docs/assets/site.js`, `discordUrl` et `contactEmail`. Laissés vides, les liens correspondants sont masqués. L'adresse de contact figure aussi en clair dans les mentions légales de `docs/confidentialite.html`.
- **Captures** : `docs/assets/captures/`, tirées de l'aperçu fictif de l'app (`npm run capture -w @rifu/desktop` dans RIFU---App, overlays compris), recadrées sans le menu latéral. Le HUD est capturé à sa taille réelle (340 × 316, échelle 2).
- **Illustrations** : `docs/assets/art/` (splash arts du héros et de l'appel final) et `docs/assets/champions/` (icônes 96 × 96 de la démo de draft), issus de Data Dragon, dans le cadre de la politique « Legal Jibber Jabber » de Riot.
- **Démo de draft** : scénario dans `DEMO_PICKS` et `DEMO_GAPS` de `docs/assets/site.js`. Les noms et les options sont dans le HTML, pour rester lisibles sans script.
- **Comparatif** : tableau `#comparatif` de `docs/index.html`, d'après les offres publiques relevées en octobre 2026. À revoir si Porofessor ou DPM changent leur offre.
- **SEO** : titre et description, `canonical`, Open Graph, données structurées JSON-LD (`SoftwareApplication` gratuit, `FAQPage` qui reprend la FAQ, `WebSite`), `sitemap.xml` et `site.webmanifest`. Après une modification de la FAQ, mettre à jour le bloc JSON-LD. À faire une fois : déclarer le site et le sitemap dans Google Search Console et Bing Webmaster Tools.
- **Nom de domaine** : ajouter un fichier `docs/CNAME` contenant le domaine, puis remplacer `rifutajine.github.io/rifu-releases` par le domaine dans les pages HTML (`canonical`, `og:`, JSON-LD), `sitemap.xml` et `robots.txt`, et mettre à jour les chemins de `docs/404.html`. `robots.txt` n'est lu qu'à la racine d'un domaine : il ne sert qu'avec un domaine personnalisé.

Polices Barlow et Barlow Condensed (SIL Open Font License 1.1) hébergées avec le site : aucune requête vers un service tiers, hors l'API publique de GitHub pour la dernière version.
