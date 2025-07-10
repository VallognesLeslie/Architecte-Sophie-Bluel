# Portfolio Architecte Sophie Bluel

## Présentation

Ce projet a été réalisé dans le cadre de ma formation **Intégrateur Web** chez **OpenClassrooms**.

L’objectif : développer un site web dynamique pour présenter les travaux d’une architecte d’intérieur fictive, **Sophie Bluel**. Ce projet m’a permis de mettre en pratique des compétences en **JavaScript**, **gestion du DOM**, **interactions avec une API**, et **création d’interfaces dynamiques**.

---

## Objectifs techniques

- Dynamiser une galerie de projets à partir d’une API.
- Implémenter un système d’authentification pour un administrateur.
- Gérer des ajouts et suppressions de projets via une interface modale.
- Respecter une maquette Figma fournie.

---

## Fonctionnalités principales

### Galerie dynamique

- Appel à l’API pour récupérer les projets.
- Affichage dynamique dans la page d’accueil.
- Suppression du HTML statique.

### Filtres par catégorie

- Génération automatique du menu de filtres.
- Tri des projets au clic sur une catégorie.

### Page de connexion

- Intégration d’un formulaire d’authentification.
- Connexion via `fetch` avec gestion de token.
- Redirection après connexion.

### Interface administrateur (modale)

- Ouverture / fermeture d’une modale pour gérer les projets.
- Suppression de projets directement dans l’interface.
- Ajout de nouveaux projets avec prévisualisation d’image.
- Mise à jour de la galerie sans rechargement de la page.

---

## Technologies utilisées

- HTML5 / CSS3
- JavaScript
- API (avec Swagger)
- Node.js / npm (pour le back-end fourni)

---

## Installation du projet

## Prérequis

- Installer [Node.js](https://nodejs.org/) (inclut npm)
- Avoir suivi les cours JavaScript associés au projet

## Installation

Cloner le dépôt fournie pour le projet :

```bash
git clone git@github.com:OpenClassrooms-Student-Center/Portfolio-architecte-sophie-bluel.git
```

Ensuite, installer les dépendances pour le back-end et le front-end (depuis les dossiers respectifs) :

```bash
npm install
```

## Lancement du projet

- Démarrer le back-end
- Vérifier la documentation Swagger de l’API
- Tester la route de récupération des travaux
- Lancer le front-end et vérifier que la galerie fonctionne correctement

## Fonctionnalités principales

- Affichage dynamique des travaux via fetch et API
- Filtrage par catégorie généré dynamiquement
- Page de connexion administrateur avec gestion des erreurs
- Modale pour l’ajout et la suppression de médias
- Actualisation dynamique du DOM sans rechargement

## Conseils

- Analyser la maquette et la documentation
- Tester les fonctionnalités au fur et à mesure
- Utiliser les ressources pédagogiques fournies (cours JS, tutoriels Swagger, etc.)

---

Projet fictif réalisé dans le cadre de ma formation OpenClassrooms
