// Récupération des éléments DOM
const modal = document.getElementById("modal");
const closeBtns = document.getElementsByClassName("close-modal");

// Fermeture de la modale avec les boutons X
for (let i = 0; i < closeBtns.length; i++) {
  closeBtns[i].addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

// Fermeture en cliquant en dehors de la modale
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Fermeture avec la touche Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
  }
});

// Fonction utilitaire pour utiliser un template
const useTemplate = (templateId) => {
  const template = document.getElementById(templateId);
  return template.content.cloneNode(true);
};

// Fonction pour charger la galerie dans la modale
const loadModalGallery = () => {
  const modalContent = document.getElementsByClassName("modal-content")[0];

  // Utilisation du template
  const galleryTemplate = useTemplate("modal-gallery-template");

  // Vider le contenu actuel et injecter le template
  modalContent.innerHTML = "";
  modalContent.appendChild(galleryTemplate);

  // Réattacher les événements de fermeture
  attachCloseEvents();

  const modalGallery = document.getElementById("modalGallery");
  modalGallery.innerHTML = "";

  allWorks.forEach((work) => {
    const workItem = document.createElement("div");
    workItem.classList.add("modal-work-item");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => {
      deleteWork(work.id);
    });

    workItem.appendChild(img);
    workItem.appendChild(deleteBtn);
    modalGallery.appendChild(workItem);
  });

  // Ajouter l'événement pour le bouton "Ajouter une photo"
  document.getElementById("addPhotoBtn").addEventListener("click", () => {
    showAddPhotoModal();
  });
};

// Fonction pour afficher la modale d'ajout de photo
const showAddPhotoModal = () => {
  const modalContent = document.getElementsByClassName("modal-content")[0];

  // Utilisation du template
  const addPhotoTemplate = useTemplate("add-photo-template");

  // Vider le contenu actuel et injecter le template
  modalContent.innerHTML = "";
  modalContent.appendChild(addPhotoTemplate);

  // Réattacher les événements
  attachCloseEvents();
  attachAddPhotoEvents();
  loadCategories();
};

// Fonction pour attacher les événements de fermeture
const attachCloseEvents = () => {
  const closeBtns = document.getElementsByClassName("close-modal");
  for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }
};

// Fonction pour attacher les événements de la modale d'ajout
const attachAddPhotoEvents = () => {
  const backBtn = document.getElementById("backBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const imageInput = document.getElementById("imageInput");
  const changeImageBtn = document.getElementById("changeImageBtn");
  const addWorkForm = document.getElementById("addWorkForm");
  const workTitle = document.getElementById("workTitle");
  const workCategory = document.getElementById("workCategory");

  // Bouton retour
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      loadModalGallery();
    });
  }

  // Gestion de l'upload d'image
  uploadBtn.addEventListener("click", () => {
    imageInput.click();
  });

  changeImageBtn.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  // Validation du formulaire en temps réel
  workTitle.addEventListener("input", validateForm);
  workCategory.addEventListener("change", validateForm);

  // Soumission du formulaire
  addWorkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitNewWork();
  });
};

// Fonction pour gérer l'upload d'image
const handleImageUpload = (file) => {
  // Vérification du type de fichier
  if (!file.type.match(/^image\/(jpeg|png)$/)) {
    alert("Seuls les fichiers JPG et PNG sont acceptés");
    return;
  }

  // Vérification de la taille (4Mo max)
  if (file.size > 4 * 1024 * 1024) {
    alert("Le fichier ne doit pas dépasser 4Mo");
    return;
  }

  // Aperçu de l'image
  const reader = new FileReader();
  reader.onload = (e) => {
    const uploadPlaceholder = document.getElementById("uploadPlaceholder");
    const imagePreview = document.getElementById("imagePreview");
    const previewImg = document.getElementById("previewImg");

    uploadPlaceholder.classList.add("hidden");
    imagePreview.classList.remove("hidden");
    previewImg.src = e.target.result;

    // Vérifier la validation du formulaire
    validateForm();
  };
  reader.readAsDataURL(file);
};

// Fonction pour charger les catégories
const loadCategories = () => {
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      const categorySelect = document.getElementById("workCategory");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des catégories:", error);
    });
};

// Fonction pour valider le formulaire
const validateForm = () => {
  const imageInput = document.getElementById("imageInput");
  const workTitle = document.getElementById("workTitle");
  const workCategory = document.getElementById("workCategory");
  const validateBtn = document.getElementById("validateBtn");

  const hasImage = imageInput && imageInput.files.length > 0;
  const hasTitle = workTitle && workTitle.value.trim() !== "";
  const hasCategory = workCategory && workCategory.value !== "";

  if (hasImage && hasTitle && hasCategory) {
    validateBtn.disabled = false;
    validateBtn.classList.remove("disabled");
    validateBtn.classList.add("enabled");
  } else {
    validateBtn.disabled = true;
    validateBtn.classList.remove("enabled");
    validateBtn.classList.add("disabled");
  }
};

// Fonction pour soumettre le nouveau travail
const submitNewWork = () => {
  const imageInput = document.getElementById("imageInput");
  const workTitle = document.getElementById("workTitle");
  const workCategory = document.getElementById("workCategory");
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour ajouter une œuvre");
    return;
  }

  // Création du FormData
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", workTitle.value.trim());
  formData.append("category", parseInt(workCategory.value));

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    })
    .then((newWork) => {
      console.log("Nouveau travail ajouté:", newWork);

      // Ajouter le nouveau travail à la liste locale
      allWorks.push(newWork);

      // Mettre à jour la galerie principale
      displayWorks(allWorks);

      // Fermer la modale et afficher un message de succès
      modal.classList.add("hidden");
      alert("Votre projet a été ajouté avec succès !");
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de l'ajout du projet. Veuillez réessayer.");
    });
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
          allWorks = allWorks.filter((work) => work.id !== workId);
          console.log(`Travail ${workId} supprimé localement.`);

          // Mettre à jour les deux galeries
          displayWorks(allWorks);
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
