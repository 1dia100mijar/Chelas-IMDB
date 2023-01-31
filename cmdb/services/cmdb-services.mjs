// implementation of the logic of each of the application's functionalities

import errors from '../errors.mjs'

export default function(cmdbData, cmdbUser, movieData){
    if(!cmdbData){
        throw errors.INVALID_PARAMETER(cmdbData)
    }
    if(!cmdbUser){
        throw errors.INVALID_PARAMETER(cmdbUser)
    }
    if(!movieData){
        throw errors.INVALID_PARAMETER(movieData)
    }

    return {
        getTop250: getTop250,
        searchMovies: searchMovies,
        getMovieDetails: getMovieDetails,
        createGroup: createGroup,
        createUser: createUser,
        editGroup: editGroup,
        listGroups: listGroups,
        deleteGroup: deleteGroup,
        getGroupDetails: getGroupDetails,
        addMovie: addMovie,
        removeMovie: removeMovie,
        listUsers: listUsers,
        createUserWeb: createUserWeb,
        validateLogin: validateLogin
    }

    async function getTop250(limit, flagFetch){
        let lim = limit
        if (!limit) lim = 250 
        if (limit > 250 || limit < 0) throw errors.INVALID_PARAMETER(limit, "limit must be a number between 0 and 250")
        return await movieData.getTop250(lim, flagFetch)
    }

    async function searchMovies(name, limit, flagFetch){
        let lim = limit
        if (!limit) lim = 250 
        if (limit > 250 || limit < 0) throw errors.INVALID_PARAMETER(limit, "limit must be a number between 0 and 250")
        if (!isValidString(name)) throw errors.INVALID_PARAMETER('name', 'name must be a string with value')
        return await movieData.searchMovies(name, lim, flagFetch)
    }
    
    async function getMovieDetails(movieId, flagFetch){
        return await movieData.getMovieDetails(movieId, flagFetch)
    }

    async function createGroup(token, rspBody){
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(!isValidString(rspBody.title)) throw errors.INVALID_PARAMETER('title', 'title must be a string with value')
        if(!isValidString(rspBody.description)) throw errors.INVALID_PARAMETER('description', 'description must be a string with value')
        return await cmdbData.createGroup(user.id, rspBody.title, rspBody.description)
    }

    async function createUser(){
        return await cmdbUser.createUser()
    }
    async function listUsers(){
        return await cmdbUser.listUsers()
    }

    async function editGroup(token, groupId, title, description){
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(Number(groupId) == NaN) throw errors.INVALID_PARAMETER('id', 'groupId must be a number')
        const groupUserId = await cmdbData.findUserIdOfGroup(groupId)   
        if(groupUserId == undefined) throw errors.GROUP_NOT_FOUND(groupId)
        if(groupUserId != user.id) throw errors.PERMISSION_DENIED(groupId)
        if(!isValidString(title)) throw errors.INVALID_PARAMETER('title', 'title must be a string with value')
        if(!isValidString(description)) throw errors.INVALID_PARAMETER('description', 'description must be a string with value')
        return await cmdbData.editGroup(groupId, title, description)
    }

    async function listGroups(token){
        const user = await cmdbUser.getUserByToken(token)
        if(!user){
            throw errors.USER_NOT_FOUND()
        }
        return await cmdbData.listGroups(user.id)
    }
    async function deleteGroup(token, groupId){
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(Number(groupId) == NaN) throw errors.INVALID_PARAMETER('id', 'groupId must be a number')
        const groupUserId = await cmdbData.findUserIdOfGroup(groupId)    
        if(groupUserId == undefined) throw errors.GROUP_NOT_FOUND(groupId)
        if(groupUserId != user.id) throw errors.PERMISSION_DENIED(groupId)
        return await cmdbData.deleteGroup(user.id, groupId)
    }

    async function getGroupDetails(token, groupId){
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(Number(groupId) == NaN) throw errors.INVALID_PARAMETER('id', 'groupId must be a number') 
        const groupUserId = await cmdbData.findUserIdOfGroup(groupId)    
        if(groupUserId == undefined) throw errors.GROUP_NOT_FOUND(groupId)
        if(groupUserId != user.id) throw errors.PERMISSION_DENIED(groupId)
        return await cmdbData.getGroupDetails(groupId)
    }

    async function addMovie(token, groupId, movieId, flagFetch){ 
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(Number(groupId) == NaN) throw errors.INVALID_PARAMETER('id', 'groupId must be a number')
        const groupUserId = await cmdbData.findUserIdOfGroup(groupId)    
        if(groupUserId == undefined) throw errors.GROUP_NOT_FOUND(groupId)
        if(groupUserId != user.id) throw errors.PERMISSION_DENIED(groupId) 
        const movie = await movieData.addMovie(movieId, flagFetch)
        if(await cmdbData.checkMovieInUserGroup(groupId, movieId)) throw errors.MOVIE_ALREADY_IN_GROUP(groupId)
        return await cmdbData.addMovie(user.id, groupId, movie)
    }

    async function removeMovie(token, groupId, movieId){
        const user = await cmdbUser.getUserByToken(token)
        if(!user) throw errors.USER_NOT_FOUND()
        if(Number(groupId) == NaN) throw errors.INVALID_PARAMETER('id', 'groupId must be a number') 
        const groupUserId = await cmdbData.findUserIdOfGroup(groupId)    
        if(groupUserId == undefined) throw errors.GROUP_NOT_FOUND(groupId)
        if(groupUserId != user.id) throw errors.PERMISSION_DENIED(groupId)
        if(! await cmdbData.checkMovieInUserGroup(groupId, movieId)) throw errors.MOVIE_NOT_FOUND(groupId, movieId)
        return await cmdbData.removeMovie(user.id, groupId, movieId)
    }

    function isValidString(value) {
        return typeof(value) == 'string' && value != ""
    }

    async function createUserWeb(email, username, password, passwordConfirmation){
        const invalidUsername = await cmdbUser.checkUsernameInUse(username)
        if(invalidUsername){
            return {erro: "Username inválido", email: email, username: username}
        }
        const invalidEmail = await cmdbUser.checkEmailInUse(email)
        if(invalidEmail){
            return {erro: "Email inválido", email: email, username: username}
        }
        if(password != passwordConfirmation){
            return {erro: "Passwords não coincidem", email: email, username: username}
        }
        return await cmdbUser.createUserWeb(email, password, username)
    }
    async function validateLogin(username, password){
        return await cmdbUser.validateLogin(username, password)
    }

}