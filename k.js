/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

var contract_sell = require('./abi/Nft')(web3);

web3.eth.getGasPrice().then(GasP=>{
//APPROVE OBJ
approve_obj=
{
from: "0xf0E0Ea164D94Ba9f75de0440d51f91FDaF2f50aa",
to: process.env.NFTC,
gasPrice: GasP,
data: contract_sell.methods.approve(process.env.NFTMARKETC,3).encodeABI()
}

web3.eth.estimateGas(approve_obj).then(gas=>{

approve_obj.gas=gas;
web3.eth.accounts.signTransaction(approve_obj,"abb11a14102f2a6bad4adfa7846b74b9b2df2c187577e0b476eed6e6ee816cef")
.then(sign=>{

web3.eth.sendSignedTransaction(sign.rawTransaction)
.then(
receipt=> console.log(receipt)
)
    

})


    
})
.catch(err=>
    console.log(err))






}).catch(err=>
    console.log(err))