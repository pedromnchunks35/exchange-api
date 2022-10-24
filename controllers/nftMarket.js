/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
//FUNCTION TO POST INTO THE MARKET
const nftMarketPost = async(req,res) =>{
//GET THE INSTANCE
const instance = await require('../abi/NftMarket')(web3);
//GET THE BODY
var body = req.body;
//TRANSACTION
web3.eth.getGasPrice()
//GET GAS P
.then(gasP=>{
//TRANSFER OBJ
var transfer =
{
//MAIN WALLET
"from": "0xfaC77d9148AB30e821dAFC7E6730F50a70244c61",
//MARKET CONTRACT ADDRESS
"to": process.env.NFTMARKETC,
//METHODS MAKEITEM
"data": instance.methods.makeItem(process.env.NFTC,body.id,body.price).encodeABI(),
//GAS P
"gasPrice": gasP
}

//ESTIMATE THE GAS
web3.eth.estimateGas(transfer)
//GET THE GAS
.then((gas)=>{
//PUT THE GAS ON THE OBJECT
transfer.gas=gas;

//MAKE THE SIGNINING
web3.eth.accounts.signTransaction(transfer,process.env.MAIN_PRIV)
//THE SIGNED DOCUMENT
.then(signed=>{
//MAKE THE TRANSFER
web3.eth.sendSignedTransaction(signed.rawTransaction)
//THE RECEIPT
.then(receipt=>{
//SUCESS
res.status(200).json({receipt: receipt});
})
//CATCH ERROR ON THE SENDING
.catch(err=>{
res.status(400).json({message: "Error during the sending of the transaction"+err});
})
})
//ERROR ON THE SIGNING
.catch(err=>{
res.status(400).json({message: "Error during the signing"+err});    
})

})
//CATCH THE ERROR
.catch((err)=>{
res.status(400).json({message:"Error on the gas "+err});
})

})
//CATCH THE ERROR
.catch(err=>{
//THE ERROR
res.status(400).json({message: "Error getting the gas price"+err});
});

}

//MODULE EXPORTS
module.exports={nftMarketPost}