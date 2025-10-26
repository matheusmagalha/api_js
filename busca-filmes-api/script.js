// ⚠️ IMPORTANTE: Substitua "SEU_API_KEY_AQUI" pela sua chave de API da OMDb
// Você recebeu a chave no seu e-mail: falecomigojoaopaulo@gmail.com
// Exemplo: const OMDB_API_KEY = "abc12345xyz";

const OMDB_API_KEY = "abbc890f";
const OMDB_API_URL = "https://www.omdbapi.com/";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const moviesGrid = document.getElementById("moviesGrid");
const errorMessage = document.getElementById("errorMessage");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const resultsInfo = document.getElementById("resultsInfo");

let currentMovies = [];
let totalResults = 0;

searchForm.addEventListener("submit", handleSearch);
searchInput.addEventListener("input", () => {
    errorMessage.style.display = "none";
});

async function handleSearch(event) {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        moviesGrid.innerHTML = "";
        emptyState.style.display = "block";
        errorMessage.style.display = "none";
        resultsInfo.style.display = "none";
        return;
    }

    if (OMDB_API_KEY === "SEU_API_KEY_AQUI") {
        showError("⚠️ Não encontrado!");
        moviesGrid.innerHTML = "";
        emptyState.style.display = "none";
        return;
    }

    await searchMovies(query);
}

async function searchMovies(query) {
    try {
        showLoading(true);
        hideError();
        moviesGrid.innerHTML = "";
        emptyState.style.display = "none";
        resultsInfo.style.display = "none";
        const response = await fetch(
            `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
        );

        if (!response.ok) {
            throw new Error("Erro ao conectar com a API");
        }

        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            currentMovies = data.Search;
            totalResults = parseInt(data.totalResults || "0");
            displayMovies(currentMovies);
            showResultsInfo(currentMovies.length, totalResults);
        } else if (data.Response === "False") {
            showError(data.Error || "Nenhum filme encontrado");
            emptyState.style.display = "none";
        } else {
            showError("Erro ao buscar filmes. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro:", error);
        showError("Erro de conexão com a API. Verifique sua chave de API.");
    } finally {
        showLoading(false);
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = "";

    movies.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const posterHTML =
        movie.Poster && movie.Poster !== "N/A"
            ? `<img src="${movie.Poster}" alt="${movie.Title}" loading="lazy">`
            : `<div class="movie-poster-placeholder">Sem pôster disponível</div>`;

    card.innerHTML = `
        <div class="movie-poster">
            ${posterHTML}
        </div>
        <div class="movie-info">
            <h2 class="movie-title">${escapeHtml(movie.Title)}</h2>
            <p class="movie-meta">${movie.Year} • ${movie.Type}</p>
            <a 
                href="https://www.imdb.com/title/${movie.imdbID}/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="movie-link"
            >
                Ver no IMDb →
            </a>
        </div>
    `;

    return card;
}

function showResultsInfo(displayedCount, total) {
    resultsInfo.style.display = "block";
    resultsInfo.textContent = `Mostrando ${displayedCount} de ${total} resultados`;
}

function showError(message) {
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
}

function hideError() {
    errorMessage.style.display = "none";
}

function showLoading(isLoading) {
    loadingState.style.display = isLoading ? "flex" : "none";
    searchButton.disabled = isLoading;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    // Verificar se a chave de API está configurada
    if (OMDB_API_KEY === "SEU_API_KEY_AQUI") {
        console.warn(
            "⚠️ Chave de API não configurada. Por favor, abra o arquivo script.js e insira sua chave na linha 9."
        );
    }
    searchInput.focus();
});
