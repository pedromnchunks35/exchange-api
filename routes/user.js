/* IMPORT LIBRARIES */
const express = require('express');
/* GET THE Router */
const router = express.Router();
/* GET CONTROLLER */
const {getUser,insertUser,logout} = require("../controllers/user.js");
/* passport */
const passport = require("passport");
/* INIT THE PASSPORT , BASICLY INVOKE THE FUNCTION THAT INITS THE PASSPORT LOCAL STRATEGY */
require('../auth/passport')();

/* ============================================================ */
// GET ROUTES 
/* ============================================================ */
/* USER GET ROUTE */
router.get('/user',getUser);
/* LOGOUT */
router.get('/logout',logout);

/* ============================================================ */



/* ============================================================ */
// POST ROUTES 
/* ============================================================ */
/* ROUTE FOR USER INSERTION */
router.post('/register',insertUser);


/*ROUTE TO INVOKE THE LOCAL PASSPORT STRATEGY AND REDIRECTS ACCORDING TO THE RESULT*/
router.post('/login',passport.authenticate('local',{
    /* CASE OF SUCESS */
successReturnToOrRedirect: '/sucess',
    /* CASE OF FAILURE */
failureRedirect: '/user',
    /* FAILURE MSG */
failureMessage: true
}));

/* ============================================================ */




/* EXPORT IT */
module.exports = router;