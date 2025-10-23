# Epitrello-2025

This project was completed during my second year at Epitech as part of my internship catch-up.

## Description

Epitrello is a web application inspired by Trello. The goal of the project is to recreate the main features of collaborative task and board management: creating boards, adding lists, managing cards, moving and editing items, as well as enabling real-time collaboration between users. This project aims to provide an experience similar to Trello, tailored to the educational and technical requirements of the Epitech curriculum.


## How it works

This project uses [Next.js](https://nextjs.org) for web development. To start the application in development mode:

```bash
# Epitrello — Gestionnaire de tâches (inspiré de Trello)

Epitrello est une application web expérimentale créée pendant un stage / projet étudiant. Elle reproduit les fonctionnalités essentielles d'un gestionnaire de tableaux (boards), listes et cartes — avec un focus sur une interface moderne, le drag & drop et une expérience rapide.

Ce README a été conçu pour être "interactif" et utile : instructions claires pour démarrer, guide d'utilisation (pas-à-pas), commandes utiles, sections de dépannage et roadmap.

---

## Table des matières
- [Démonstration rapide](#démonstration-rapide)
- [Installation et démarrage (dev)](#installation-et-démarrage-dev)
- [Fonctionnalités principales](#fonctionnalit%C3%A9s-principales)
- [Guide d'utilisation pas‑à‑pas](#guide-dutilisation-pas%C2%AD%C3%A0%C2%ADpas)
- [Raccourcis & interactions](#raccourcis--interactions)
- [Détails techniques](#d%C3%A9tails-techniques)
- [Dépannage rapide](#d%C3%A9pannage-rapide)
- [Roadmap / Prochaines étapes](#roadmap--prochaines-%C3%A9tapes)
- [Contribuer](#contribuer)

---

## Démonstration rapide

1. Démarrer le serveur de développement :

```bash
npm install
npm run dev
```

2. Ouvrir l'URL indiquée (http://localhost:3000 ou http://localhost:3001 si 3000 est occupé).

3. Essayer :
- Ajouter une nouvelle liste (titre) depuis le champ en haut.
- Dans chaque liste, ajouter une carte (titre).
- Cliquer sur une carte pour ouvrir la modal et ajouter une description, labels.
- Glisser-déposer des cartes entre listes ou pour réordonner.
- Glisser une colonne (liste) pour la réordonner.
- Supprimer une carte ou une liste (confirmation demandée).

Les données sont sauvegardées automatiquement dans `localStorage` (clé `epitrello_boards`).

---

## Installation et démarrage (dev)

Pré-requis : Node.js (16+ recommandé) et npm.

1. Installer les dépendances :

```bash
npm install
```

2. Lancer l'environnement de développement :

```bash
npm run dev
```

Si le port 3000 est occupé, Next.js proposera un port alternatif (ex : 3001).

---

## Fonctionnalités principales (implémentées)

- Création / édition / suppression de listes (colonnes).
- Création / édition / suppression de cartes.
- Modal de détail des cartes (titre, description, labels).
- Drag & drop : réordonnancement des cartes et des colonnes.
- Labels prédéfinis (Urgent, Bug, Feature, Amélioration) et affichage sous la carte.
- Sauvegarde automatique dans `localStorage` et indication d'heure de dernière sauvegarde.

Fonctionnalités prévues dans la roadmap : dates d'échéance & status, export/import JSON, collaboration temps réel.

---

## Guide d'utilisation pas‑à‑pas

- Ajouter une liste : taper le titre dans le champ "Nom de la nouvelle liste" → cliquer "+ Ajouter une liste".
- Ajouter une carte : dans une liste, taper le titre dans le champ "Nom de la carte" → cliquer "+ Ajouter une carte".
- Éditer une carte : cliquer sur la carte → modifier titre/description dans la modal → « Sauvegarder ».
- Ajouter/retirer un label : dans la modal, cliquer sur l'un des boutons label.
- Supprimer une carte : cliquer sur la croix ✕ à droite de la carte → confirmer.
- Supprimer une liste : cliquer sur les options (...) dans la liste → "Supprimer la liste" → confirmer.
- Drag & drop : glisser une carte sur une autre position ou glisser une colonne pour la réordonner.

---

## Raccourcis & interactions

- Cliquez sur le titre d'une liste pour éditer inline.
- Drag & drop souris pour déplacer.
- Dans la modal, le bouton "Sauvegarder" est désactivé si le titre est vide.

---

## Détails techniques (pour développeurs)

- Stack : Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn-style components.
- Fichiers importants :
	- `src/app/page.js` — logique principale (UI, gestion boards/cards, drag & drop, persistence)
	- `src/components/ui/button.jsx` — bouton partagé
	- `src/components/ui/card.jsx` — wrapper de carte
	- `src/components/ui/input.jsx` — composant input simple
	- `src/app/globals.css` — thème et variables CSS

- Sauvegarde : les boards sont enregistrés automatiquement dans `localStorage` sous la clé `epitrello_boards`.

---

## Dépannage rapide

- Si la page ne se charge pas : vérifier le terminal où tourne `npm run dev` pour erreurs de compilation.
- Port occupé : si 3000 est pris, Next.js utilise un port alternatif (3001). Ouvrez l'URL indiquée.
- Données perdues : assurez-vous que `localStorage` n'est pas nettoyé et que la clé `epitrello_boards` existe.

---

## Roadmap / Prochaines étapes

1. Terminer B : dates d'échéance + status des cartes.
2. Export / Import JSON (sauvegarde / restaurer un board).
3. Collaboration temps-réel (WebSocket) et gestion multi‑utilisateurs.
4. Tests automatisés et amélioration accessibilité.

---

## Contribuer

Les contributions sont bienvenues :
- Ouvrir une issue pour discuter d'une amélioration ou d'un bug.
- Faire une PR sur la branche principale (`main`).

---

Si vous voulez, je peux :
- Ajouter des captures d'écran ou GIFs d'usage.
- Générer un fichier `CONTRIBUTING.md` et des issues types.
- Ajouter un bouton d'export/import directement dans l'UI.

---

Licence: MIT
