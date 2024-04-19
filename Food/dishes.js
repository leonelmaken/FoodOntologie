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
    });
}

// Fonction pour soumettre le formulaire et ajouter un plat dans Jena
// Fonction pour soumettre le formulaire et ajouter un plat dans Jena
function submitForm() {
    // Récupérer les valeurs depuis le formulaire
    const nom = document.getElementById('plat_nom').value;
    const description = document.getElementById('plat_description').value;
    const imageFile = document.getElementById('plat_image').files[0];
    const region = document.getElementById('plat_region').value;
    const technique = document.getElementById('plat_technique').value;
    const ingredients = document.getElementById('plat_ingredients').value;

    // Vérifier si toutes les données requises sont présentes
    if (!nom || !description || !imageFile || !region || !technique || !ingredients) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Convertir l'image en base64 pour l'inclure dans la requête
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function() {
        const base64Image = reader.result.split(',')[1];

        // Construire la requête SPARQL INSERT
        const sparqlQuery = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

            INSERT DATA
            {
                _:foodInstance rdf:type ont:Foods .

                ont:${nom.replace(/\s+/g, '_')} rdf:type ont:Foods ;
                         ont:estPrepareAvec ont:${technique.replace(/\s+/g, '_')} ;
                         ont:isFrom ont:${region.replace(/\s+/g, '_')} ;
                         ont:description "${description}"^^xsd:string ;
                         ont:nom "${nom}"^^xsd:string ;
                         ont:hasImage <${base64Image}> ;
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
    };
}
