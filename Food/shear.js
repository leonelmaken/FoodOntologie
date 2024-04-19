document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément bouton de recherche
    const searchButton = document.getElementById('search-button');

    // Ajout d'un gestionnaire d'événements au clic sur le bouton de recherche
    searchButton.addEventListener('click', function() {
        const searchTerm = document.getElementById('search-bar').value.trim(); // Récupérer le terme de recherche
        if (searchTerm !== '') {
            searchInJena(searchTerm); // Appeler la fonction pour effectuer la recherche dans Jena
        }
    });

    // Récupérer l'élément de la barre de recherche
    const searchBar = document.getElementById('search-bar');

    // Ajouter un écouteur d'événements pour détecter les changements dans la barre de recherche
    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.trim(); // Récupérer le terme de recherche
        if (searchTerm === '') {
            resetSearchResults(); // Réinitialiser les résultats si la barre de recherche est vide
        }
    });
});

// Fonction pour effectuer la recherche dans Jena avec le terme spécifié
function searchInJena(searchTerm) {
    // Construction de la requête SPARQL SELECT en fonction du terme de recherche
    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    SELECT ?nom ?description ?image
    WHERE {
      {
        ?person rdf:type ont:Person ;
                ont:nom ?nom ;
                ont:hasImage ?image .
        FILTER (STR(?nom) = "${searchTerm}"^^xsd:string)
      }
      UNION
      {
        ?plat rdf:type ont:Foods ;
              ont:nom ?nom ;
              ont:description ?description ;
              ont:hasImage ?image .
        FILTER (STR(?nom) = "${searchTerm}"^^xsd:string)
      }
      UNION
      {
        ?ingredient rdf:type ont:Ingredient ;
                   ont:nom ?nom ;
                   ont:hasImage ?image .
        FILTER (STR(?nom) = "${searchTerm}"^^xsd:string)
      }
    }
    `;

    // Endpoint SPARQL
    const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

    // Envoyer la requête SPARQL SELECT et afficher les résultats
    fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
    .then(data => {
        if (data && data.results && data.results.bindings) {
            const bindings = data.results.bindings;
            if (bindings.length > 0) {
                const searchResults = bindings.map(binding => ({
                    nom: binding.nom.value,
                    description: binding.description ? binding.description.value : 'Aucune description disponible',
                    image: binding.image.value
                }));
                displaySearchResults(searchResults);
            } else {
                console.log('Aucun résultat trouvé pour la recherche :', searchTerm);
                resetSearchResults(); // Réinitialiser les résultats si aucune correspondance n'est trouvée
            }
        } else {
            throw new Error('Réponse de la requête SPARQL SELECT invalide');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la recherche dans Jena:', error);
        resetSearchResults(); // Réinitialiser les résultats en cas d'erreur
    });
}

// Fonction pour afficher les résultats de la recherche dans des cartes Bootstrap avec des animations box-shadow attrayantes
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('meal-results');
    resultsContainer.innerHTML = ''; // Effacer le contenu précédent

    results.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('card', 'result-card');
        card.innerHTML = `
            <img src="${result.image}" alt="${result.nom}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${result.nom}</h5>
                <p class="card-text">${result.description}</p>
            </div>
        `;
        resultsContainer.appendChild(card);

        // Ajouter l'animation box-shadow au survol de la carte
        card.addEventListener('mouseenter', function() {
            card.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Fonction pour réinitialiser les résultats de la recherche
function resetSearchResults() {
    const resultsContainer = document.getElementById('meal-results');
    resultsContainer.innerHTML = ''; // Effacer le contenu précédent
}
