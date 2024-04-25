// Fonction pour envoyer une requête SPARQL INSERT à Jena
function sendSPARQLInsertRequest(sparqlQuery) {
    return fetch('http://localhost:3030/SUDAFRICA/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-update',
        },
        body: sparqlQuery,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête SPARQL INSERT');
        }
        console.log('Requête SPARQL INSERT réussie');
    })
    .catch(error => {
        console.error('Erreur lors de l\'exécution de la requête SPARQL INSERT:', error);
        throw error; // Rejeter l'erreur pour la traiter dans la fonction appelante
    });
}

// Fonction pour soumettre le formulaire et ajouter un plat dans Jena
function submitForm() {
    // Récupérer les valeurs depuis le formulaire
    const nom = document.getElementById('plat_nom').value;
    const description = document.getElementById('plat_description').value;
    const imageUrl = document.getElementById('plat_image_url').value;
    const region = document.getElementById('plat_region').value;
    const technique = document.getElementById('plat_technique').value;

    // Vérifier si toutes les données requises sont présentes
    if (!nom || !description || !imageUrl || !region || !technique) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Construire la requête SPARQL INSERT
    const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        INSERT DATA
        {
            _:foodInstance rdf:type ont:FoodComponent .

            ont:${nom.replace(/\s+/g, '_')} rdf:type ont:dishes ;
                         ont:estPrepareAvec ont:${technique.replace(/\s+/g, '_')} ;
                         ont:isFrom ont:${region.replace(/\s+/g, '_')} ;
                         ont:description "${description}"^^xsd:string ;
                         ont:nom "${nom}"^^xsd:string ;
                         ont:hasImage "${imageUrl}"^^xsd:string ;
                         ont:estComposeDe _:foodInstance .
        }
    `;

    // Exécuter la requête SPARQL INSERT
    sendSPARQLInsertRequest(sparqlQuery)
    .then(() => {
        alert('Plat ajouté avec succès !');
        document.getElementById('add-dish-form').reset(); // Réinitialiser le formulaire après l'ajout
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du plat:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    });
}
