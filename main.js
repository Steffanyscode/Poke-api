const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const LIMIT = 20;

const container = document.getElementById("Pokemons-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentPage = 1;
let totalPages = 50; 

async function getPokemons(page = 1) {
    const offset = (page - 1) * LIMIT;
    const url = `${BASE_URL}?limit=${LIMIT}&offset=${offset}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener lista: ${response.status} ${response.statusText}`);

        const data = await response.json();

        const detailedData = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if (!res.ok) throw new Error(`Error al obtener datos de ${pokemon.name}`);
                return res.json();
            })
        );

        renderPokemons(detailedData);
        updateButtons();
    } catch (error) {
        container.innerHTML = `<p> Error al obtener Pokémon: ${error.message}</p>`;
    }
}

function renderPokemons(pokemonArray) {
    container.innerHTML = "";

    pokemonArray.forEach(pokemon => {
        const types = pokemon.types.map(t => t.type.name).join(', ');

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img class="character-image" src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            <h2>${pokemon.name}</h2>
            <p>⚖️ Peso: ${pokemon.weight}</p>
            <p>📏 Altura: ${pokemon.height}</p>
            <p>💥 Experiencia base: ${pokemon.base_experience}</p>
            <p>🔥 Tipos: ${types}</p>
        `;
        container.appendChild(card);
    });
}

function updateButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getPokemons(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        getPokemons(currentPage);
    }
});

getPokemons();
