var imdb_id = "";
var lastSeason = 0;

if(window.location.pathname === "/movie/movie.html") {
    const apiKey = "bcc9273e9851f58686fedf85973c8de9";
    const language = document.documentElement.lang;

    document.addEventListener("DOMContentLoaded", async () => {
        id = new URLSearchParams(window.location.search).get("id");
        type = new URLSearchParams(window.location.search).get("type");

        if(!id || !type) {
            window.location.href = "../index.html";
        } else if(type === 'serie') {
            type = 'tv';
        }
        console.log(id, type);
        const movie = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=${language}`);
        const data = await movie.json();
        console.log(data);
        imdb_id = data.imdb_id;
        document.querySelector('.movieTitle').innerText = data.title || data.name;
        let img = data.poster_path || data.backdrop_path;
        document.querySelector("#movieImg").src =  `http://image.tmdb.org/t/p/w300${img}`;
        let date = data.release_date || data.first_air_date;
        document.querySelector('#movieDesc').innerText = data.overview;
        document.querySelector('#movieGenre').innerText = data.genres.map(genre => genre.name).join(", ");
        document.querySelector('#movieRelease').innerText = date; 
        let credits = await fetch(castUrlCredits(type, id));
        let creditsProfilePath = await credits.json();
        console.log(credits);
        console.log(creditsProfilePath);
        document.querySelector('#movieCreditsProfile').innerHTML += creditsProfilePath.cast.map(cast =>{ 
            if (!cast.profile_path) return;    
            return `
                    <div class="castProfile">
                        <img src="http://image.tmdb.org/t/p/w300${cast.profile_path}" />
                        <p>${cast.name}</p>
                    </div>
                `;
            }).join("");
        
        if(type === 'tv') {
            document.querySelector('#moviePlayer').style.display = 'none';
            document.querySelector('#serie-container').innerHTML = 
            `<div class="dropdown" id="season-dropdown">
                <button class="dropbtn" onclick="seasonDropdown()">Seasons</button>
                <div class="dropdown-content" id="seasons">
                    ${data.seasons.map(season => {
                        document.querySelector('.episodes-container').innerHTML += `
                            <div id="episodes-s${season.season_number}"></div>
                        `;
                       return `
                        <button class="season" id="${season.season_number}" onclick="seasonEpisodes(${season.season_number})">${season.name}</button>
                       `;
                    }).join("")}
                </div>
                
            </div>
            `;
        }
    });

    function seasonDropdown() {
        let seasondrop = document.querySelector('.dropdown-content');
        if(seasondrop.style.display === 'flex') {
            seasondrop.style.display = 'none';
            return;
        }
        seasondrop.style.display = 'flex';
    }

    function seasonEpisodes(season) {
        if(lastSeason) document.querySelector('#episodes-s' + lastSeason).innerHTML = "";
        lastSeason = season;
        document.querySelector('.dropdown-content').style.display = 'none';
        let episodes = document.querySelector(`#episodes-s${season}`);
        if(!episodes) return;
    
        if(episodes.innerHTML) episodes.innerHTML = "";
        else if(!episodes.innerHTML) {
            fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}&language=${language}`).then(response => response.json())
            .then(data => {
                episodes.innerHTML = data.episodes.map(episode => {
                    return `
                        <div class="episode">
                            <img src="http://image.tmdb.org/t/p/w300${episode.still_path}" />
                            <div>
                                <p>EP ${episode.episode_number} ${episode.name}</p>
                                <button onclick="watchEpisode(${episode.episode_number})">Assista</button>
                            </div>
                        </div>
                    `;
                }).join("");
            });
        }
    }

    function castUrlCredits(type, id) {
        return `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=${language}`;
    }

    // PLAYER 
    function switchEmbed(url) {
        document.querySelector('.embed').src = url;
    }

    function getParamsByName(name) {
        let params = new URLSearchParams(window.location.search); 
        let type = params.get('type');
        let id = params.get('id');
        
        switch(name) {
            case 'vidsrc': 
                return type + '?tmdb=' + id;
            default:
                return;
        }
    }

    function getParamsByNameIMDb(name) {
        let params = new URLSearchParams(window.location.search); 
        let type = params.get('type');
        let id = params.get('id');
        console.log(imdb_id);
        if(type === 'serie') {
            switch(name) {
                case 'warezcdn':
                    return 'serie/' + imdb_id;
                case 'embedder':
                    return 'tv/' + imdb_id;
                default:
                    return;
            }
        } else {   
            switch(name) {
                case 'warezcdn':
                    return 'filme/' + imdb_id;
                case 'embedder':
                    return imdb_id;
                default:
                    return;
            }
        }
    }

    // BUTTONS SCROLL
    document.querySelector('.btn-prev').addEventListener('click', () => {
        document.querySelector('.scroll-container').scrollLeft -= 150;
    });

    document.querySelector('.btn-next').addEventListener('click', () => {
        document.querySelector('.scroll-container').scrollLeft += 150;
    });
}