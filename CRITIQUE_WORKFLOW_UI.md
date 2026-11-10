# Analyse Critique du Workflow & du Design Proposé (Maquette Excalidraw)

Document d'analyse et de cadrage pour la refonte de l'interface utilisateur de **Random Tartan Generator**.

---

## 1. Contexte & Vue d'Ensemble

L'ami a proposé une refonte de l'interface via une planche Excalidraw, structurée autour de plusieurs vues clés :
1. **Atelier (mode principal)** avec onglets latéraux (**Motif**, **Couleurs**, **Tissu**) et commandes intégrées au canevas.
2. **Planche (moodboard/patchwork)** séparée en mode complet plein écran.
3. **Barre supérieure unifiée** : Menus "Nouveau" et "Exporter", sélecteur Atelier / Planche, action "Partager le lien".
4. **Vues d'objets (Écharpe, Coussin, Kilt)** intégrées comme modes de visualisation du canevas.
5. **Barre de code SRT interactive** en bas du canevas, combinée avec un historique visuel en bande.

---

## 2. Erreurs et Incohérences Détectées dans la Maquette

Le tableau de contrôle a mis en lumière plusieurs incohérences ou approximations dans le tableau Excalidraw :

| Emplacement | Incohérence relevée | Analyse & Correction retenue |
|---|---|---|
| **Flèche « import + affichage fusionnés »** | Fausse alerte visuelle : la pointe tombe sous la pastille. | Pas d'ambiguïté technique : la barre SRT sert à la fois de lecture de la formule actuelle et de zone de saisie pour charger un sett. |
| **Flèche « Voir active la simulation »** | Erreur de pointage : vise « trop proches » au lieu de « se confondent (deutéranopie) ». | La simulation de daltonisme concerne les filtres de vision (protanopie, deutéranopie, tritanopie), tandis que l'alerte « trop proches » est un calcul de contraste Delta E dans l'espace Lab. |
| **« 1 action principale, toujours visible »** | Contradiction : le bouton Générer disparaissait sur les onglets Couleurs et Tissu. | **Correction :** Le bouton d'action principale "GÉNÉRER" reste visible en permanence en haut du panneau latéral, quel que soit l'onglet actif. |
| **« 1 motif = 21,4 cm · 714 fils »** | Chiffres incohérents : 240 fils à 0,30 mm = 7,2 cm (densité 258 fils/dm). | L'affichage métrique est calculé dynamiquement selon la formule exacte : `Largeur (cm) = Nb_fils × diamètre_fil (mm) / 10`. |
| **Curseur « Fils par bande »** | La poignée est au milieu (46 %) mais affiche la valeur max (64). | Conservation d'un double contrôle : un curseur pour le réglage rapide ET un champ numérique exact (valeurs paires requises en tissage). |
| **Fiche : « Laine 0,30 mm »** | Dans l'application, la laine est calibrée à 1,11 mm (0,30 mm correspond plutôt à de la soie ou du fil très fin). | Conservation des calibres réels des fibres configurés dans l'application. |
| **Étoiles ☆ sur la Planche** | Conflit visuel avec les étoiles d'or et d'argent de l'estimation photo. | **Correction :** Maintien de l'épingle 📌 pour le mode Planche (patchwork/moodboard) et réservation des étoiles d'or/argent à l'affinage d'estimation photo. |
| **« Tout est enregistré dans le lien »** | Faux : l'application utilise `localStorage`. Le lien n'est forgé qu'à la demande. | Maintien du fonctionnement `localStorage` pour la persistance locale instantanée, et génération du lien de partage compressé lors du clic sur "Partager le lien". |

---

## 3. Ce Qu'il Faut Conserver (Points Forts)

1. **Découpage Atelier / Planche** : Clarifie l'espace de travail en isolant la génération unitaire du mode d'exploration multi-motifs (Patchwork).
2. **Onglets Motif / Couleurs / Tissu** : Sépare logiquement la combinatoire mathématique du sett, la colorimétrie et les propriétés physiques du textile (fil, relief Z/S, irrégularité).
3. **Zoom et Recadrage sur le Canevas** : Déplacer les contrôles de zoom/pan sur le canevas lui-même libère le panneau latéral et rend l'interaction plus fluide.
4. **Menus Unifiés Nouveau & Exporter** : Regroupe les points d'entrée (Aléatoire, SRT, Photo) et les sorties (PNG, SVG, Fiche, ZIP) en clarifiant la fonction de chaque format.
5. **Couleur au Premier Plan** : Le nuancier SRT interactif avec prévisualisation immédiate améliore grandement le workflow de colorisation.

---

## 4. Arbitrages Techniques & UX

1. **Barre SRT : Mise à jour non destructive**
   * *Risque identifié :* Si la barre se met à jour à chaque touche (`input`), chaque frappe déclenche un choix aléatoire de nuance et pollue l'historique de rendu.
   * *Solution :* Valider la saisie sur `Entrée` ou perte de focus (`change` / `blur`), et préserver les codes couleurs déjà affectés en mémoire pour éviter les sauts de palette.
2. **Accessibilité & Écrans Tactiles**
   * L'action « Ouvrir dans l'Atelier » depuis la Planche ne repose pas sur le survol (`hover`), inaccessible sur mobile/tablette.
3. **Génération d'un Tartan depuis une image aléatoire (sans tartan au départ)**
   * Extraction des nuances dominantes de l'image (échantillonnage de pixels), projection de chaque pixel sur la nuance SRT la plus proche dans l'espace Lab, sélection des couleurs les plus fréquentes, puis synthèse d'un sett tartan proportionné.
