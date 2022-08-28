/* IMPORT LIBRARIES */
const express = require('express');
/* GET THE Router */
const router = express.Router();
//GET THE FUNCTIONS FOR THE ROUTE
const {createAssets, getAssets} = require('../controllers/assets');

/* ============================================================ */
// POST ROUTES
/* ============================================================ */
/* ROUTE TO CREATE ASSETS */
router.post('/asset',createAssets);
/* ============================================================ */

/* ============================================================ */
// GET ROUTES
/* ============================================================ */
router.get('/assets',getAssets);
/* ============================================================ */
//EXPORT IT
module.exports = router;