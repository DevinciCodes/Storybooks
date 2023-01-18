const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');


const app = express();

//body parser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Load config

dotenv.config({path: './config/config.env'});

//Passport config
require('./config/passport')(passport)


connectDB()

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Handlebars helper

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

//Handlebars
app.engine(
    '.hbs', 
    exphbs.engine({ 
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
            },
            defaultLayout: 'main',
            extname: '.hbs'
        }));

app.set('view engine', '.hbs');

//Sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store:  MongoStore.create({mongoUrl: 'mongodb://localhost:27017/Storybooks',
     mongooseConnection: mongoose.connection})
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//Set global variable
app.use( function(req,res, next){
    res.locals.user = req.user || null
    next()
})

//Static Folder

app.use(express.static(path.join(__dirname, 'public')))


//Routes

require('./routes/index')(app)
require('./routes/auth')(app)
require('./routes/stories')(app)



const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server is running on ${process.env.NODE_ENV} node on port ${PORT}`))