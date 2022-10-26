//GET EXPRESS
const express = require('express');
//GET ROUTER
const router = express.Router();
//GET THE METHODS
const {MarketPost, items_list} = require('../controllers/Market');
//MAKE AN POST OF AN SALE
router.post("/Market",MarketPost);
//THE GET OF THE ITEMS
router.get('/Market',items_list);






//EXPORT IT
module.exports=router;