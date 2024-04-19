// Fonction pour récupérer et afficher tous les ingrédients
function getAllIngredients() {
    // Construction de la requête SPARQL SELECT pour récupérer tous les ingrédients
    const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        SELECT DISTINCT ?nom ?image ?description ?saison
        WHERE {
            ?ingredient rdf:type ont:Ingredient ;
                        ont:hasImage ?image ;
                        ont:nom ?nom ;
                        ont:description ?description ;
                        ont:saison ?saison .
        }
    `;

    // Endpoint SPARQL
    const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

    // Container pour afficher les ingrédients
    const ingredientsContainer = document.getElementById('ingredient-cards');

    // Envoyer la requête SPARQL SELECT et traiter les résultats
    fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
        .then(data => {
            if (data && data.results && data.results.bindings) {
                const bindings = data.results.bindings;
                // Parcours des résultats et création des cartes Bootstrap pour chaque ingrédient
                bindings.forEach(binding => {
                    const ingredientCard = document.createElement('div');
                    ingredientCard.classList.add('card', 'food-card');

                    const ingredientImage = document.createElement('img');
                    ingredientImage.src = binding.image.value;
                    ingredientImage.classList.add('card-img-top');
                    ingredientCard.appendChild(ingredientImage);

                    const ingredientCardBody = document.createElement('div');
                    ingredientCardBody.classList.add('card-body');

                    const ingredientTitle = document.createElement('h3');
                    ingredientTitle.textContent = binding.nom.value;
                    ingredientTitle.classList.add('card-title');
                    ingredientCardBody.appendChild(ingredientTitle);

                    const ingredientDescription = document.createElement('p');
                    ingredientDescription.textContent = binding.description.value;
                    ingredientDescription.classList.add('card-text');
                    ingredientCardBody.appendChild(ingredientDescription);

                    ingredientCard.appendChild(ingredientCardBody);

                    // Ajout de l'événement de survol avec une animation
                    ingredientCard.addEventListener('mouseenter', function() {
                        ingredientCard.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
                    });
                    ingredientCard.addEventListener('mouseleave', function() {
                        ingredientCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    });

                    ingredientsContainer.appendChild(ingredientCard);
                });
            } else {
                throw new Error('Réponse de la requête SPARQL SELECT invalide');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération et de l\'affichage des ingrédients:', error);
        });
}

// Exécuter la fonction pour récupérer et afficher tous les ingrédients lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément lien
    const showIngredientsLink = document.getElementById('show-nutrients');

    // Ajout d'un gestionnaire d'événements au clic sur le lien
    showIngredientsLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        getAllIngredients(); // Appeler la fonction pour récupérer et afficher tous les ingrédients
    });
});
