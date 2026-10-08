# Notice d'Accompagnement à la Reprise de Projet - Tartan Generator

Bienvenue à bord ! Si tu lis ce document, c'est que tu reprends les rênes du projet **Random Tartan Generator**. Pas de panique, je suis là pour t'accompagner. J'ai rédigé ce guide comme une carte au trésor pour t'éviter de te perdre et te donner les clés de survie essentielles si je ne suis plus là pour t'aider.

Installe-toi confortablement, prends un café, et c'est parti.

---

## 1. Cartographie Mentale (Architecture Globale)

Contrairement à ce que tu pourrais avoir croisé ailleurs, ce projet **n'est pas** une usine à gaz avec du React, du Rust ou des bases de données complexes. C'est une application **front-end 100% statique**.

**Comment ça marche, en mots simples ?**
Imagine ce projet comme une page de magazine interactive.
- Le **HTML (`index.html`)** est la structure de la page : les boutons, les panneaux, les textes.
- Le **CSS (intégré dans le HTML)** est la peinture et la décoration.
- Le **JavaScript (`Random_Tartan_Generator.js`)** est le moteur qui fait le travail. Il utilise une bibliothèque appelée **p5.js** (qui est comme une boîte de pinceaux magiques pour dessiner sur le web) pour générer les images de tartan directement dans ton navigateur.

**Il n'y a pas de backend (serveur).** Tout se passe sur l'ordinateur de l'utilisateur. Rien n'est envoyé sur le réseau quand on clique sur "Générer".

---

## 2. Visite Guidée du Code (Où trouver quoi ?)

Le projet est ultra-léger, tout est à la racine. Voici ta carte :

*   **`index.html`** : C'est le point d'entrée.
    *   *Si je veux changer un texte (ex: le titre) ?* C'est ici, ou dans le dictionnaire de traduction qui se trouve dans le JS.
    *   *Si je veux modifier l'interface (un bouton, une couleur de fond) ?* C'est dans la balise `<style>` au début de ce fichier.
*   **`Random_Tartan_Generator.js`** : C'est **le cœur nucléaire** du projet.
    *   *Si je veux changer la logique mathématique du tartan ?* C'est ici.
    *   *Si je veux modifier la façon dont on sauvegarde ou exporte une image ?* C'est ici.
    *   *Si je veux ajouter une nouvelle couleur officielle SRT ?* C'est dans l'objet `SRT_COLORS` au début de ce fichier.
*   **`p5.min.js`** : C'est la bibliothèque de dessin. **Ne touche jamais à ce fichier**, c'est du code externe compressé.
*   **`README.md` & `README.fr.md`** : La documentation générale pour les utilisateurs sur GitHub.

---

## 3. Les Concepts Clés à retenir (Crash Course)

Puisque tu es débutant sur ces technos, voici les 3 concepts pour lire le code sans transpirer :

### A. La logique p5.js (`setup()` et `draw()`)
Le fichier JS principal repose sur deux fonctions majeures dictées par p5.js :
1.  **`setup()`** : S'exécute **une seule fois** au chargement de la page. C'est ici qu'on prépare la toile (le *canvas*), qu'on lie les clics des boutons à des actions, et qu'on fait les réglages initiaux.
2.  **`draw()`** : Normalement, p5.js l'exécute en boucle (comme un jeu vidéo). **Mais attention !** Pour des raisons de performance, nous utilisons `noLoop()` dans `setup()`. Donc `draw()` ne s'exécute que lorsqu'on lui dit explicitement de le faire (via la commande `redraw()`). C'est dans `draw()` que se trouve la logique qui dessine les fils horizontaux (trame) et verticaux (chaîne).

### B. Manipulation du DOM (JavaScript "Vanille")
Ici, pas de React. Pour interagir avec la page HTML, on utilise le JavaScript classique :
- `document.getElementById('monBouton')` : Permet d'attraper un élément de la page.
- `.addEventListener('click', ...)` : Permet de dire "Quand on clique sur ce bouton, fais cette action".

### C. Le `localStorage` (La mémoire locale)
Puisqu'il n'y a pas de base de données (pas de Dexie ou de SQL), l'application utilise la mémoire du navigateur de l'utilisateur (`localStorage`).
C'est comme un petit bloc-notes caché. C'est grâce à ça que si tu rafraîchis la page, ton dernier tartan est toujours là. Tu verras des `localStorage.setItem(...)` (pour écrire) et `localStorage.getItem(...)` (pour lire) dans le code.

---

## 4. Le Flux de la Donnée (Anatomie d'une action)

**Scénario : Que se passe-t-il exactement quand je clique sur "GÉNÉRER" ?**

1.  **Le Clic :** Tu cliques sur le bouton `<button id="btn-generate">` dans `index.html`.
2.  **L'Écouteur (L'oreille) :** Dans `setup()` (dans le JS), un écouteur `document.getElementById('btn-generate').addEventListener('click', generateNewTartan)` capte ton clic.
3.  **La Logique (`generateNewTartan`) :** Cette fonction va lire les options cochées dans le menu (symétrie, nb de couleurs), faire des mathématiques pour créer une nouvelle "recette" de tartan (le code SRT), et l'enregistrer dans l'historique.
4.  **L'Ordre de Dessin :** À la fin de cette fonction, on appelle `redrawTartan()`, qui calcule les bonnes dimensions et appelle finalement `redraw()`.
5.  **Le Rendu (`draw()`) :** p5.js efface la toile et dessine, ligne par ligne et pixel par pixel, le croisement des fils en fonction de la nouvelle recette.
6.  **L'Affichage :** L'image apparaît sur ton écran.

---

## 5. Le Guide de Survie (Débogage & Compilation)

### Comment lancer et tester le projet ?
**Bonne nouvelle : Il n'y a RIEN à compiler !** (Pas de `npm run build`, pas de Rust, pas de Tauri).
C'est du web statique pur.

Pour lancer le projet, tu as deux choix :
1.  **Méthode barbare :** Double-clique sur `index.html` dans ton explorateur de fichiers. Ça marchera pour 90% des choses, mais certaines fonctions de sécurité du navigateur pourraient bloquer l'export.
2.  **Méthode Pro (Recommandée) :** Utilise un petit serveur local.
    *   Si tu as Python installé, ouvre ton terminal dans le dossier du projet et tape : `python -m http.server 3000` (ou `python3`).
    *   Ouvre ton navigateur et va à l'adresse : `http://localhost:3000`

### Au secours, j'ai un écran blanc ! Où regarder ?
Pas de panique, c'est presque toujours une erreur de syntaxe dans le JavaScript.
1.  Fais un **Clic droit sur la page > Inspecter** (ou appuie sur `F12`).
2.  Va dans l'onglet **"Console"**.
3.  Tu verras un texte rouge. C'est l'erreur. Elle te dira exactement le fichier et le numéro de ligne (ex: `Uncaught SyntaxError: ... at Random_Tartan_Generator.js:142`).
4.  Va à cette ligne dans ton code, tu as sûrement oublié une virgule, une parenthèse `)` ou une accolade `}`.

### C'est tout !
Tu as maintenant toutes les clés en main. Le code est pensé pour être simple et direct. Fais des essais, casse des choses en local, et regarde comment ça réagit. Bon courage pour la suite de l'aventure !
