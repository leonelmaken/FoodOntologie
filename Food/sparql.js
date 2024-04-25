document.addEventListener('DOMContentLoaded', function() {
    const sparqlForm = document.getElementById('sparql-form');
    const sparqlResults = document.getElementById('sparql-results');

    if (sparqlForm && sparqlResults) {
        sparqlForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

            // Récupérer le type d'opération (SELECT, INSERT, DELETE)
            const operation = document.getElementById('operation-input').value.toUpperCase();

            // Récupérer la requête SPARQL saisie par l'utilisateur
            const query = document.getElementById('query-input').value;

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

            // Envoyer la requête SPARQL au serveur Jena pour traitement
            sendSparqlQuery(query, sparqlEndpoint, operation);
        });
    }

    // Fonction pour envoyer la requête SPARQL au serveur Jena
    function sendSparqlQuery(query, sparqlEndpoint, operation) {
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
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Erreur lors de la requête SPARQL : ' + response.statusText);
            }
        })
        .then(data => {
            // Afficher un message approprié en fonction de la réponse reçue
            if (operation === 'DELETE') {
                sparqlResults.innerHTML = '<p class="text-success">Suppression effectuée avec succès</p>';
            } else if (operation === 'INSERT') {
                sparqlResults.innerHTML = '<p class="text-success">Insertion effectuée avec succès</p>';
            } else {
                // Si c'est une opération SELECT, afficher les résultats normalement
                displaySparqlResults(data.results.bindings, query);
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'exécution de la requête SPARQL:', error);
            sparqlResults.innerHTML = '<p class="text-danger">Erreur lors de l\'exécution de la requête SPARQL</p>';
        });
    }

    // Fonction pour afficher les résultats de la requête SPARQL dans un tableau HTML
    function displaySparqlResults(results, query) {
        // Assurez-vous que les résultats ne sont pas vides
        if (results && results.length > 0) {
            // Extraire les variables sélectionnées dans la requête SPARQL
            const variables = extractVariables(query);
            
            // Créer une chaîne HTML pour construire le tableau avec des classes Bootstrap
            let tableHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-bordered table-striped">
                                <thead class="thead-dark">
                                    <tr>
            `;
            
            // Construire les en-têtes du tableau avec les variables sélectionnées
            variables.forEach(variable => {
                tableHTML += `<th style="color: blue;">${variable}</th>`;
            });
            
            // Fermer la balise de l'en-tête du tableau
            tableHTML += '</tr></thead><tbody>';
            
            // Remplir le corps du tableau avec les données
            results.forEach(row => {
                tableHTML += '<tr>';
                // Pour chaque objet dans le tableau de résultats, ajouter une ligne au tableau avec les valeurs des variables sélectionnées
                variables.forEach(variable => {
                    // Vérifier si la propriété existe avant d'y accéder
                    if (row[variable]) {
                        tableHTML += `<td>${row[variable].value}</td>`; // Utiliser .value pour obtenir la valeur réelle de la liaison
                    } else {
                        tableHTML += '<td>-</td>'; // Remplacer par un tiret ou une valeur par défaut si la propriété est undefined
                    }
                });
                tableHTML += '</tr>';
            });
            
            // Fermer la balise du corps du tableau
            tableHTML += '</tbody></table></div></div></div>';
            
            // Afficher le tableau dans la section des résultats
            sparqlResults.innerHTML = tableHTML;
        } else {
            sparqlResults.innerHTML = '<p class="text-warning">Aucun résultat trouvé</p>';
        }
    }
    

    // Fonction pour analyser la requête SPARQL et extraire les variables sélectionnées
    function extractVariables(query) {
        const selectIndex = query.indexOf('SELECT') + 6; // Trouver l'index du mot "SELECT"
        const whereIndex = query.indexOf('WHERE'); // Trouver l'index du mot "WHERE"
        const variablesString = query.substring(selectIndex, whereIndex).trim(); // Extraire la partie entre "SELECT" et "WHERE"
        const variables = variablesString.split('?').filter(Boolean).map(v => v.trim()); // Séparer les variables et les nettoyer

        return variables;
    }
});
