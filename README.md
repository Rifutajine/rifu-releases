# rifu-releases

Installeurs Windows de RIFU (publiés en releases, lus par les mises à jour automatiques) et site web de l'app.

## Site web (`docs/`)

Site statique, sans outil de construction : `docs/index.html` (accueil, fonctionnalités, installation, FAQ) et `docs/confidentialite.html` (confidentialité et mentions légales).

- **Mise en ligne** : Settings › Pages › Build and deployment › Source « Deploy from a branch », branche `main`, dossier `/docs`. Adresse : <https://rifutajine.github.io/rifu-releases/>.
- **Téléchargement** : le bouton pointe tout seul vers l'installeur `RIFU-Setup-<version>.exe` de la dernière release publiée (pré-versions comprises). Rien à modifier à chaque version.
- **Réglages** : en tête de `docs/assets/site.js`, `discordUrl` et `contactEmail`. Laissés vides, les liens correspondants sont masqués. L'adresse de contact figure aussi en clair dans les mentions légales de `docs/confidentialite.html`.
- **Captures** : `docs/assets/captures/`, tirées de l'aperçu fictif de l'app (`npm run capture -w @rifu/desktop` dans RIFU---App), recadrées sans le menu latéral.
- **Nom de domaine** : ajouter un fichier `docs/CNAME` contenant le domaine, puis mettre à jour les adresses `canonical` et `og:` des pages HTML et les chemins de `docs/404.html`.

Polices Barlow et Barlow Condensed (SIL Open Font License 1.1) hébergées avec le site : aucune requête vers un service tiers, hors l'API publique de GitHub pour la dernière version.
