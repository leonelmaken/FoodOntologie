document.addEventListener("DOMContentLoaded", function() {
    let menu = document.querySelector('#menu-bars');
    let navbar = document.querySelector('.navbar');
    let searchIcon = document.querySelector('#search-icon');
    let searchForm = document.querySelector('#search-form');
    let closeButton = document.querySelector('#close');

    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            menu.classList.toggle('active');
            navbar.classList.toggle('active');
        }
    }

    window.onscroll = () => {
        if (menu) {
            menu.classList.remove('fa-times');
            navbar.classList.remove('active');
        }
    }

    if (searchIcon) {
        searchIcon.onclick = () => {
            if (searchForm) {
                searchForm.classList.toggle('active');
            }
        }
    }

    if (closeButton) {
        closeButton.onclick = () => {
            if (searchForm) {
                searchForm.classList.remove('active');
            }
        }
    }

    var swiper = new Swiper(".home-slider", {
        spaceBetween: 40,
        centeredSlides: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
    });

    const form = document.querySelector('#add-dish-form');

    
    let ingredientCounter = 1;

    function addIngredient() {
        ingredientCounter++;
        const newIngredientGroup = document.createElement('div');
        newIngredientGroup.innerHTML = `
            <div class="form-group">
                <label for="ingredient_${ingredientCounter}_nom">Nom de l'ingrédient:</label>
                <input type="text" id="ingredient_${ingredientCounter}_nom" name="ingredient_${ingredientCounter}_nom" required>
                <input type="file" id="ingredient_${ingredientCounter}_image" name="ingredient_${ingredientCounter}_image" accept="image/*" required>
            </div>
        `;
        document.getElementById('moreIngredients').appendChild(newIngredientGroup);
    }
});
