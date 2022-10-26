/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

var contract_sell = require('./abi/Nft')(web3);

web3.eth.getGasPrice().then(gasP=>{

var contract = require('./abi/contract')(web3,"0x05D64e07069F89aad03B4eDEd32644308432b0eA");

//TRANSFER    
var transfer = {
from: process.env.MAIN,
to: "0x05D64e07069F89aad03B4eDEd32644308432b0eA",
data: contract.methods.approve(process.env.NFTMARKETC,5).encodeABI(),
gasPrice: gasP
}

web3.eth.estimateGas(transfer).then(gas=>{

    transfer.gas=gas;

web3.eth.accounts.signTransaction(transfer,process.env.MAIN_PRIV)
.then(signed=>{

web3.eth.sendSignedTransaction(signed.rawTransaction)
.then(receipt=>{
    console.log(receipt);
})

})


})


})