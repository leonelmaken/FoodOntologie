document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer et afficher tous les plats
    function getAllMeals() {
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?plat ?nom ?description ?image ?origine
        WHERE {
          ?plat rdf:type ont:dishes ;
           ont:nom ?nom ;
           ont:description ?description ;
           ont:hasImage ?image .
        OPTIONAL {
        ?plat ont:isFrom ?origine .
        }
        }
        `;
        
        const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

        fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
        .then(data => {
            if (data && data.results && data.results.bindings) {
                const foodCardsContainer = document.querySelector('#food-section .card-columns');
                foodCardsContainer.innerHTML = ''; // Effacer le contenu précédent

                const foodBindings = data.results.bindings;
                foodBindings.forEach(food => {
                    const foodCard = document.createElement('div');
                    foodCard.classList.add('food-card');

                    const img = document.createElement('img');
                    img.src = food.image.value;
                    img.classList.add('card-img-top');
                    foodCard.appendChild(img);

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const title = document.createElement('h3');
                    title.classList.add('card-title');
                    title.textContent = food.nom.value;
                    cardBody.appendChild(title);

                    const description = document.createElement('p');
                    description.classList.add('card-text');
                    description.textContent = food.description.value;
                    cardBody.appendChild(description);

                    const actionIcons = document.createElement('div');
                    actionIcons.classList.add('action-icons');

                    // Ajout de l'icône de suppression
                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
                    deleteIcon.addEventListener('click', function() {
                        deleteMeal(food.nom.value); // Appeler la fonction de suppression du plat
                    });
                    actionIcons.appendChild(deleteIcon);

                    // Ajout de l'icône d'édition
                    const editIcon = document.createElement('i');
                    editIcon.classList.add('fas', 'fa-edit', 'edit-icon');
                    // Ajouter un gestionnaire d'événements pour l'édition du plat
                    editIcon.addEventListener('click', function() {
                        editMeal(food.nom.value); // Appeler la fonction pour éditer le plat
                    });
                    actionIcons.appendChild(editIcon);

                    cardBody.appendChild(actionIcons);
                    foodCard.appendChild(cardBody);
                    foodCardsContainer.appendChild(foodCard);
                });
            } else {
                throw new Error('Réponse de la requête SPARQL SELECT invalide');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération et de l\'affichage des plats:', error);
        });
    }

    // Fonction pour supprimer un plat
    function deleteMeal(nomPlat) {
        const sparqlQuery = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
            DELETE WHERE {
              ?plat rdf:type ont:dishes ;
                    ont:nom "${nomPlat}"^^xsd:string ;
                    ont:description ?description ;
                    ont:hasImage ?image .
            }
        `;
        
        const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/update';
    
        // Définition de l'en-tête Content-Type pour spécifier le format des données
        const headers = {
            'Content-Type': 'application/sparql-update'
        };
    
        // Configuration de la requête fetch avec la méthode POST
        const fetchOptions = {
            method: 'POST',
            headers: headers,
            body: sparqlQuery // Corps de la requête contenant la requête SPARQL
        };
    
        // Envoi de la requête fetch
        fetch(sparqlEndpoint, fetchOptions)
        .then(response => {
            // Vérification de la réponse HTTP
            if (!response.ok) {
                throw new Error('La requête SPARQL DELETE a échoué.');
            }
            console.log(`Le plat "${nomPlat}" a été supprimé avec succès.`);
            getAllMeals(); // Recharger la liste des plats après la suppression
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du plat:', error);
        });
    }
    

    // Fonction pour éditer un plat
    function editMeal(nomPlat) {
        // Ajoutez ici le code pour l'édition du plat
        console.log(`Édition du plat "${nomPlat}".`);
    }

    // Ajouter un gestionnaire d'événements pour le lien "All Foods"
    const showMealsLink = document.getElementById('show-meals');
    showMealsLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du
// Empêcher le comportement par défaut du lien
        getAllMeals(); // Appeler la fonction pour récupérer et afficher tous les plats
    });
});
