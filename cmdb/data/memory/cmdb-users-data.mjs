import crypto from "crypto"

const NUM_USERS = 2
let userIdx = 0

let users = new Array(NUM_USERS).fill(0, 0, NUM_USERS)
    .map( _ => { 
        return {
            "id": userIdx++,
            "token": "3e5ea6df-26e4-4f59-bf78-23ccd1714b92" //crypto.randomUUID()
        } 
    })

users[1].token = crypto.randomUUID()

export function createUser(){
    let user = {
        "id": userIdx++,
        "token": crypto.randomUUID()
    }
    users.push(user)
    return user
}

export async function createUserWeb(email, password, username){
    let user = {
        "id": userIdx++,
        "token": crypto.randomUUID(),
        "email": email,
        "username": username,
        "password": password
    }
    users.push(user)
    return user
}

export async function validateLogin(username, password){
    const user = users.find(user => user.username == username)
    if(user == undefined) return false
    else if(user.password == password){
        return user
    }
    return false
}

export async function getUserByToken(token){
    return users.find(user => user.token == token)
}

export async function listUsers(){
    return users
}

export function checkUsernameInUse(username){
    const user = users.find(user => user.username == username)
    if(user) return true
    return false
}
export function checkEmailInUse(email){
    const user = users.find(user => user.email == email)
    if(user) return true
    return false
}