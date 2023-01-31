import fetch from "node-fetch"

const ELASTICSEARCH_HOST = 'http://localhost:9200';

export async function createGroup(userId, title, description) {
    const groupId = await getNextGroupId()
    const newGroup = {
      id: groupId,
      userId: userId,
      title: title,
      description: description,
      movies: []
    };
    await fetch(`${ELASTICSEARCH_HOST}/groups/_doc/${groupId}?refresh=wait_for`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGroup)
    });
    updateGroupId(groupId)
    return newGroup;
  }
  async function getNextGroupId() {
    const response = await fetch(`${ELASTICSEARCH_HOST}/groups/_doc/groupIdx`);
    const result = await response.json();
    return result._source.groupIdx;
  }
  
  async function updateGroupId(groupId){
    await fetch(`${ELASTICSEARCH_HOST}/groups/_doc/groupIdx`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          "groupIdx": ++groupId
      })
    })
  }
    
  export async function editGroup(groupId, title, description) {
    await fetch(`${ELASTICSEARCH_HOST}/groups/_update/${groupId}?refresh=wait_for`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "doc":{
          "title": title,
          "description": description,
        }
      })
    })
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    return result.hits.hits[0]._source
  }
    
  export async function listGroups(userId) {
    const response = await fetch(`${ELASTICSEARCH_HOST}/groups/_search?q=userId:${userId}`);
    const results = await response.json();
    return results.hits.hits.map(hit => hit._source);
  }
    
  export async function deleteGroup(userId, groupId) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    const group = result.hits.hits[0]._source
  
    await fetch(`${ELASTICSEARCH_HOST}/groups/_doc/${groupId}?refresh=wait_for`, {
      method: 'DELETE'
    })
    return group
  }
    
  export async function getGroupDetails(groupId) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    const group = result.hits.hits[0]._source
    let duration = 0;
    let movies = [];
    let moviesIdx = 0;
    group.movies.forEach(movie => {
      duration += Number(movie.duration),
      movies[moviesIdx++] = {
        title: movie.title,
        id: movie.id
      };
    });
    return {
      id: groupId,
      title: group.title,
      description: group.description,
      movies: movies,
      duration: duration
    };
  }
    
  export async function addMovie(userId, groupId, movie) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    const group = result.hits.hits[0]._source
    group.movies[group.movies.length] = movie
  
    await fetch(`${ELASTICSEARCH_HOST}/groups/_update/${groupId}?refresh=wait_for`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "doc":{
          "movies": group.movies
        }
      })
    })
    return group
  }
    
  export async function removeMovie(userId, groupId, movieId) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    const group = result.hits.hits[0]._source
    let movieIdx = group.movies.findIndex(movie => movie.id == movieId)
    let movie = group.movies[movieIdx]
    group.movies.splice(movieIdx, 1)
  
    await fetch(`${ELASTICSEARCH_HOST}/groups/_update/${groupId}?refresh=wait_for`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "doc":{
          "movies": group.movies
        }
      })
    })
    return movie
  }
  
  export async function findUserIdOfGroup(groupId) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    if(result.hits.total.value == 0) return undefined
    const group = result.hits.hits[0]._source;
    return group.userId
  }
    
  export async function checkMovieInUserGroup(groupId, movieId) {
    const response = await getGroupFromElastic(groupId)
    const result = await response.json();
    const group = result.hits.hits[0]._source
  
    let movie = group.movies.find(movie => movie.id == movieId)
    if(movie == undefined) return false
    return true
  }
  
  async function getGroupFromElastic(groupId){
    const response = await fetch(`${ELASTICSEARCH_HOST}/groups/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "query": {
          "terms": {
            "_id": [`${groupId}`] 
          }
        }
      })
    })
    return response
  }