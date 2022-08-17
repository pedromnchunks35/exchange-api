const Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

web3.eth.getBalance("0x09b80e1f8036c16920cA4FcF3b1d2EF66F4cFFF6").then(result=>{
  console.log(result/Math.pow(10,18));
})


