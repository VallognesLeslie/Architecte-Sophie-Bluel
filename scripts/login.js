console.log("Fichier JS charger");

// ## Compte de test pour Sophie Bluel
// sophie.bluel@test.tld    S0phie

//récupère le formulaire
const loginForm = document.getElementById("loginForm");

//écoute le clic sur "Se connecter"
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche l'envoi automatique du formulaire
  console.log("Formulaire");

  // Récupère les champs email et mot de passe
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log("E-mail saisie :", email);

  // requête (format JSON)
  const loginData = {
    email: email,
    password: password,
  };

  //envoie la requête POST vers l'API
  fetch("http://localhost:5678/api/users/login", {
    method: "POST", // On envoie des données
    headers: {
      "Content-Type": "application/json", // Type des données envoyées
    },
    body: JSON.stringify(loginData), // Transforme les données en chaîne JSON
  })
    .then((response) => {
      //si l'utilisateur n'existe pas ou erreur = affiche un message
      if (response.status === 404 || response.status === 401) {
        displayLoginError(); // Appelle une fonction d’erreur
        return null;
      }
      //si tout est ok = on passe à la suite
      return response.json();
    })

    .then((data) => {
      if (data) {
        //stocke le token dans le navigateur
        localStorage.setItem("token", data.token);

        //recharge la page principale
        if (window.opener && !window.opener.closed) {
          window.opener.location.reload();
        }

        //ferme la popup
        window.close();
      }
    })
    .catch((error) => {
      console.error("Erreur de connexion :", error);
      displayLoginError(); //en cas de problème technique
    });
});

// Fonction pour afficher un message d’erreur simple
const displayLoginError = () => {
  // vérifie si un message existe déjà
  const existingError = document.getElementById("login-error");
  if (!existingError) {
    const errorMessage = document.createElement("p");
    errorMessage.id = "login-error";
    errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
    errorMessage.style.color = "red";
    errorMessage.style.marginTop = "30px";

    // Ajoute le message sous le formulaire
    loginForm.appendChild(errorMessage);
  }
};
//   exercice mentor
//  ________1_____________
// const tonNom = prompt("Quelle est ton nom");
// console.log(`Bonjour ${tonNom} !`);

//  ________2_____________
// const donneUnNombre = Number(prompt("Donne un chiffre entre 1 et 10"));
