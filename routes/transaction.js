/* IMPORT LIBRARIES */
const express = require('express');
/* GET THE Router */
const router = express.Router();
/* TRANSFER FUNCTION */
const {transfer,transferCefi,transferMobile} = require('../controllers/transaction');


/* ============================================================ */
// POST ROUTES
/* ============================================================ */
/* ROUTE TO TRANSFER FUNDS FROM WHO IS LOGGING AND AN GIVEN PUBLIC ADDRESS */
router.post('/transfer',transfer);
//FUNCTION TO TRANSFER USING THE NEW METHOLOGY TO SPARE GAS
router.post('/transferCefi',transferCefi);
// TRANSFER MOBILE
router.post('/transferMobile',transferMobile);
/* ============================================================ */






/* EXPORT THE ROUTES */
module.exports = router;

