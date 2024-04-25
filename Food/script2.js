// Fonction pour exécuter une requête SPARQL UPDATE
function executeSPARQLUpdate(sparqlQuery) {
    return fetch('http://localhost:3030/SUDAFRICA/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-update',
        },
        body: sparqlQuery,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête SPARQL UPDATE');
        }
        console.log('Requête SPARQL UPDATE réussie');
    })
    .catch(error => {
        console.error('Erreur lors de l\'exécution de la requête SPARQL UPDATE:', error);
    });
}

// Fonction pour ajouter un ingrédient dans Jena
function addIngredient() {
    // Récupérer les valeurs depuis le formulaire
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const origin = document.getElementById('origin').value;
    const season = document.getElementById('season').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const nutrient = document.getElementById('nutrient').value;

    // Vérifier si tous les champs sont remplis
    if (!name || !description || !origin || !season || !imageUrl || !nutrient) {
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
        _:ingredientInstance rdf:type ont:FoodIngredient .
    
        ont:${name.replace(/\s+/g, '_')} rdf:type ont:Ingredient ;
            ont:nom "${name}"^^xsd:string ;
            ont:description "${description}"^^xsd:string ;
            ont:hasImage "${imageUrl}"^^xsd:string ;
            ont:origine "${origin}"^^xsd:string ;
            ont:saison "${season}"^^xsd:string ;
            ont:estComposeDe _:ingredientInstance .
    }
    
    `;

    // Exécuter la requête SPARQL INSERT
    executeSPARQLUpdate(sparqlQuery)
    .then(() => {
        alert('Ingrédient ajouté avec succès !');
        document.getElementById('ingredient-form').reset(); // Réinitialiser le formulaire après l'ajout
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de l\'ingrédient:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    });
}

// Ajouter un écouteur d'événement pour le formulaire
document.addEventListener('DOMContentLoaded', function() {
    const addIngredientButton = document.getElementById('add-ingredient-btn');
    if (addIngredientButton) {
        addIngredientButton.addEventListener('click', function(event) {
            event.preventDefault();
            addIngredient(); // Appel de la fonction pour ajouter l'ingrédient
        });
    } else {
        console.error('Le bouton "add-ingredient-btn" n\'a pas été trouvé dans le DOM.');
    }
});
