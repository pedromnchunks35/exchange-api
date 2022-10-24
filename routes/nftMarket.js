//GET EXPRESS
const express = require('express');
//GET ROUTER
const router = express.Router();
//GET THE METHODS
const {nftMarketPost} = require('../controllers/nftMarket');
//MAKE AN POST OF AN SALE
router.post("/nftMarket",nftMarketPost);







//EXPORT IT
module.exports=router;