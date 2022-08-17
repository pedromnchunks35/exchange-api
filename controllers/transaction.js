/* REQUIRE THE SQL CONNECTION */
const sql = require('../connection/connection');
/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

/* GET THE ENV VARIABLES */
require('dotenv').config();

/* ================================================================================================================================== */
/* DATA GETTERS / STATE CHANGES */
/* ================================================================================================================================== */
const transfer = (req,res) =>{
/* BODY GET */
const data = req.body;
/* GET THE PRIVATE KEY */
try {
/* GET THE PRIVATE KEY FROM OUR SESSION */
sql`SELECT private_key FROM account WHERE public_address = ${req.session.passport.user.public_address}`
/* GRAB THE RESULT */
.then(async(result)=>{
/* IF THERES AN CONTRACT ADDRESS , MEANS IT WILL BE AN TOKEN TRANSFER */
if(data.hasOwnProperty('contract')){
/* CONTRACT FUNCTION PROVIDER */
const instance=require('../abi/contract')(web3,data.contract);
/* GET THE BALANCE */
var balance = await instance.methods.balanceOf(req.session.passport.user.public_address).call();

if (balance >= data.value){
/* GET THE GAS PRICE */
web3.eth.getGasPrice().then(async (gasPrice)=>{

  /* GET THE RECEIVER BALANCE */
  var balance_receiver = await instance.methods.balanceOf(data.to).call();
  
  /* TRANSFER OBJ OPTIONS */
  var transfer = {
    "from": process.env.MAIN,
    "to": data.contract,
    "data": instance.methods.transferFrom(req.session.passport.user.public_address,data.to,data.value).encodeABI(),
    "gasPrice": gasPrice
  }
  /* CHECK THE ALLOWANCE */
  var allowance = await instance.methods.allowance(process.env.MAIN,data.to).call();
  /* APPROVAL OBJ */
  var approval;
  /* IF THERES NOT A PREVIOUS ALLOWANCE */
  /* THIS ALLOWANCE CHECK IS FOR MAKING A PRECISE COST ESTIMATION , BECAUSE IF AN PREVIOUS ALLOWANCE IS ALREADY MADED , THEN THE COST WILL BE LESS BECAUSE WE ONLY NEED TO WRITE THE VALUE AND NOT BOTH VALUES (ADDRESS AND VALUE) */
  if(allowance==0){
  /* THE APPROVAL OBJ WILL HAVE AN EXAMPLE OF AN ACCOUNT WITH FUNDS THAT WAS NO ALLOWANCE AT ALL */
  /* AN APPROVAL THAT COMES FROM THE MAIN ACCOUNT IS AN APPROVAL THAT DOESNT EXIST SO WE WILL GRAB THAT ESTIMATION PARTING FROM THAT VIEW */
  approval = {
    from: "0x430b7803bf29C78527694f644d2dE9ea2E4E764f",
    to: data.contract,
    data: instance.methods.approve(data.to,2).encodeABI(),
    gasPrice: gasPrice
  }

  }else{
  /* IF THE ALLOWANCE ACTUALLY ALREADY EXISTS (BECAUSE IT IS DIFFERENT FROM 0) */
  approval = {
    from: data.to,
    to: data.contract,
    data: instance.methods.approve(process.env.MAIN,balance_receiver+parseInt(data.value)).encodeABI(),
    gasPrice: gasPrice
  }
  }
  
  /* THE FEE TO INJECT CASH FOR THE APPROVAL */
  var fee_APPROVAL =
  {
    from: process.env.MAIN,
    to: data.to,
    value: 0.004 * Math.pow(10,18),
    gasPrice: gasPrice
  }

  /* MAKING THE ESTIMATIONS */
  /* TRANSFER TOKENS ESTIMATION */
  web3.eth.estimateGas(approval)
  /* RESPONSE OF THE ESTIMATED GAS FOR APPROVE THE TOKENS */
  .then(approvalGas=>{
  /* APPROVAL BY THE RECEIVER ESTIMATION */
  web3.eth.estimateGas(transfer)
  /* RESPONSE OF THE ESTIMATED GAS FOR TRANSFER THE TOKENS */
  .then(tranferGas=>{
  /* MAKING THE ESTIMATION FOR THE FEE THAT THE UPDATE OF APPROVAL WILL CONTAIN */
  web3.eth.estimateGas(fee_APPROVAL)
  /* RESPONSE OF THE ESTIMATED GAS TO SEND THE ENOUGH GAS TO MAKE THE APPROVAL */
  .then(feeGas=>{

 /* MAKE THE SIGNINGS */

 /*
STEP 1 - > SEND THE TOKENS
STEP 2 - > SEND THE GAS FOR APPROVE THE MAIN ACCOUNT TO USE THAT TOKENS
STEP 3 - > MAKE THE APPROVAL
 */


/*=======================================*/
/* STEP 1 SEND THE TOKENS */
/*=======================================*/
/* ADDING THE GAS VALUE TO THE TRANSFER */
transfer.gas=tranferGas;
web3.eth.accounts.signTransaction(transfer,process.env.MAIN_PRIV)
/* RESPONSE TO SIGNING THE TRANSFER */
.then(signTransfer=>{
  /* SENDING THE TRANSACTION */
  web3.eth.sendSignedTransaction(signTransfer.rawTransaction)
  .then(async receiptTransfer=>{

/*=======================================================================*/
/* STEP 2 SEND THE GAS FOR APPROVE THE MAIN ACCOUNT TO USE THAT TOKENS */
/*=======================================================================*/
/* ADDING THE GAS VALUE TO THE FEE APROVAL */
fee_APPROVAL.gas=feeGas;
/* GET THE CURRENT BALANCE OF THE ACCOUNT WE ARE SENDING THE FUNDS WHICH IS THE RESIDUE */
var residue = await web3.eth.getBalance(data.to);
/* UPDATING THE VALUE OF THE OPERATION */ 
fee_APPROVAL.value= (parseFloat(approvalGas)*parseFloat(gasPrice))-parseFloat(residue);
web3.eth.accounts.signTransaction(fee_APPROVAL,process.env.MAIN_PRIV)
.then(signFee=>{
  /* SENDING THE TRANSACTION */
  web3.eth.sendSignedTransaction(signFee.rawTransaction)
  .then(receiptFee=>{

/*=======================================================================*/
/* STEP 3 MAKE THE APPROVAL */
/*=======================================================================*/
sql`SELECT private_key FROM account WHERE public_address=${data.to}`
/* RESULT OF THE QUERY */
.then(resultApp=>{
/* MAKING THE ENOUGH CHANGES IN THE APPROVAL FOR THE REAL CENARIO */
approval.from = data.to;
approval.data = instance.methods.approve(process.env.MAIN,parseFloat(balance_receiver)+parseFloat(data.value)).encodeABI();
approval.gas=approvalGas;
web3.eth.accounts.signTransaction(approval,resultApp[0].private_key)
/* APPROVAL SIGNING RESULT */
.then(signApp=>{
/* SENDING THE TRANSACTION */
web3.eth.sendSignedTransaction(signApp.rawTransaction)
/* SENDING THE RESULT */
.then(receiptApp=>{
res.status(200).json({Msg: "Sucess",ReceiptTransfer: receiptTransfer, ReceiptFee:receiptFee , ReceiptApp: receiptApp});
})
/* SENDING THE APPROVAL TRANSACTION ERROR */
.catch(err=>{
  console.log(err);
  res.status(500).json({Msg: "Error sending the approval transaction"});
})
})
/* SIGNING APPROVAL TRANSACTION ERROR HANDLING */
.catch(err=>{
  console.log(err);
  res.status(500).json({Msg: "Error while signing the Approval transaction"});
})

})
/* QUERY PRIVATE KEY OF THE DATA.TO ERROR HANDLING */
.catch(errorQAPP=>{
  console.log(errorQAPP);
res.status(500).json({Msg: "Error while querying the private key of the given address"});
})

  })
  /* SENDING THE FEE TRANSACTION ERROR HANDLING */
  .catch(feeErr=>{
    res.status(500).json({Msg: "Error sending the fee transaction"});
  })
})
/* SIGN THE FEE ERROR HANDLING */
.catch(err=>{
  console.log(err);
  res.status(500).json({Msg: "Error signing the fee transaction"});
})

  })
  /* SENDING THE TRANSFER ERROR HANDLING */
  .catch(err=>{
    res.status(500).json({Msg: "Error sending the transfering transaction"});
  })
})
/* SIGNING TRANSFER ERROR HANDLING */
.catch(err=>{
  res.status(500).json({Msg: "Error signing the transfering"});
})


})

  /* FEE ESTIMATING ERROR HANDLING */
  .catch(feeErr=>{
    console.log(feeErr);
  res.status(500).json({Msg: "Error estimating the fee to make the transaction"});
  })
  })
  /* APPROVAL GAS ERROR HANDLING */
  .catch(approvalGasErr=>{
    console.log(approvalGasErr)
  res.status(500).json({Msg: "Error estimating the Gas for the transfer of the transaction"});
  })
  })
  /* TRANSFER GAS ERROR HANDLING */
  .catch(transferGasErr=>{
  res.status(500).json({Msg: "Error estimating the Gas for the approval itself"});
  })





})



}else{
  /* ERROR MESSAGE CASE BALANCE ISNT ENOUGHT */
  res.status(400).json({message: `You dont have enough balance to pursue this transaction`});
}

}else{
/* JUST AN BNB TRANSFER*/
/* THIS IS THE TRANSACTION COMPOSTION */
web3.eth.accounts.signTransaction({
    /* TO WHO WE WILL SEND THE VALUE */
    to: data.to,
    /* THE VALUE WE WANT TO SEND (1 WEI == 10^18 BNB) */
    value: data.value * Math.pow(10,18),
    /* MINIMUM GAS */
    gas: '21000',
    /* THE NETWORK WE WILL BE USING */
    common:{
     customChain:{
       name: 'BSCT',
     chainId: 97,
     networkId: 97 
     }
    }
/* THE PRIVATE KEY TO SIGN THE TRANSACTION */
},result[0].private_key)
/* TRANSACTION SIGN RESULT */
.then((trans_hash)=>{
/* MAKE THE TRANSACTION ITSELF */
web3.eth.sendSignedTransaction(trans_hash.rawTransaction,(error,transaction_hash)=>{
/* CHECK ERRORS */
if(error){
/* TROWH AN ERROR IN CASE OF FAILURE */
res.status(500).json({message: "Error during the transaction , maybe you dont have funds or the gas is not enough"});
}else{
/* SUCESS MESSAGE */
res.status(200).json({message: `Sucess , the transaction went trought!`, transaction: transaction_hash});
}   

})

})
/* AN POSSIBLE ERROR FOR THE TRANSACTION */
.catch((err)=>{
res.status(500).json({message: "Error making the transaction sign"});
})
}
})
/* GRAB THE ERROR OF THE QUERY */
.catch((err)=>{
  console.log(err);
/* CASE THE QUERY TRHOWS AN ERROR */
res.status(500).json({message: "Internal Server Error"});
}) 
/* CATCH IN CASE THERES NO SESSION */   
} catch (error) {
res.status(400).json({message: "Please login first"});
}

}
/* EXPORT IT */
module.exports = {transfer};