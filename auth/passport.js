/* passport */
const passport = require("passport");
/* OUR LOCAL STRATEGY */
var LocalStrategy = require('passport-local');
/* SQL CONNECTION */
const sql = require('../connection/connection.js');
/* BCRYPT */
const bcrypt = require('bcrypt');
const initPassport = () =>{
/* PASSPORT LOCAL STRATEGY */
passport.use(
    /* NEW LOCALSTRATEGY */
    new LocalStrategy(
    /* VERIFY FUNCTION */
    (username,password,cb)=>{
    /* USER GRAB */
    sql`SELECT * FROM account WHERE username = ${username}`
    .then((User)=>{
    /* MAKE THE VERIFYING */
    /* VERIFY IF IT WAS AN USER */
    if(!User[0]){return cb(null,false,{message: 'No user matches that username'});}
    
    /* VERIFY IF THE PASSWORD MATCHES */
    bcrypt.hash(password,User[0].salt).then((hash)=>{
        /* MAKE THE VERIFYING */
    if(!(hash===User[0].password)){return cb(null,false,{message:'Incorrect password'});}    
    /* RETURN THE USER */
    return cb(null,User[0]);
    })
    
    })
    .catch((err)=>{
    /* RETURN AN ERROR IF IT AS AN ERROR */
    return cb(err);
    })
    
    }
    
    )    
    )
    
    /* CONFIGURE NOW THE SESSION MANAGMENT */
    /* THE SERIALIZE FUNCTION WILL SUPPLY THE INFORMATION ABOUT THE USER */
    passport.serializeUser((user,cb)=>{
    /* PASS THE INFORMATION */
    process.nextTick(()=>{
    cb(null,{public_address: user.public_address,username: user.username});    
    })    
    })
    
    /* THE DESERIALIZE FUNCTION WILL INJECT CONTINOUSLY THE INFORMATION OF THE SESSION */
    passport.deserializeUser((user,cb)=>{
    /* INJECT THE INFORMATION */
    process.nextTick(()=>{
    return cb(null,user);
    })    
    })
}

module.exports = initPassport;