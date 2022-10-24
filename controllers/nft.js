/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
//DOTENV
require("dotenv").config();
//FUNCTION TO CREATE NFT

// PARAMETERS
// url
// address
// designation
// detail_one
// detail_two
// rarity

var createNft = async(req,res) =>{

  //BODY
var body = req.body;
//CREATE CONTRACT INSTANCE
const instance = await require('../abi/Nft')(web3);
//GET GAS PRICE
web3.eth.getGasPrice().then((gasP)=>{
/* TRANSFER OBJ OPTIONS */
 var transfer = {
    "from": process.env.MAIN,
    "to": process.env.NFTC,
    "data": instance.methods.mint_nft(body.url,body.address,[body.designation,body.detail_one,body.detail_two],body.rarity).encodeABI(),
    "gasPrice": gasP
  }

//ESTIMATE THE GAS
web3.eth.estimateGas(transfer).then(
(fee)=>{
//THE GAS USED ON THE OPERATION
transfer.gas=fee;
//SIGN THE TRANSACTION
web3.eth.accounts.signTransaction(transfer,process.env.MAIN_PRIV).then(signedT=>{
//SEND IT
web3.eth.sendSignedTransaction(signedT.rawTransaction).then(async receipt=>{
//GET THE TOKEN COUNT
var tokenC = await instance.methods.tokensC().call();
//SEND STATUS OK WITH THE RECEIPT AND TOKENCOUNT
res.status(200).json({receipt: receipt,tokenC: tokenC});
})
//CATCH THE ERROR FOR SENDING
.catch(err=>{
res.status(400).json({message: "Error sending the transaction "+err});
})
})
//CATCH ERROR ON THE SIGNING
.catch(err=>{
//STATUS 400
res.status(400).json({message: "Error on the signing "+err});    
})

})
//ESTIMATE GAS FAIL
.catch((err)=>{
//RESPONSE ERROR
res.status(400).json({message: "Gas failed.." + err});
});

//CASE THE GAS PRICE FAILS
}).catch((err)=>{
//RESPONSE ERROR
res.status(400).json({message: "Gas Price failed.." + err});
})
}













//GET NFT
var getNft=async(req,res)=>{
//GET THE BODY
var body = req.body;
//INSTANCE
var instance = await require('../abi/Nft')(web3);
try {
//GRAB THE DETAILS OF THE NFT
var url = await instance.methods.tokenURI(body.id).call();
//GRAB THE DETAILS
var details = await instance.methods.details(body.id).call();
//RESPONSE
res.status(200).json({url: url,details: details});    
//CATCH THE ERROR
} catch (error) {
res.status(400).json({message: "Some error during the instance "+error});    
}

}


//VAR GET OWNER
const getOwner = async(req,res) =>{
//GET THE INSTANCE
const instance = await require('../abi/Nft')(web3);  
//ADDRESS OF THE OWNER
try {
//GET THE OWNER
var owner =await instance.methods.ownerOf(req.body.id).call();
//RESPONSE
res.status(200).json({owner: owner});
//CATCH THE ERROR
} catch (error) {
res.status(400).json({"message": "Error durint the get of the owner "+error})  
}

}





module.exports={createNft,getNft,getOwner};