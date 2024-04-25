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
    if (!classesContainer) {
        console.error('Élément avec ID "classes" non trouvé.');
        return;
    }
    classesContainer.innerHTML = ''; // Effacer le contenu précédent

    classes.forEach(classURI => {
        const button = document.createElement('button');
        button.textContent = getClassLabel(classURI); // Afficher le nom de la classe pour l'utilisateur
        button.id = getClassLabel(classURI); // Attribution d'un ID unique basé sur l'URI de la classe
        button.addEventListener('click', () => {
            // Appeler la fonction pour récupérer et afficher les sous-classes de la classe sélectionnée
            getSubClasses(classURI); // Passer l'URI de la classe
        });
        classesContainer.appendChild(button);
    });    
}

// Fonction pour extraire le nom de la classe à partir de l'URI
function getClassLabel(uri) {
    // Remplacer les caractères spéciaux pour obtenir un ID valide
    const id = uri.replace(/[^\w\s]/gi, '_');
    return id;
}

// Fonction pour récupérer et afficher toutes les classes
function getAllClasses() {
    // Construire la requête SPARQL SELECT pour récupérer toutes les classes
    const sparqlQuery = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT DISTINCT ?class
    WHERE {
      ?class a owl:Class .
      FILTER NOT EXISTS {
        ?class rdfs:subClassOf ?superClass .
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
            const classes = bindings.map(binding => binding.class.value); // Ne pas extraire le nom, mais conserver l'URI
            // Afficher les classes récupérées
            displayClasses(classes);
        } else {
            throw new Error('Réponse de la requête SPARQL SELECT invalide');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération et de l\'affichage des classes:', error);
    });
}

// Fonction pour récupérer et afficher les sous-classes d'une classe donnée
function getSubClasses(classURI) {
    // Construire la requête SPARQL SELECT pour récupérer les sous-classes de la classe donnée
    const sparqlQuery = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?subClass
    WHERE {
      ?subClass rdfs:subClassOf* <${classURI}> .
      FILTER (?subClass != <${classURI}>)
    }
    `;

    // Endpoint SPARQL
    const sparqlEndpoint = 'http://localhost:3030/SUDAFRICA/query';

    // Envoyer la requête SPARQL SELECT et traiter les résultats
    fetchSPARQLQuery(sparqlEndpoint, sparqlQuery)
    .then(data => {
        if (data && data.results && data.results.bindings) {
            const bindings = data.results.bindings;
            const subClasses = bindings.map(binding => binding.subClass.value); // Conserver l'URI des sous-classes
            // Afficher les sous-classes de la classe sélectionnée
            displaySubClasses(classURI, subClasses);
        } else {
            console.error('Aucune sous-classe trouvée pour la classe :', classURI);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération et de l\'affichage des sous-classes de la classe :', classURI, error);
    });
}


// Fonction pour afficher les sous-classes d'une classe donnée
// Fonction pour afficher les sous-classes d'une classe donnée
function displaySubClasses(className, subClasses) {
    // Trouver l'élément de la classe sélectionnée
    const selectedClassButton = document.getElementById(getClassLabel(className));
    if (!selectedClassButton) {
        console.error('Classe non trouvée :', className);
        return;
    }

    // Vérifier s'il existe des sous-classes
    if (subClasses.length === 0) {
        console.log('La classe', className, 'n\'a pas de sous-classes.');
        return;
    }

    // Créer un conteneur pour les sous-classes
    const subClassesContainer = document.createElement('div');
    subClassesContainer.classList.add('sub-classes-container');

    // Créer et afficher des boutons pour chaque sous-classe
    subClasses.forEach(subClass => {
        const subClassButton = document.createElement('button');
        subClassButton.textContent = getClassLabel(subClass); // Afficher le nom de la sous-classe pour l'utilisateur
        subClassButton.classList.add('sub-class-button');

        // Ajouter une animation d'apparition
        subClassButton.style.opacity = '0';
        subClassButton.style.transition = 'opacity 0.5s ease-in-out';

        // Ajouter un gestionnaire d'événements pour afficher les sous-classes de cette sous-classe
        subClassButton.addEventListener('click', () => {
            getSubClasses(subClass); // Passer l'URI de la sous-classe
        });

        // Ajouter la sous-classe au conteneur
        subClassesContainer.appendChild(subClassButton);
    });

    // Insérer le conteneur des sous-classes juste après le bouton de la classe parent
    selectedClassButton.parentNode.insertBefore(subClassesContainer, selectedClassButton.nextSibling);

    // Déclencher une réanimation pour afficher progressivement les sous-classes
    setTimeout(() => {
        subClassesContainer.querySelectorAll('.sub-class-button').forEach(subClassButton => {
            subClassButton.style.opacity = '1';
        });
    }, 100);
}



// Exécuter la fonction pour récupérer et afficher toutes les classes lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément lien
    const showClassesLink = document.getElementById('show-classes');

    // Ajout d'un gestionnaire d'événements au clic sur le lien
    showClassesLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du lien
        // Appeler la fonction pour récupérer et afficher toutes les classes
        getAllClasses();
    });
});
