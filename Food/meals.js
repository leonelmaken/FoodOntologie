document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer et afficher tous les plats
    function getAllMeals() {
        const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
        
        SELECT DISTINCT ?nom ?description ?technique ?origine ?image
        WHERE {
          ?element rdf:type ont:Foods ;
                   ont:hasImage ?image .
          OPTIONAL { ?element ont:nom ?nom }
          OPTIONAL { ?element ont:description ?description }
          OPTIONAL { ?element ont:estPrepareAvec ?technique }
          OPTIONAL { ?element ont:isFrom ?origine }
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

                    const detailsButton = document.createElement('a');
                    detailsButton.classList.add('btn', 'btn-primary');
                    detailsButton.href = '#'; // Ajoutez le lien de détails ici
                    detailsButton.textContent = 'Details';
                    cardBody.appendChild(detailsButton);

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

    // Ajouter un gestionnaire d'événements pour le lien "All Foods"
    const showMealsLink = document.getElementById('show-meals');
    showMealsLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        getAllMeals(); // Appeler la fonction pour récupérer et afficher tous les plats
    });
});
