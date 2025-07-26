// Récupération des éléments DOM
const modal = document.getElementById("modal");
console.log("Élément modal récupéré :", modal);
const closeBtns = document.getElementsByClassName("close-modal");
console.log(`${closeBtns.length} bouton(s) de fermeture récupéré(s).`);

// Fermeture de la modale avec les boutons X
for (let i = 0; i < closeBtns.length; i++) {
  closeBtns[i].addEventListener("click", () => {
    console.log(`Bouton de fermeture ${i + 1} cliqué, fermeture de la modale.`);
    modal.classList.add("hidden");
  });
}

// Fermeture en cliquant en dehors de la modale
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    console.log("Clic détecté en dehors de la modale, fermeture.");
    modal.classList.add("hidden");
  }
});

// Fermeture avec la touche Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    console.log("Touche Échap pressée, fermeture de la modale.");
    modal.classList.add("hidden");
  }
});

// Fonction pour charger la galerie dans la modale
const loadModalGallery = () => {
  const modalGallery = document.getElementById("modalGallery");
  console.log("Chargement de la galerie dans la modale.");
  modalGallery.innerHTML = "";

  tousLesTravaux.forEach((travail) => {
    const workItem = document.createElement("div");
    workItem.classList.add("modal-work-item");

    const img = document.createElement("img");
    img.src = travail.imageUrl;
    img.alt = travail.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => {
      console.log(`Suppression demandée pour le travail id=${travail.id}`);
      deleteWork(travail.id);
    });

    workItem.appendChild(img);
    workItem.appendChild(deleteBtn);
    modalGallery.appendChild(workItem);
  });
  console.log("Galerie chargée dans la modale.");
};

// Fonction pour supprimer un travail
const deleteWork = (workId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    console.log(`Confirmation reçue pour supprimer le travail ${workId}`);
    const token = localStorage.getItem("token");
    console.log("Token récupéré pour suppression :", token ? "Oui" : "Non");

    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Supprimer de la liste locale
          tousLesTravaux = tousLesTravaux.filter(
            (travail) => travail.id !== workId
          );
          console.log(`Travail ${workId} supprimé localement.`);

          // Mettre à jour les deux galeries
          afficherTravaux(tousLesTravaux);
          loadModalGallery();

          console.log(`Travail ${workId} supprimé avec succès du serveur.`);
        } else {
          console.warn("Erreur lors de la suppression sur le serveur.");
          alert("Erreur lors de la suppression");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression");
      });
  } else {
    console.log(`Suppression du travail ${workId} annulée par l'utilisateur.`);
  }
};
