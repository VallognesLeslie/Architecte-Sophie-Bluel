//-------------1.1--------TRAVAUX---------------------------------------------
let tousLesTravaux = []; // On stocke ici les travaux récupérés

console.log("Début du script, préparation du fetch des travaux");

fetch("http://localhost:5678/api/works")
  .then((reponse) => {
    console.log("Réponse reçue pour les travaux");
    return reponse.json();
  })
  .then((travaux) => {
    console.log("Travaux convertis en JSON :", travaux);
    tousLesTravaux = travaux;

    // On extrait les catégories uniques des travaux avec un Set
    const categoriesUnique = new Set();
    tousLesTravaux.forEach((travail) =>
      categoriesUnique.add(travail.categoryId)
    );
    console.log("Catégories uniques extraites des travaux :", categoriesUnique);

    // Je récupère l'élément HTML avec la classe "gallery"
    let elementsGalerie = document.getElementsByClassName("gallery");
    let galerie = elementsGalerie[0]; // getElementsByClassName retourne une collection, on prend le 1er

    // Pour chaque travail dans la liste reçue
    for (let i = 0; i < travaux.length; i++) {
      let travail = travaux[i];

      // Je crée une balise <figure>
      let figure = document.createElement("figure");

      // Je crée une balise <img> et lui donne les bonnes valeurs
      let image = document.createElement("img");
      image.src = travail.imageUrl;
      image.alt = travail.title;

      // Je crée une balise <figcaption> (la légende)
      let legende = document.createElement("figcaption");
      legende.innerText = travail.title;

      // J'assemble tout (<img> et <figcaption>) dans <figure>
      figure.appendChild(image);
      figure.appendChild(legende);

      // J'ajoute la figure à la galerie dans la page
      galerie.appendChild(figure);
    }
    console.log("Tous les travaux affichés dans la galerie");
  })
  .catch((erreur) => {
    console.error("Erreur lors du chargement des travaux :", erreur);
  });

// ------------- 1.2 TRI PAR CATEGORIE + BOUTON TOUS -----------------

const sectionPortfolio = document.getElementById("portfolio");

// Création d’un conteneur pour les boutons de filtre
const menuCategories = document.createElement("div");
menuCategories.classList.add("menu-categories");
sectionPortfolio.insertBefore(menuCategories, sectionPortfolio.children[1]);

console.log("Début du fetch des catégories");

fetch("http://localhost:5678/api/categories")
  .then((reponse) => {
    console.log("Réponse reçue pour les catégories");
    return reponse.json();
  })
  .then((categories) => {
    console.log("Catégories converties en JSON :", categories);

    // Ajout du bouton "Tous"
    const boutonTous = document.createElement("button");
    boutonTous.innerText = "Tous";
    boutonTous.classList.add("filtre-btn", "active");
    menuCategories.appendChild(boutonTous);
    console.log("Bouton 'Tous' ajouté");

    boutonTous.addEventListener("click", () => {
      console.log("Bouton 'Tous' cliqué");
      afficherTravaux(tousLesTravaux);
      definirBoutonActif(boutonTous);
    });

    //Ajout d’un bouton par catégorie
    categories.forEach((categorie) => {
      const bouton = document.createElement("button");
      bouton.innerText = categorie.name;
      bouton.dataset.id = categorie.id;
      bouton.classList.add("filtre-btn");
      menuCategories.appendChild(bouton);
      console.log(`Bouton catégorie '${categorie.name}' ajouté`);

      bouton.addEventListener("click", () => {
        console.log(`Bouton catégorie '${categorie.name}' cliqué`);
        const filtres = tousLesTravaux.filter(
          (travail) => travail.categoryId === categorie.id
        );
        console.log(
          `Travaux filtrés pour la catégorie '${categorie.name}':`,
          filtres
        );
        afficherTravaux(filtres);
        definirBoutonActif(bouton);
      });
    });
  })
  .catch((erreur) => {
    console.error("Erreur lors du chargement des catégories :", erreur);
  });

// Fonction pour gérer le bouton actif visuellement
const definirBoutonActif = (boutonActif) => {
  const boutons = menuCategories.getElementsByTagName("button");
  for (let i = 0; i < boutons.length; i++) {
    boutons[i].classList.remove("active");
  }
  boutonActif.classList.add("active");
  console.log(`Bouton actif défini : ${boutonActif.innerText}`);
};

// Fonction pour afficher une liste de travaux dans la galerie
const afficherTravaux = (travaux) => {
  const elementsGalerie = document.getElementsByClassName("gallery");
  const galerie = elementsGalerie[0];

  // je vide la galerie avant d'afficher les travaux (important pour éviter les doublons)
  galerie.innerHTML = "";

  // je recrée les éléments pour chaque travail donné
  travaux.forEach((travail) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = travail.imageUrl;
    image.alt = travail.title;

    const legende = document.createElement("figcaption");
    legende.innerText = travail.title;

    figure.appendChild(image);
    figure.appendChild(legende);

    galerie.appendChild(figure);
  });
  console.log(`${travaux.length} travaux affichés dans la galerie`);
};

// Initialiser l'affichage avec tous les travaux (après leur chargement)
console.log("Initialisation de l'affichage des travaux au chargement");

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((travaux) => {
    tousLesTravaux = travaux;
    afficherTravaux(tousLesTravaux); // Affiche tous les travaux au départ
    console.log("Travaux initialement affichés");
  })
  .catch((erreur) => {
    console.error("Erreur lors du chargement des travaux :", erreur);
  });

// ------------- 2.1 FORMULAIRE -----------------
