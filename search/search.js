const apiKey = "bcc9273e9851f58686fedf85973c8de9";
const apiBaseUrl = "https://api.themoviedb.org/3";	
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

const fetchUrl = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.results;
    } catch (e) {
        console.log(e);
    }
}

const main = async () => {
    const search = new URLSearchParams(window.location.search).get("search");
    const searchUrl = `${apiBaseUrl}/search/multi?api_key=${apiKey}&language=en-US&query=${search}&page=1&include_adult=false`;
    const searchResults = await fetchUrl(searchUrl);
    const searchResultsEl = document.querySelector("#result-search");
    createMovieList(searchResults, searchResultsEl);
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
            window.location.href = `../movie/movie.html?id=${movie.id}&type=${movie.title ? "movie" : "serie"}`;
            console.log(movie.id);
        });
        element.appendChild(movieEl);
    });
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

main();