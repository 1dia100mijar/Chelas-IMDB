const KEY_IMDB = "k_9ujbz6dc"

let movies = []
let movie = {}

export default function(fetch){
    return {
        getTop250: getTop250,
        searchMovies: searchMovies,
        addMovie: addMovie,
        getMovieDetails: getMovieDetails
    }

    async function fetchURL(URL, func, flagFetch) {
        try {
            const Response = await fetch(URL)
            let rsp
            if(flagFetch == 1){
                rsp = await Response.json()
            }
            else if(flagFetch == 0) {
                rsp = await JSON.parse(Response)
            }
            
            return func(rsp)
        }
        catch (error) {
            console.log(`Fetch error occurred ${error} `)
        }
    }

    // Get top 250 movies
    async function getTop250(limit, flagFetch) {
        try {
            movies = []
            const URL = `https://imdb-api.com/en/API/Top250Movies/${KEY_IMDB}`
            await fetchURL(URL, processResults, flagFetch)
            movies.length = limit
            return movies.map(selectFewerPropsTop250)
        }
        catch (error) {
            console.log(`getTop250Movies error occurred ${error} `)
        }
    }
    

    // put top 250 movies in global array
    function processResults(obj) {
        movies = obj.items
        return movies
    }

    function selectFewerPropsTop250(movie){
        const {id, title, rank, imDbRating} = movie;
        return {id, title, rank, imDbRating};
    }

    // Search movie by name
    async function searchMovies(name, limit, flagFetch) {
        movies = []
        const URL = `https://imdb-api.com/en/API/SearchMovie/${KEY_IMDB}/${name}`
        await fetchURL(URL, putMovies, flagFetch)
        movies.length = limit
        return movies.map(selectFewerPropsSearch)
    }

    // put searched movies in global array
    function putMovies(obj) {
        movies = obj.results
        return movies
    }

    function selectFewerPropsSearch(movie){
        const {id, title, description} = movie;
        return {id, title, description};
    }

    // add movie to group by id
    async function addMovie(movieId, flagFetch) {
        movie = {}
        const URL = `https://imdb-api.com/en/API/Title/${KEY_IMDB}/${movieId}`
        await fetchURL(URL, addMovieToGroup, flagFetch)
        return {id: movie.id, title: movie.title, duration: movie.runtimeMins}
    }

    // put searched movies in global array
    function addMovieToGroup(obj) {
        movie = obj
        return movie
    }
    
    // returns details of a movie
    async function getMovieDetails(movieId, flagFetch) {
        movie = {}
        const URL = `https://imdb-api.com/en/API/Title/${KEY_IMDB}/${movieId}`
        await fetchURL(URL, addMovieToGroup, flagFetch)
        return {id: movie.id, imdbRating : movie.imDbRating, title: movie.title, description: movie.plot,
             image_URL: movie.image, duration: movie.runtimeMins, directors: movie.directors, actors: movie.actorList.map(m => m.name)
            }
    }
}
