document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément lien
    const showPeopleLink = document.getElementById('show-people');

    // Ajout d'un gestionnaire d'événements au clic sur le lien
    showPeopleLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        getAllPeople(); // Appeler la fonction pour récupérer et afficher toutes les personnes
    });
});

// Fonction pour récupérer et afficher toutes les personnes
function getAllPeople() {
    // Construire la requête SPARQL SELECT pour récupérer toutes les personnes
    const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        SELECT ?person ?nom ?image
        WHERE {
            ?person rdf:type ont:Person ;
                    ont:nom ?nom ;
                    ont:hasImage ?image .
        }
    `;

    // Endpoint SPARQL
    const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

    // Envoyer la requête SPARQL SELECT et traiter les résultats
    fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
    .then(data => {
        if (data && data.results && data.results.bindings) {
            const bindings = data.results.bindings;
            const people = bindings.map(binding => ({
                person: binding.person.value,
                nom: binding.nom.value,
                image: binding.image.value
            }));
            displayPeople(people);
        } else {
            throw new Error('Réponse de la requête SPARQL SELECT invalide');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération et de l\'affichage des personnes:', error);
    });
}

// Fonction pour afficher les personnes dans la section dédiée
function displayPeople(people) {
    const personContainer = document.getElementById('person-cards');
    personContainer.innerHTML = ''; // Effacer le contenu précédent

    people.forEach(person => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${person.image}" class="card-img-top" alt="${person.nom}">
            <div class="card-body">
                <h5 class="card-title">${person.nom}</h5>
                <p class="card-text">Description de la personne...</p>
            </div>
        `;
        personContainer.appendChild(card);
    });
}

// Fonction pour envoyer une requête SPARQL SELECT à Jena
function fetchSPARQLQuery(endpoint, sparqlQuery) {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
        },
        body: sparqlQuery,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête SPARQL SELECT');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erreur lors de l\'exécution de la requête SPARQL SELECT:', error);
        throw error; // Propage l'erreur pour une gestion ultérieure
    });
}
