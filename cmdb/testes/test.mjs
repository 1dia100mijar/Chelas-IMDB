import assert from  'assert'
import * as cmdbData from '../data/memory/cmdb-data-mem.mjs'
import * as usersData from '../data/memory/cmdb-users-data.mjs'
import movieDataInit from '../data/cmdb-movies-data.mjs'
import cmdbServicesInit from '../services/cmdb-services.mjs'
import fetch from 'node-fetch'
import myfecthInit from '../my-fetch.mjs'

let movieData

const FETCH_FLAG = 0    //0=myFetch   1=realFetch
if(FETCH_FLAG == 1){
  movieData = movieDataInit(fetch)
}
else{
  const myfecth = myfecthInit("k_9ujbz6dc")
  movieData = movieDataInit(myfecth)
}

const cmdbservices = cmdbServicesInit(cmdbData, usersData, movieData)

describe('Tests getTop250', function () {
    describe('#first test from Tests1', function () {
      it('should always succeed', async function () {
        assert.deepEqual(await cmdbservices.getTop250(1, FETCH_FLAG), 
        [
            {
              id: 'tt0111161',
              imDbRating: '9.2',
              rank: '1',
              title: 'The Shawshank Redemption'
            }
          ])
      })
    })
  })

describe('Test searchMovies', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        assert.deepEqual(await cmdbservices.searchMovies("Inception 2010", 2, FETCH_FLAG), 
        [
            {
                "id": "tt1375666",
                "title": "Inception",
                "description": "(2010)"
            },
            {
                "id": "tt1790736",
                "title": "Inception: The Cobol Job",
                "description": "(2010 Video)"
            }
        ])
      })
    })
  })

describe('Test createGroup', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        assert.deepEqual(await cmdbservices.createGroup("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", {"title": "Title", "description": "Description"}), 
        {
            "id": 3,
            "userId": 0,
            "title": "Title",
            "description": "Description",
            "movies": []
        })
      })
    })
  })

describe('Test createUser', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        const users = await usersData.listUsers()
        const Nusers = users.length 
        await cmdbservices.createUser()
        const Newusers = await usersData.listUsers()
        const NewNusers = Newusers.length
        assert.equal(NewNusers-Nusers, 1)
      })
    })
  })

describe('Test listUsers', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        const users = await usersData.listUsers()
        const Nusers = users.length 
        await cmdbservices.createUser()
        const Newusers = await usersData.listUsers()
        const NewNusers = Newusers.length
        assert.deepEqual(NewNusers-Nusers, 1)
      })
    })
  })
describe('Test editGroup', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        const group = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0)
        const groupEdited = await cmdbservices.editGroup("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0, "TitleEdited", "DescriptionEdited")
        assert.notEqual(group, groupEdited)
      })
    })
  })
describe('Test addMovie', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        const movies = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0)
        await cmdbservices.addMovie("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0, "tt0110413", FETCH_FLAG)
        const moviesAdded = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0)
        assert.notEqual(movies, moviesAdded)
      })
    })
  })
describe('Test removeMovie', function () {
    describe('#test from Tests1', function () {
      it('should always succeed', async function () {
        await cmdbservices.addMovie("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 1, "tt3227032", FETCH_FLAG)
        await cmdbservices.addMovie("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 1, "tt0110413", FETCH_FLAG)
        const moviesAdded = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 1)
        await cmdbservices.removeMovie("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 1, "tt0110413")
        const moviesDeleted = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 1)
        assert.equal(moviesAdded.movies.length-moviesDeleted.movies.length, 1)
      })
    })
  })
describe('Test listGroups', function () {
        describe('#test from Tests1', function () {
          it('should always succeed', async function () {
            const group = cmdbservices.listGroups()
            await cmdbservices.createGroup("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", {"title": "Title", "description": "Description"})
            const groupEdited = cmdbservices.listGroups()
            assert.notEqual(group, groupEdited)
          })
        })
      })

describe('Test deleteGroup', function () {
        describe('#test from Tests1', function () {
          it('should always succeed', async function () {
            let Ngroup = await cmdbservices.listGroups("3e5ea6df-26e4-4f59-bf78-23ccd1714b92")
            await cmdbservices.deleteGroup("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 0)
            let NgroupDeleted = await cmdbservices.listGroups("3e5ea6df-26e4-4f59-bf78-23ccd1714b92")
            assert.equal(Ngroup.length-NgroupDeleted.length , 1)
          })
        })
      })
describe('Test getGroupDetails', function () {
        describe('#test from Tests1', function () {
          it('should always succeed', async function () {
            const groupEdited = await cmdbservices.addMovie("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 2, "tt0110413", FETCH_FLAG)
            const group = await cmdbservices.getGroupDetails("3e5ea6df-26e4-4f59-bf78-23ccd1714b92", 2)
            assert.deepEqual(group, {
                "id": 2,
                "title": "titleTest2",
                "description": "descriptionTest2",
                "movies": [
                  {
                    "title": "Léon: The Professional",
                    "id": "tt0110413"
                  }
                ],
                "duration": 110
            })
          })
        })
    })