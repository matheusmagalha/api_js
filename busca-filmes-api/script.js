const CHAVE_API = "76d63d853416bc5b157f41b86df795c7";
const URL_BASE = "https://api.themoviedb.org/3";
const URL_IMAGEM = "https://image.tmdb.org/t/p/w500";

const formularioBusca = document.getElementById("formularioBusca");
const campoBusca = document.getElementById("campoBusca");
const gradeFilmes = document.getElementById("gradeFilmes");


formularioBusca.addEventListener("submit", (e) => {
    e.preventDefault();
    const consulta = campoBusca.value.trim();
    if (consulta) {
        buscarFilmes(consulta);
    }
});

async function buscarFilmes(consulta) {
    try {
        const resposta = await fetch(`${URL_BASE}/search/movie?api_key=${CHAVE_API}&query=${consulta}&language=pt-BR`);
        const dados = await resposta.json();
        exibirFilmes(dados.results);
    } catch (erro) {
        console.error("Erro ao buscar filmes:", erro);
    }
}


function exibirFilmes(filmes) {
    gradeFilmes.innerHTML = ""; 

    if (filmes.length === 0) {
        gradeFilmes.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }

    filmes.forEach((filme) => {
        const cartaoFilme = document.createElement("div");
        cartaoFilme.classList.add("cartao-filme");

        const posterFilme = filme.poster_path
            ? `<img src="${URL_IMAGEM}${filme.poster_path}" alt="${filme.title}">`
            : `<div class="cartao-poster-placeholder">Sem imagem</div>`;

        cartaoFilme.innerHTML = `
            ${posterFilme}
            <h2 class="titulo-filme">${filme.title}</h2>
            <p class="meta-filme">${filme.release_date ? filme.release_date.split("-")[0] : "Ano desconhecido"}</p>
        `;

        gradeFilmes.appendChild(cartaoFilme);
    });
}