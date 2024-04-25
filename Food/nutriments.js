document.addEventListener('DOMContentLoaded', function() {
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

                        // Ajout de l'icône de suppression
                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
                        deleteIcon.addEventListener('click', function() {
                            deleteIngredient(binding.nom.value); // Appeler la fonction de suppression de l'ingrédient
                        });
                        ingredientCardBody.appendChild(deleteIcon);

                        // Ajout de l'icône d'édition
                        const editIcon = document.createElement('i');
                        editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
                        editIcon.addEventListener('click', function() {
                            editIngredient(binding.nom.value); // Appeler la fonction pour éditer l'ingrédient
                        });
                        ingredientCardBody.appendChild(editIcon);

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

    // Fonction pour supprimer un ingrédient
    function deleteIngredient(nomIngredient) {
        const sparqlQuery = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

            DELETE WHERE {
              ?ingredient rdf:type ont:Ingredient ;
                          ont:nom "${nomIngredient}"^^xsd:string ;
                          ont:description ?description ;
                          ont:hasImage ?image .
            }
        `;
        
        const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/update';

        // Configuration de la requête fetch avec la méthode POST
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-update'
            },
            body: sparqlQuery // Corps de la requête contenant la requête SPARQL
        };

        // Envoi de la requête fetch
        fetch(sparqlEndpoint, fetchOptions)
        .then(response => {
            // Vérification de la réponse HTTP
            if (!response.ok) {
                throw new Error('La requête SPARQL DELETE a échoué.');
            }
            console.log(`L'ingrédient "${nomIngredient}" a été supprimé avec succès.`);
            getAllIngredients(); // Recharger la liste des ingrédients après la suppression
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'ingrédient:', error);
        });
    }

    // Fonction pour éditer un ingrédient
    function editIngredient(nomIngredient) {
        // Ajoutez ici le code pour l'édition de l'ingrédient
        console.log(`Édition de l'ingrédient "${nomIngredient}".`);
    }

    // Ajouter un gestionnaire d'événements pour le lien "Show Ingredients"
    const showIngredientsLink = document.getElementById('show-nutrients');
    showIngredientsLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        getAllIngredients(); // Appeler la fonction pour récupérer et afficher tous les ingrédients
    });
});
