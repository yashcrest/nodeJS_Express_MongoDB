const path = require('path')
const express = require('express')
const mongoose  = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const {engine} = require('express-handlebars')
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db')

//load config
dotenv.config({path: './config/config.env' })

//Passport config 
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs' , engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    store: MongoStore.create({mongoUrl : process.env.MONGO_URI,}),
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))