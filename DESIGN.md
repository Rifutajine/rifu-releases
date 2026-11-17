# Système visuel du site · « Forge 2027 »

Le site reprend l'identité de l'app (refonte « Hextech 2027 » du 23/10 et logo « Compo » du 25/10) et la pousse d'un cran. Le site est vu le soir, sur le PC de jeu ou le téléphone, dans une pièce peu éclairée : fond sombre.

## Couleurs (jetons dans `docs/assets/style.css`, `:root`)

- Fond `--bg` #05080E (le même que l'app), surfaces `--bg-1`, `--bg-2`, `--surface`. Traits `--line`, `--line-2`, `--line-3`, ivoire transparent.
- Texte `--text` #EEE8DC, secondaire `--text-2`, discret `--muted`, petit texte `--faint` (au moins 4,5:1 sur le fond).
- Or du logo `--gold` #C8A464 et `--gold-hi` pour le texte mis en avant ; cyan `--cyan` #2BB5C8 réservé à « vous » (votre lame, votre slot, votre choix).
- États : `--win` (vert, réglé, inclus), `--ember` (manque, payant), `--ap` / `--ad` pour la barre de dégâts.
- La lumière vient du pentagone : halos radiaux or et cyan derrière le héros et les blocs d'action, jamais de dégradé sur le texte.

## Typographie

- Archivo, largeur variable : titres en 108 à 116 %, graisse 760 à 820, approche serrée (-0,03 em). Libellés de données en largeur 90 à 94 %, capitales espacées.
- Geist Mono seulement pour les chiffres, versions, touches et minuteurs.
- Pas de sur-titre au-dessus des titres : un titre porte seul ; la mise en avant passe par `<span class="gold">`.

## Composants

- Boutons : `.btn-primary` (or dégradé, reflet qui passe au survol, la seule lueur colorée du site), `.btn-ghost`, `.btn-discord`, tailles `-sm` et `-lg`.
- Captures de l'app : cadre `.screen` / `.page-shot`, rayon 14 à 16 px, ombre profonde ; un clic les agrandit (`a.zoom`).
- Listes à coches `.ticks`, index de fonctions `.toolindex` (filets, pas de cartes), tableaux `.compare` (colonne RIFU éclairée d'or), FAQ en `<details name="faq">` qui s'ouvrent en douceur.
- Bloc d'action `.launch-card` en fin de page, dock `.dock` qui apparaît après le héros.

## Mouvement

- Un seul moment signature : l'assemblage du pentagone 3D pendant la démo de draft (`penta3d.js`), lames en ressort, éclat à la matérialisation.
- Le reste est discret et natif : apparition des captures liée au scroll (`animation-timeline: view()`), barre de lecture de l'en-tête (`scroll()`), fondu enchaîné des écrans du parcours, transitions entre pages (`@view-transition`).
- Tout respecte « réduire les animations » ; sans prise en charge du navigateur, le contenu reste visible et immobile.
