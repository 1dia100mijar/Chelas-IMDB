//Module that contais and manages the user data
const NUM_GRUPS = 3

let groupIdx = 0

let groups = new Array(NUM_GRUPS).fill(0, 0, NUM_GRUPS)
    .map( _ => { 
        return {
            "id": groupIdx,
            "userId": 0,
            "title": "titleTest"+groupIdx,
            "description": "descriptionTest"+groupIdx++,
            "movies": []
        } 
    })

export async function createGroup(userId, title, description,){
    let newGroup = {
        "id": groupIdx++,
        "userId": userId,
        "title": title,
        "description": description,
        "movies": []
    }
    groups.push(newGroup)
    return newGroup
}

export async function editGroup(groupId, title, description){
    let group = groups.find(group => group.id == groupId)
    group.title = title
    group.description = description
    return group
}

export async function listGroups(userId){
    return groups.filter(group => group.userId == userId)
}

export async function deleteGroup(userId, groupId){
    return findGroupsAndDoSomething(userId, groupId, 
        (group, groupIdx) => {
            groups.splice(groupIdx, 1)
            return group
        })
}

export async function getGroupDetails(groupId){
    let group = groups.find(group => group.id == groupId)
    let duration= 0
    let movies = []
    let moviesIdx = 0
    group.movies.forEach(movie => {
        duration += Number(movie.duration),
        movies[moviesIdx++] = {
            "title": movie.title,
            "id": movie.id
        }
    })
    return {"id": groupId,
            "title": group.title,
            "description": group.description,
            "movies": movies,
            "duration": duration
            }
}

export async function addMovie(userId, groupId, movie){
    let group = groups.find(group => group.id == groupId)
    if(group != undefined && group.userId == userId){
        group.movies[group.movies.length] = movie
    }
    return movie
}

export async function removeMovie(userId, groupId, movieId){
    let group = groups.find(group => group.id == groupId)
    let movieIdx = group.movies.findIndex(movie => movie.id == movieId)
    let movie = group.movies[movieIdx]
    group.movies.splice(movieIdx, 1)
    
    return movie
}


function findGroupsAndDoSomething(userId, groupId, action) {
    const groupIdx = groups.findIndex(group => group.id == groupId && group.userId == userId)
    const group = groups[groupIdx]
    if(groupIdx != -1) {
        return action(group, groupIdx)
    } 
}

export async function findUserIdOfGroup(groupId){
    const group = groups.find(group => group.id == groupId)
    if(!group) return undefined
    return group.userId
}
export async function checkMovieInUserGroup(groupId, movieId){
    let group = groups.find(group => group.id == groupId)
    let movie = group.movies.find(movie => movie.id == movieId)
    if(movie == undefined) return false
    return true
}
