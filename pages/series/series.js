const apiKey = "bcc9273e9851f58686fedf85973c8de9";
const apiBaseUrl = "https://api.themoviedb.org/3";	
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";
const language = document.documentElement.lang;

const main = async () => {
    const nowPlayingUrlSerie = `${apiBaseUrl}/tv/on_the_air?api_key=${apiKey}&language=${language}`;
    const nowPlayingSeries = await fetchUrl(nowPlayingUrlSerie);
    const nowPlayingSeriesEl = document.querySelector("#series-container");
    createMovieList(nowPlayingSeries, nowPlayingSeriesEl);
}

const fetchUrl = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results;
    } catch (e) {
        console.log(e);
    }
}

const createImageUrl = (url) => {
    if (!url.poster_path) {
        const FALLBACK_IMAGE_URL = "https://via.placeholder.com/300x450" + "?text=Image+Not+Found";
        return `
            <img src=${FALLBACK_IMAGE_URL} />
        `;
    }
    return `
        <img src="${imageBaseUrl}${url.poster_path}" />
    `;
}

const createMovieList = (movies, element) => {
    movies.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("item");
        movieEl.innerHTML = createImageUrl(movie);
        let year = movie.release_date || movie.first_air_date;
        let date = new Date(year);
        let ano = date.getFullYear();
        movieEl.innerHTML += `
            <div class="overlay-year">
                <span>
                    ${ano}
                </span>
            </div>
        `;
        movieEl.innerHTML += `
            <div class="overlay-title">
                <h3>${movie.title || movie.name}</h3>
            </div>
        `;
        movieEl.addEventListener("click", () => {
            window.location.href = `../../movie/movie.html?id=${movie.id}&type=${movie.title ? "movie" : "serie"}`;
            console.log(movie.id);
        });
        element.appendChild(movieEl);
    });
}

main();

document.querySelector('#btnNav').addEventListener('click', event => {
    document.querySelector('#menuNav').classList.toggle('active');
});

function searchMovie() {
    let search = document.getElementById('search-movie').value;
    window.location.href = `../../search/search.html`+`?search=${search}`;
}