// Fonction pour envoyer une requête SPARQL SELECT à Jena
function sendSPARQLSelectRequest(sparqlQuery) {
    return fetch('http://localhost:3030/SUDAFRICA/query', {
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
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        SELECT DISTINCT ?class
        WHERE {
          ?class rdf:type owl:Class .
        }
    `;

    // Envoyer la requête SPARQL SELECT et traiter les résultats
    sendSPARQLSelectRequest(sparqlQuery)
    .then(data => {
        const bindings = data.results.bindings;
        const classes = bindings.map(binding => binding.class.value);
        displayClasses(classes);
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
