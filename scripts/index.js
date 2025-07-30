//-------------1.1--------TRAVAUX---------------------------------------------
let allWorks = []; // On stocke ici les travaux récupérés

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    allWorks = works;

    // On extrait les catégories uniques des travaux avec un Set
    const uniqueCategories = new Set();
    allWorks.forEach((work) => uniqueCategories.add(work.categoryId));

    // Je récupère l'élément HTML avec la classe "gallery"
    const galleryElements = document.getElementsByClassName("gallery");
    const gallery = galleryElements[0]; // getElementsByClassName retourne une collection, on prend le 1er

    // Pour chaque travail dans la liste reçue
    for (let i = 0; i < works.length; i++) {
      let work = works[i];

      // Je crée une balise <figure>
      const figure = document.createElement("figure");

      // Je crée une balise <img> et lui donne les bonnes valeurs
      const image = document.createElement("img");
      image.src = work.imageUrl;
      image.alt = work.title;

      // Je crée une balise <figcaption> (la légende)
      const caption = document.createElement("figcaption");
      caption.innerText = work.title;
      // J'assemble tout (<img> et <figcaption>) dans <figure>
      figure.appendChild(image);
      figure.appendChild(caption);

      // J'ajoute la figure à la galerie dans la page
      gallery.appendChild(figure);
    }
  })
  .catch((erreur) => {
    console.error("Erreur lors du chargement des travaux :", erreur);
  });

// ------------- 1.2 TRI PAR CATEGORIE + BOUTON TOUS -----------------

const portfolioSection = document.getElementById("portfolio");

// Création d’un conteneur pour les boutons de filtre
const categoryMenu = document.createElement("div");
categoryMenu.classList.add("menu-categories");
portfolioSection.insertBefore(categoryMenu, portfolioSection.children[1]);

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    // Ajout du bouton "Tous"
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("filter-btn", "active");
    categoryMenu.appendChild(allButton);

    allButton.addEventListener("click", () => {
      displayWorks(allWorks);
      setActiveButton(allButton);
    });

    //Ajout d’un bouton par catégorie
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.innerText = category.name;
      button.dataset.id = category.id;
      button.classList.add("filter-btn");
      categoryMenu.appendChild(button);

      button.addEventListener("click", () => {
        const filteredWorks = allWorks.filter(
          (work) => work.categoryId === category.id
        );

        displayWorks(filteredWorks);
        setActiveButton(button);
      });
    });
  })
  .catch((error) => {
    console.error("Error loading categories:", error);
  });

// Fonction pour gérer le bouton actif visuellement
const setActiveButton = (activeButton) => {
  const buttons = categoryMenu.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  activeButton.classList.add("active");
};

// Fonction pour afficher une liste de travaux dans la galerie
const displayWorks = (works) => {
  const galleryElements = document.getElementsByClassName("gallery");
  const gallery = galleryElements[0];

  // je vide la galerie avant d'afficher les travaux (important pour éviter les doublons)
  gallery.innerHTML = "";

  // je recrée les éléments pour chaque travail donné
  works.forEach((work) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.innerText = work.title;

    figure.appendChild(image);
    figure.appendChild(caption);

    gallery.appendChild(figure);
  });
};

// Initialiser l'affichage avec tous les travaux après leur chargement
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    allWorks = works;
    displayWorks(allWorks);
  })
  .catch((error) => {
    console.error("Error loading works:", error);
  });

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    enableEditMode();
  }
});

const enableEditMode = () => {
  // Affiche la barre édition
  const editBar = document.getElementById("edition-bar");
  editBar.classList.remove("hidden");

  // Cache les filtres
  const filters = document.getElementsByClassName("menu-categories")[0];
  if (filters) {
    filters.style.display = "none";
  }

  // Recherche le <h2> dans le portfolio
  const portfolio = document.getElementById("portfolio");
  let h2 = null;
  for (let i = 0; i < portfolio.children.length; i++) {
    if (portfolio.children[i].tagName === "H2") {
      h2 = portfolio.children[i];
      break;
    }
  }

  // Vérifie si le bouton modifier existe déjà
  if (!document.getElementById("editGallery")) {
    const editBtn = document.createElement("button");
    editBtn.id = "editGallery";
    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;
    editBtn.style.background = "none";
    editBtn.style.border = "none";
    editBtn.style.color = "#000";
    editBtn.style.fontSize = "14px";
    editBtn.style.cursor = "pointer";
    editBtn.style.marginLeft = "30px";
    editBtn.style.display = "flex";
    editBtn.style.alignItems = "center";
    editBtn.style.gap = "8px";

    if (h2) {
      h2.style.display = "flex";
      h2.style.alignItems = "center";
      h2.style.justifyContent = "center";
      h2.appendChild(editBtn);
    }

    // Ouvre la modale quand on clique
    editBtn.addEventListener("click", () => {
      document.getElementById("modal").classList.remove("hidden");
      loadModalGallery();
    });
  }

  // Création du bouton déconnexion
  // Remplace le lien "login" par "logout" dans la navigation
  const navElements = document.getElementsByTagName("nav");
  if (navElements.length > 0) {
    const nav = navElements[0];
    const allLinks = nav.getElementsByTagName("a");

    // Cherche le lien vers login.html
    for (let i = 0; i < allLinks.length; i++) {
      if (allLinks[i].href.includes("login.html")) {
        const loginLink = allLinks[i];
        loginLink.textContent = "logout";
        loginLink.href = "#"; // Enlève le lien vers login.html

        // Ajoute l'événement de déconnexion
        loginLink.addEventListener("click", (e) => {
          e.preventDefault(); // Empêche la navigation
          localStorage.removeItem("token");
          window.location.reload();
        });
        break; // Sort de la boucle une fois trouvé
      }
    }
  }
};
