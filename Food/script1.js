function searchMeal() {
    const mealName = document.getElementById('search-bar').value;

    const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?ingredient ?technique ?region ?description ?image
        WHERE {
            ?plat rdf:type ont:Foods ;
                  ont:nom "${mealName}"^^xsd:string ;
                  ont:estComposeDe ?ingredient ;
                  ont:estPrepareAvec ?technique ;
                  ont:isFrom ?region ;
                  ont:description ?description ;
                  ont:hasImage ?image .
        }
    `;

    executeSPARQLQuery(sparqlQuery, displayMealDetails);
}

function addMeal() {
    const newMealName = document.getElementById('newMealName').value;

    const sparqlQuery = `
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        INSERT DATA
        {
            ont:Plat3 rdf:type ont:Foods ;
                     ont:nom "${newMealName}"^^xsd:string ;
                     ont:description "Description du nouveau plat"^^xsd:string ;
                     ont:hasImage <file:///home/leonelmaken/Documents/WebSemantique/Food/images/nouvelle_image.jpg> .
        }
    `;
    
    executeSPARQLUpdate(sparqlQuery);
}

function addIngredient() {
    const newIngredientName = document.getElementById('newIngredientName').value;

    const sparqlQuery = `
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        INSERT DATA
        {
            ont:${newIngredientName} rdf:type ont:Ingredient ;
                                  ont:nom "${newIngredientName}"^^xsd:string ;
                                  ont:description "Description du nouvel ingrédient"^^xsd:string ;
                                  ont:hasImage <file:///home/leonelmaken/Documents/WebSemantique/Food/images/nouvelle_image.jpg> .
        }
    `;
    
    executeSPARQLUpdate(sparqlQuery);
}

function displayClassHierarchy() {
    const sparqlQuery = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        SELECT DISTINCT ?class
        WHERE {
            ?class rdf:type owl:Class .
        }
    `;

    executeSPARQLQuery(sparqlQuery, displayClassResults);
}

function executeSPARQLQuery(query, callback) {
    fetch('http://localhost:3030/SUDAFRICA/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'query=' + encodeURIComponent(query),
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error('Error:', error));
}

function executeSPARQLUpdate(query) {
    fetch('http://localhost:3030/SUDAFRICA/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'update=' + encodeURIComponent(query),
    })
    .then(response => console.log('Update successful'))
    .catch(error => console.error('Error:', error));
}

// Récupérer le formulaire d'ajout d'ingrédient
const ingredientForm = document.getElementById('ingredient-form');

// Ajouter un gestionnaire d'événements pour l'événement "submit" du formulaire
ingredientForm.addEventListener('submit', function(event) {
    // Empêcher le comportement par défaut du formulaire qui est de soumettre les données
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const name = document.getElementById('name').value;
    const image = document.getElementById('image').value;
    const description = document.getElementById('description').value;
    const origin = document.getElementById('origin').value;
    const season = document.getElementById('season').value;
    const nutrient = document.getElementById('nutrient').value;

    // Construire la requête SPARQL INSERT pour insérer les données dans Jena
    const sparqlQuery = `
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ont: <http://www.co-ode.org/ontologies/ont.owl#>

        INSERT DATA
        {
            ont:${name} rdf:type ont:Ingredient ;
                                  ont:nom "${name}"^^xsd:string ;
                                  ont:description "${description}"^^xsd:string ;
                                  ont:image "${image}"^^xsd:string ;
                                  ont:origin "${origin}"^^xsd:string ;
                                  ont:season "${season}"^^xsd:string ;
                                  ont:nutrient "${nutrient}"^^xsd:string .
        }
    `;
    
    // Appeler la fonction pour exécuter la requête SPARQL INSERT
    executeSPARQLUpdate(sparqlQuery);

    // Réinitialiser le formulaire après soumission
    this.reset();
});

// Récupérer le bouton "Ajouter un ingrédient"
const addIngredientBtn = document.getElementById('add-ingredient-btn');

// Ajouter un gestionnaire d'événements au clic sur le bouton
addIngredientBtn.addEventListener('click', function() {
    // Rediriger l'utilisateur vers le formulaire de création d'ingrédient
    window.location.href = 'ingredient.html';
});

function displayMealDetails(data) {
    const resultsSection = document.getElementById('meal-results');

    // Parcourir les données des repas
    data.forEach(meal => {
        // Créer un élément HTML représentant le repas
        const mealCard = document.createElement('div');
        mealCard.classList.add('card');
        mealCard.innerHTML = `
            <img src="${meal.image}" class="card-img-top" alt="${meal.nom}">
            <div class="card-body">
                <h5 class="card-title">${meal.nom}</h5>
                <p class="card-text">${meal.description}</p>
            </div>
        `;
        // Ajouter l'élément à la section des résultats
        resultsSection.appendChild(mealCard);
    });
}

function displayClassResults(data) {
    const classHierarchy = document.getElementById('class-hierarchy');

    // Parcourir les données des classes
    data.forEach(className => {
        // Créer un élément HTML représentant la classe
        const classItem = document.createElement('li');
        classItem.textContent = className;

        // Ajouter l'élément à la liste des classes
        classHierarchy.appendChild(classItem);
    });
}
