document.addEventListener('DOMContentLoaded', function() {
    const sparqlForm = document.getElementById('sparql-form');
    const sparqlResults = document.getElementById('sparql-results');

    if (sparqlForm && sparqlResults) { // Vérifier si les éléments existent avant d'ajouter des écouteurs d'événements
        sparqlForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

            // Récupérer le type d'opération (SELECT, INSERT, DELETE)
            const operation = document.getElementById('operation-input').value.toUpperCase();

            // Déterminer l'URL de l'endpoint en fonction du type d'opération
            let sparqlEndpoint;
            if (operation === 'SELECT') {
                sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';
            } else if (operation === 'INSERT' || operation === 'DELETE') {
                sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/update';
            } else {
                console.error('Type d\'opération non valide.');
                return; // Arrêter l'exécution si le type d'opération n'est pas valide
            }

            // Récupérer la requête SPARQL saisie par l'utilisateur
            const query = document.getElementById('query-input').value;

            // Envoyer la requête SPARQL au serveur Jena pour traitement
            sendSparqlQuery(query, sparqlEndpoint);
        });
    }

    // Fonction pour envoyer la requête SPARQL au serveur Jena
    function sendSparqlQuery(query, sparqlEndpoint) {
        // Paramètres de la requête HTTP POST
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'query=' + encodeURIComponent(query),
        };

        // Envoyer la requête au serveur Jena
        fetch(sparqlEndpoint, params)
        .then(response => response.json())
        .then(data => {
            // Afficher les résultats de la requête SPARQL
            displaySparqlResults(data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'exécution de la requête SPARQL:', error);
        });
    }

    // Fonction pour afficher les résultats de la requête SPARQL
    function displaySparqlResults(results) {
        // Afficher les résultats dans la section des résultats
        sparqlResults.innerHTML = JSON.stringify(results);
    }
});
