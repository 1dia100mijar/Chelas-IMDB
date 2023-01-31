// Module that contains the functions that handle all HTTP APi requests.
// Handle HTTP request means:
//  - Obtain data from requests. Request data can be obtained from: URI(path, query, fragment), headers, body
//  - Invoke the corresponding operation on services
//  - Generate the response in HTML format

import url from 'url'
import httpErrors from '../errors-http.mjs'
import handlerRequestnit from '../cmdb-handleResquest.mjs'
const handleRequest = handlerRequestnit(sendError, sendResponse, getToken)

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const REAL_FETCH_FLAG = 1

function View(name, data) {
    this.name = name
    this.data = data
}

export default function (services) {

    return {
        getHomeUnauthenticated: getHomeUnauthenticated,
        getHome: handleRequest(getHome),
        getCss: getCss,
        login: login,
        signIn: signIn,
        loginValidation: internalLoginValidation,
        signinValidation: internalSigninValidation,
        logout: logout,
        listGroups: handleRequest(internalListGroups),
        top250Movies: handleRequest(getTop250Internal),
        getMovieDetails: handleRequest(getMovieDetailsInternal),
        listGroup: handleRequest(internalListGroup),
        createGroupForm: handleRequest(internalCreateGroupForm),
        createGroup: internalCreateGroup,
        editGroupFrom: handleRequest(internalEditGroupFrom),
        editGroup: internalEditGroup,
        deleteGroup: internalDeleteGroup,
        searchMovies: searchMoviesInternal,
        getsearchMovies: handleRequest(getsearchMoviesInternal),
        addMoviePage: handleRequest(InternalAddMoviePage),
        addMovie: InternalAddMovie,
        deleteMovie: internalDeleteMovie
    }

    async function getHomeUnauthenticated(req, rsp) {
        return rsp.render("home.hbs", {})
    }
    async function getHome(req, rsp) {
        return new View("home.hbs", {})
    }
    async function getCss(req, rsp) {
        return rsp.sendFile(__dirname + 'resources/site.css')
    }
    async function login(req, rsp) {
        return rsp.render("login.hbs", {})
    }
    async function signIn(req, rsp) {
        return rsp.render("sign-in.hbs", {})
    }
    async function internalListGroups(req, rsp){
        const groups = await services.listGroups(req.token)
        let obj = {title: "All groups", groups: groups}
        if(groups.length == 0) obj.erro = "Não tem grupos"
        return new View('groups', {token: req.token, obj: obj})
    }

    async function getTop250Internal(req, rsp) {
        const limit = req.query.limit
        const top250Movies = await services.getTop250(limit, REAL_FETCH_FLAG)
        return new View ('Top250Movies', {title: "Top250", movies: top250Movies})
    }

    async function getMovieDetailsInternal(req, rsp) {
        const movieId = req.params.id
        const movie = await services.getMovieDetails(movieId, REAL_FETCH_FLAG)
        return new View ('movie', movie)
    }

    async function searchMoviesInternal(req, rsp) {
        const name = req.body.name
        rsp.redirect(`/movies/search/${name}`)
    }

    async function getsearchMoviesInternal(req, rsp) {
        const name = req.params.name
        const movies = await services.searchMovies(name, 10, REAL_FETCH_FLAG)
        return new View ('searchMovie', {title: "MovieSearch", movies:movies})
    }

    async function InternalAddMoviePage(req, rsp) {
        const groups = await services.listGroups(req.token)
        return new View('addMovie', {title: "All groups", groups: groups, movieId: req.params.movieId})
    }

    async function InternalAddMovie(req, rsp) {
        const groupId = req.params.groupId
        const movieId = req.params.movieId
        try {
            const movie = await services.addMovie(getToken(req), groupId, movieId, REAL_FETCH_FLAG)
            rsp.redirect(`/groups/${groupId}`)
        } catch (e) {
            sendError(e, rsp, req.user)
        }
    }

    async function internalListGroup(req, rsp){
        const group = await services.getGroupDetails(req.token, req.params.id)
        return new View("group", {token: req.token, group: group})
    }

    async function internalCreateGroupForm(req, rsp){
        return new View("createGroup.hbs", {})
    }

    async function internalCreateGroup(req, rsp){
        try {
            await services.createGroup(getToken(req), req.body)
            rsp.redirect('/groups')
        } catch (e) {
            sendError(e, rsp, req.user)
        }
    }
    async function internalEditGroupFrom(req, rsp){
        const group = await services.getGroupDetails(getToken(req), req.params.id)
        return new View("editGroup.hbs", {token: req.token, group:group})
    }

    async function internalEditGroup(req, rsp){
        try {
            await services.editGroup(getToken(req), req.params.id, req.body.title, req.body.description)
            rsp.redirect('/groups')
        } catch (e) {
            sendError(e, rsp, req.user)
        }
    }
    
    async function internalDeleteMovie(req, rsp){
        const groupId = req.params.id
        await services.removeMovie(getToken(req), groupId, req.body.movieId)
        rsp.redirect(`/groups/${groupId}`)
    }

    async function internalDeleteGroup(req, rsp){
        await services.deleteGroup(getToken(req), req.params.id)
        rsp.redirect('/groups')
    }
    async function internalLoginValidation(req, rsp){
        let login = await services.validateLogin(req.body.username, req.body.password)
        if(!login){
            let aux = {
                erro: "Credênciais de log in inválidas",
                username: req.body.username
            }
            rsp.render('login', aux)
        }
        else{
            const user ={
                username: req.body.username,
                password: req.body.password,
                token: login.token,
                id: login.id,
                email: login.email
            }
            req.login(user, () => rsp.redirect("/home"))        
        }
    }
    async function internalSigninValidation(req, rsp){
        const user = await services.createUserWeb(req.body.email,req.body.username, req.body.password, req.body.passwordConfirmation)
        if(user.erro){
            rsp.render("sign-in", user)
        }
        else rsp.redirect("login")
    }
    function logout(req, rsp) {
        req.logout((err) => { 
            rsp.redirect('/')
        })
        
    }
}


function getToken(req) {
    try{
        return req.user.token
    }catch (e){

    }
}

function sendResponse(view, rsp) {
    rsp.render(view.name, view.data)
}

function sendError(error, rsp, user) {
    if(user){
        rsp.render("error", {error: error, user: user})
    }
    else rsp.render('error', {error: error})
}
