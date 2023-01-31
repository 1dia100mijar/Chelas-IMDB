import fetch from "node-fetch"
import crypto from "crypto"

const ELASTICSEARCH_HOST = 'http://localhost:9200';

export async function createUser() {
  const userId = await getNextUserId()
  const user = {
    id: userId,
    token: crypto.randomUUID()
  };
  await fetch(`${ELASTICSEARCH_HOST}/users/_doc/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  await updateUserId(userId)
  return user;
}

export async function createUserWeb(email, password, username) {
  const userId = await getNextUserId()
  const user = {
    id: userId,
    token: crypto.randomUUID(),
    email: email,
    password: password,
    username: username
  }
  await fetch(`${ELASTICSEARCH_HOST}/users/_doc/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  await updateUserId(userId)
  return user;
}

  async function getNextUserId() {
    const response = await fetch(`${ELASTICSEARCH_HOST}/users/_doc/userIdx`, {
      method: 'GET'
    });
    const result = await response.json();
    return result._source.userIdx;
  }

  async function updateUserId(userId){
    await fetch(`${ELASTICSEARCH_HOST}/users/_doc/userIdx`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          "userIdx": ++userId
      })
    })
  }

export async function validateLogin(username, password) {
  try {
    const response = await fetch(`${ELASTICSEARCH_HOST}/users/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "query": {
          "bool": {
            "must": [
              { "term": { "username": `${username}` } },
              { "term": { "password": `${password}` } }
            ]
          }
        }
    })
    })
    const data = await response.json()
    if (data.hits.total.value == 0) {
      return false;
    } else {
        return data.hits.hits[0]._source;
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getUserByToken(token) {
    const response = await fetch(`${ELASTICSEARCH_HOST}/users/_search?q=token:${token}`);
    const results = await response.json();
    return results.hits.hits[0]._source;
}

export async function listUsers() {
  const response = await fetch(`${ELASTICSEARCH_HOST}/users/_search`);
  const result = await response.json();
  return result.hits.hits.map(hit => hit._source);
}

export async function checkUsernameInUse(username) {
  const response = await fetch(`${ELASTICSEARCH_HOST}/users/_search?q=username:${username}`);
  const results = await response.json();
  return results.hits.hits.length > 0;
}
    
export async function checkEmailInUse(email) {
  const response = await fetch(`${ELASTICSEARCH_HOST}/users/_search?q=email:${email}`);
  const results = await response.json();
  if(results.hits.hits.length > 0){
    try{
      const emailElastic = results.hits.hits[0]._source.email
      if(emailElastic == email) return true
      return false
    }
    catch (e){
      console.log(e)
      return true
    }
  }
  return false
}