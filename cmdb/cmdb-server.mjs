// Application Entry Point. 
// Register all HTTP API routes and starts the server

import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import url from 'url'
import hbs from 'hbs'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import fetch from 'node-fetch'
import morgan from 'morgan'
import passport from 'passport'
import * as cmdbDataElastic from './data/elastic/cmdb-data-db.mjs'
import * as cmdbUserElastic from './data/elastic/cmdb-users-db.mjs'
import * as cmdbDataMemoria from './data/memory/cmdb-data-mem.mjs'
import * as cmdbUserMemoria from './data/memory/cmdb-users-data.mjs'
import movieDataInit from './data/cmdb-movies-data.mjs'
import cmdbServicesInit from './services/cmdb-services.mjs'
import cmdbApiInit from './web/api/cmdb-web-api.mjs'
import cmdbSiteInit from './web/site/cmdb-web-site.mjs'

const movieData = movieDataInit(fetch)
const cmdbservices = cmdbServicesInit(cmdbDataElastic, cmdbUserElastic, movieData)
const api = cmdbApiInit(cmdbservices)
const site = cmdbSiteInit(cmdbservices)

const PORT = 1350
let app = express()
//app.use(morgan('dev'))

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
app.use(express.static(__dirname +  'web/site/resources/public'))
// View engine setup
const viewsPath = `${__dirname}/web/site/resources/views`
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(`${viewsPath}/partials`)

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.session())
app.use(passport.initialize())
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))


const swaggerDocument = yaml.load('./docs/cmdb-api-spec.yaml')
app.use('/swaggerTest', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//WEB
app.get('/', site.getHomeUnauthenticated)
app.get('/home', site.getHome)
app.get('/site.css', site.getCss)
app.get('/login', site.login)
app.get('/signin', site.signIn)
app.post('/login', site.loginValidation)
app.post('/signin', site.signinValidation)
app.post('/logout', site.logout)
app.get('/groups', site.listGroups)
app.get('/groups/new', site.createGroupForm)
app.get('/groups/edit/:id', site.editGroupFrom)
// app.post('/groups/edit/:id', site.editGroup)
app.get('/groups/:id', site.listGroup)
app.post('/groups', site.createGroup)
// app.post('/groups/delete/:id', site.deleteGroup)
app.get('/movies/top250/', site.top250Movies)
app.get('/movies/:id', site.getMovieDetails)
app.post('/movies/search/', site.searchMovies)
app.get('/movies/search/:name', site.getsearchMovies)
app.post('/groups/movies/:movieId', site.addMoviePage)
app.post('/groups/movies/:movieId/:groupId', site.addMovie)
// app.post('/movies/delete/:id', site.deleteMovie)

//API
app.get('/api/movies/top250/', api.getTop250)
app.get('/api/movies/search/:name', api.searchMovies)
app.get('/api/movies', api.getMovieDetails)
app.post('/api/groups/', api.createGroup)
app.put('/api/groups/:id', api.updateGroup)
app.get('/api/groups/', api.listGroups)
app.delete('/api/groups/:id', api.deleteGroup)
app.get('/api/groups/:id', api.listGroup)
app.post('/api/groups/movies/:groupId', api.addMovie)
app.delete('/api/groups/movies/:id', api.deleteMovie)
app.post('/api/users/', api.addUser)
app.get('/api/users/', api.listUsers)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))
