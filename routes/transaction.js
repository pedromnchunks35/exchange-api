/* IMPORT LIBRARIES */
const express = require('express');
/* GET THE Router */
const router = express.Router();
/* TRANSFER FUNCTION */
const {transfer} = require('../controllers/transaction');


/* ============================================================ */
// POST ROUTES
/* ============================================================ */
/* ROUTE TO TRANSFER FUNDS FROM WHO IS LOGGING AND AN GIVEN PUBLIC ADDRESS */
router.post('/transfer',transfer);
/* ============================================================ */






/* EXPORT THE ROUTES */
module.exports = router;

