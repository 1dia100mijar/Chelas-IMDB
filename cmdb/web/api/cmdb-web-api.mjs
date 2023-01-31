// implementation of the HTTP routes that make up the REST API of the web application
import httpErrors from '../errors-http.mjs'
import handlerRequestnit from '../cmdb-handleResquest.mjs'
const handleRequest = handlerRequestnit(sendError, sendResponse, getToken)
const REAL_FETCH_FLAG = 1
export default function(services){

    return {
        getTop250: handleRequest(internalGetTop250),
        createGroup: handleRequest(internalCreateGroup),
        searchMovies: handleRequest(internalsearchMovies),
        getMovieDetails: handleRequest(internalgetMovieDetails),
        updateGroup: handleRequest(internalUpdateGroup),
        listGroups: handleRequest(internalListGroups),
        deleteGroup: handleRequest(internalDeleteGroup),
        listGroup: handleRequest(internalListGroup),
        addMovie: handleRequest(internalAddMovie),
        deleteMovie: handleRequest(internalDeleteMovie),
        addUser: internalAddUser,
        listUsers: handleRequest(internalListUsers)
    }

    async function internalGetTop250(req, rsp){
        return await services.getTop250(req.query.limit, REAL_FETCH_FLAG)
    }
    async function internalsearchMovies(req, rsp){
        return await services.searchMovies(req.params.name,req.query.limit, REAL_FETCH_FLAG)
    }
    async function internalgetMovieDetails(req, rsp){
        return await services.getMovieDetails(req.body.movieId, REAL_FETCH_FLAG)
    }
    async function internalCreateGroup(req, rsp){
        rsp.status(201)
        return await services.createGroup(req.token, req.body)
    }
    async function internalUpdateGroup(req, rsp){
        return await services.editGroup(req.token, req.params.id, req.body.title, req.body.description)
    }
    async function internalListGroups(req, rsp){
        return await services.listGroups(req.token)
    }
    async function internalDeleteGroup(req, rsp){
        return await services.deleteGroup(req.token, req.params.id)
    }
    async function internalListGroup(req, rsp){
       return await services.getGroupDetails(req.token, req.params.id)
    }
    async function internalAddMovie(req, rsp){
        rsp.status(201)
        return await services.addMovie(req.token, req.params.groupId, req.body.movieId, REAL_FETCH_FLAG)
    }
    async function internalDeleteMovie(req, rsp){
       return await services.removeMovie(req.token, req.params.id, req.body.movieId)
    }
    async function internalAddUser(req, rsp){
        rsp.status(201).json(await services.createUser())
    }
    async function internalListUsers(req, rsp){
        return await services.listUsers()
    }
}

function getToken(req, rsp) {
    const BEARER_STR = "Bearer "
    const tokenHeader = req.get("Authorization")
    if (!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
        rsp
            .status(401)
            .json({ error: `Invalid authentication token` })
        return
    }
    return tokenHeader.split(" ")[1]
}
function sendResponse(obj, rsp) {
    rsp.json(obj)
}

function sendError(error, rsp) {
    rsp.json(error)
}