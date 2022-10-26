/* LIBRARY IMPORTS */
const express = require('express');
/* INIT DOTENV */
require('dotenv').config();
/* USE APP */
const app = express();
/* COOKIE-PARSER */
var cookieParser = require('cookie-parser');
/* EXPRESS SESSION */
var session = require('express-session');
/* PASSPORT */
var passport = require('passport');

/* IMPORT ROUTES */
const user_route = require('./routes/user');
const trans_route = require('./routes/transaction');
const nft_route = require('./routes/nft');
const market=require('./routes/Market');
const { urlencoded } = require('express');
/* USE JSON */
app.use(express.json());
/* UNRLENCODED */
app.use(urlencoded({ extended: false }));
/* USE COOKIES */
app.use(cookieParser());
/* SESSION */
app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));
/* MAKE AN AUTHENTICATION */
app.use(passport.authenticate('session'));

/* USE ROUTES */
app.use(user_route);
app.use(trans_route);
app.use(nft_route);
app.use(market);

/* MAKE THE APP LISTEN IN SOME PORT */
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port: "+process.env.PORT);
})