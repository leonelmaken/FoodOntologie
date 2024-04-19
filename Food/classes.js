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

// Fonction pour afficher les classes dans la section dédiée
function displayClasses(classes) {
    const classesContainer = document.getElementById('classes');
    classesContainer.innerHTML = ''; // Effacer le contenu précédent

    classes.forEach(className => {
        const button = document.createElement('button');
        button.textContent = className;
        button.addEventListener('click', () => {
            // Vous pouvez ajouter une action lorsque le bouton est cliqué
            console.log('Classe sélectionnée :', className);
        });
        classesContainer.appendChild(button);
    });
}

// Fonction pour récupérer et afficher toutes les classes
function getAllClasses() {
    // Construire la requête SPARQL SELECT pour récupérer toutes les classes
    const sparqlQuery = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>

        SELECT DISTINCT ?className
        WHERE {
          {
            ?class rdf:type owl:Class .
            BIND(STRAFTER(str(?class), "#") AS ?className)
          } UNION {
            ?subclass rdfs:subClassOf ?class .
            ?subclass rdf:type owl:Class .
            FILTER(?subclass != ?class)
            BIND(STRAFTER(str(?subclass), "#") AS ?className)
          }
        }
    `;

    // Endpoint SPARQL
    const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

    // Envoyer la requête SPARQL SELECT et traiter les résultats
    fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
    .then(data => {
        if (data && data.results && data.results.bindings) {
            const bindings = data.results.bindings;
            const classes = bindings.map(binding => binding.className.value);
            displayClasses(classes);
        } else {
            throw new Error('Réponse de la requête SPARQL SELECT invalide');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération et de l\'affichage des classes:', error);
    });
}

// Exécuter la fonction pour récupérer et afficher toutes les classes lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément lien
    const showClassesLink = document.getElementById('show-classes');

    // Ajout d'un gestionnaire d'événements au clic sur le lien
    showClassesLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        getAllClasses(); // Appeler la fonction pour récupérer et afficher toutes les classes
    });
});
