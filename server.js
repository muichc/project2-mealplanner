require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require("connect-flash")
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn')
const axios = require('axios')

const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.use(session({
  // a string used to generate a unique 
  // session ID cookie to share with the browser
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true 
}))

// the following two lines must appear after configuring the session
app.use(passport.initialize())
app.use(passport.session())

// FLASH
app.use(flash())
// adds a method to the req object for universal access

// Set up local variables (data that's accessible from anywhere in the app)
app.use((req, res, next) => {
  // before every route is loaded, attach flash messages and the 
  // current user to res.locals
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

app.get('/info', (req, res)=>{
  

  var options1 = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/33631/analyzedInstructions',
    params: {stepBreakdown: 'true'},
    headers: {
      'x-rapidapi-key': '4cb263df0bmsh3ff5c04afde99b5p1ad726jsn1de166cb145e',
      'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  };
  axios.request(options1).then(function (response) {
    console.log(response.data[0].steps);
    console.log(response.data[0].ingredients)
    res.send("Hello")
  }).catch(function (error) {
    console.error(error);
  });
})

app.get('/', (req, res) => {
  res.render('main/index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));

const server = app.listen(process.env.PORT || 3000, ()=> console.log(`🎧You're listening to the smooth sounds of port ${process.env.PORT || 3000}🎧`));

module.exports = server;
