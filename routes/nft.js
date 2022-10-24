/* IMPORT LIBRARIES */
const express = require('express');
/* GET THE Router */
const router = express.Router();
/* TRANSFER FUNCTION */
const {createNft,getNft,getOwner} = require('../controllers/nft');
//THE POST
router.post("/nft",createNft);
//THE GET
router.get("/nft",getNft);
//GET FOR THE OWNER
router.get("/ownerNft",getOwner);

/* EXPORT THE ROUTES */
module.exports = router;