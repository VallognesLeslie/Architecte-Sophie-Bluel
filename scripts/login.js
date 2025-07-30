//récupère le formulaire
const loginForm = document.getElementById("loginForm");

//écoute le clic sur "Se connecter"
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche l'envoi automatique du formulaire

  // Récupère les champs email et mot de passe
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
    body: JSON.stringify(loginData), // Transforme les données en chaîne JSON c’est obligatoire ici car le serveur attend un corps de requête de type JSON
  })
    .then((response) => {
      //si l'utilisateur n'existe pas ou erreur = affiche un message
      if (response.status === 404 || response.status === 401) {
        displayLoginError("Erreur dans l’identifiant ou le mot de passe"); // Appelle une fonction d’erreur
        return null;
      }
      //si tout est ok = on passe à la suite
      return response.json();
    })

    .then((data) => {
      if (data) {
        // Supprime un ancien token si jamais il existe
        localStorage.removeItem("token");

        // Stocke le nouveau token de connexion
        localStorage.setItem("token", data.token);

        // Redirige vers la page d'accueil
        window.location.href = "index.html";
      }
    }) // Message d’erreur si back coupé
    .catch((error) => {
      console.error("Erreur de connexion au serveur :", error);
      displayLoginError(
        "Le serveur est inaccessible. Merci de réessayer plus tard."
      );
    });
});

// Fonction pour afficher un message d’erreur
const displayLoginError = (errorMessage) => {
  // Supprime un ancien message s’il existe
  let errorMessageDom = document.getElementById("login-error");
  if (!errorMessageDom) {
    errorMessageDom = document.createElement("p");
    errorMessageDom.id = "login-error";
    errorMessageDom.style.color = "red";
    errorMessageDom.style.margin = "30px 0 20px 0";
    errorMessageDom.style.textAlign = "center";
    errorMessageDom.style.fontStyle = "italic";
    errorMessageDom.style.fontSize = "20px";

    // Insertion juste avant le bouton "Se connecter"
    loginForm.parentNode.insertBefore(errorMessageDom, loginForm);
  }

  errorMessageDom.textContent =
    errorMessage || "Impossible de se connecter, merci de réessayer plus tard.";
};
