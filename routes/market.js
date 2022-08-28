//REQUIRE EXPRESS
const express = require('express');
//GET THE ROUTER
const router = express.Router();
//GET THE MARKET FUNCTIONS
const {createSale,getSales,buy} = require('../controllers/market.js');


/* ============================================================ */
// POST ROUTES
/* ============================================================ */
router.post('/market',createSale);

/* ============================================================ */
// GET ROUTES
/* ============================================================ */
router.get('/market',getSales);

/* ============================================================ */
// PUT ROUTES
/* ============================================================ */
router.put('/market',buy);

//EXPORT IT
module.exports=router;