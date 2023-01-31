import fs from 'node:fs/promises'

export default function(API_KEY){
    const data = {
       [`https://imdb-api.com/en/API/Top250Movies/${API_KEY}`] : fs.readFile(`./cmdb/testes/top250.json`, "utf8"),
       [`https://imdb-api.com/en/API/SearchMovie/${API_KEY}/Inception 2010`] : fs.readFile(`./cmdb/testes/inception_search.json`, "utf8"),
       [`https://imdb-api.com/en/API/Title/${API_KEY}/tt3227032`] : fs.readFile(`./cmdb/testes/inception_2010.json`, "utf8"),
       [`https://imdb-api.com/en/API/Title/${API_KEY}/tt0110413`] : fs.readFile(`./cmdb/testes/leon.json`, "utf8")
    }
    return async function(uri){
        return await data[uri]
    }
}
