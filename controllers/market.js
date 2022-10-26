/* GET THE CONNECTION */
const sql = require("../connection/connection");
//JWT
var jwt = require('jsonwebtoken');
/* WEB3 IMPORT */
var Web3 = require('web3');
/* CREATE AN INSTANCE */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

// PARAMETERS
// contract_sell
// contract_pay
// quantity
// type
// price
// id
//FUNCTION TO POST INTO THE MARKET
const MarketPost = async(req,res) =>{
//USER
var user;
//THE CONTRACT THAT WE WANT TO SELL
var contract_sell;
//THE CONTRACT TO PAY
var contract_pay;
//THE QUANTITY
var quantity;
//THE TYPE
var type;



//REQUEST TOKEN
if(req.headers && req.headers.authorization){

    //VERIFY THE TOKEN
    jwt.verify(req.headers.authorization.toString(),process.env.TOKEN,(err,decoded)=>{
    //CASE THERES AN ERROR
    if(err){
    res.status(400).json({msg:"Please provide an valid token"});
    //CASE THERES NO ERROR
    }else{
    //THE USER
    user=decoded;

    

    //GET USER DETAILS
sql`SELECT * FROM account WHERE username=${user.username}`
//USER DATA
.then(async(user)=>{
//CHECKOUT IF THERES AN TOKEN/NFT
if(req.body){

    //CHECKING IF IT IS NFT OR TOKEN
    if(req.body.type==="token"){
    
    //CONTRACT THAT WE WANT TO SELL
    var contract_sell = require('../abi/contract')(web3,req.body.contract_sell);
    
    //ASSIGN VARS
    contract_pay = req.body.contract_pay;
    
    quantity = req.body.quantity;
    
    type = req.body.type;
    
    price = req.body.price;
    
    //CHEKING CASE IS NFT
    }else if(req.body.type=="nft"){
    
    //CONTRACT THAT WE WANT TO SELL
    var contract_sell = require('../abi/Nft')(web3);


    //MAKING AN CALL TO THE CONTRACT SELL TO CHECK THE BALANCE OF THE USER
    var balance = (await contract_sell.methods.balanceOf(user[0].public_address).call());
    
    //ASSIGN VARS
    contract_pay = req.body.contract_pay;
    
    quantity = req.body.quantity;
    
    type = req.body.type;
    
    price = req.body.price;
}
    //CASE THERES NO SUCH PARAMETERS LETS THROW AN ERROR
    }else{
    //RESPONSE
    res.status(400).json({msg: "Some parameters are missing"});
    }


//GET GAS PRICE
web3.eth.getGasPrice()
//GAS PRICE
.then(GasP=>{

//GET CONTRACT ADDRESS FROM NFTMARKET
var market = require('../abi/NftMarket')(web3);
//INITIALIZE
var approve_obj;
var market_obj;
if(req.body.type=="nft"){
//APPROVE OBJ
approve_obj=
{
from: process.env.MAIN,
to: process.env.NFTC,
gasPrice: GasP,
data: contract_sell.methods.approve(process.env.NFTMARKETC,8).encodeABI()
}

//APPROVE OBJ
market_obj=
{
from: process.env.MAIN,
to: process.env.NFTMARKETC,
gasPrice: GasP,
data: market.methods.makeNft(req.body.contract_pay,req.body.contract_sell,4,req.body.price).encodeABI()
}
//CASE IS TOKEN
}else{

//APPROVE OBJ
approve_obj=
{
from: process.env.MAIN,
to: req.body.contract_sell,
gasPrice: GasP,
data: contract_sell.methods.approve(process.env.NFTMARKETC,10).encodeABI()
}

//APPROVE OBJ
market_obj=
{
from: process.env.MAIN,
to: process.env.NFTMARKETC,
gasPrice: GasP,
data: market.methods.makeToken(req.body.contract_pay,req.body.contract_sell,req.body.price,5).encodeABI()
}

}


//MAKE GAS ESTIMATION WITH THIS
web3.eth.estimateGas(approve_obj)
//GET THE GAS
.then(gas_approve=>{

//ESTIMATE THE GAS FOR THE EXPOSE ITSELF
web3.eth.estimateGas(market_obj)
.then(async gas_expose=>{

/* GET THE CURRENT BALANCE OF THE ACCOUNT WE ARE SENDING THE FUNDS WHICH IS THE RESIDUE */
var residue = await web3.eth.getBalance(user[0].public_address);
//THE TRANSFER TO THE USER ACCOUNT SO HE CAN APPROVE THE USE OF HIS NFT
var transfer_to_approval = 
{
from: process.env.MAIN,
to: user[0].public_address,
gasPrice: GasP,
value: ((parseFloat(gas_approve)*parseFloat(GasP))+(parseFloat(gas_expose)*parseFloat(GasP))-parseFloat(residue))  
}

//ESTIMATE GAS FOR THE TRANSFERING OF FUNDS
web3.eth.estimateGas(transfer_to_approval)
//THE RESULT OF THIS OPPERATION
.then(gas_send_funds=>{

//GAS FOR SENDING THE FUNDS
transfer_to_approval.gas=gas_send_funds;

//SIGN THE TRANSACTION
web3.eth.accounts.signTransaction(transfer_to_approval,process.env.MAIN_PRIV)
//THE SIGNED DOC
.then(signedDoc=>{
//SEND SIGNED TRANSACTION
web3.eth.sendSignedTransaction(signedDoc.rawTransaction)
//THE RECEIPT
.then(async receipt_transaction=>{

var approve;

//CASE IS NFT
if(req.body.type=="nft"){
//THE APPROVAL
approve=
{
    from: user[0].public_address,
    to: process.env.NFTC,
    gasPrice: GasP,
    data: contract_sell.methods.approve(process.env.NFTMARKETC,req.body.id).encodeABI()
}

}else{
//APPROVE OBJ
approve=
{
from: user[0].public_address,
to: req.body.contract_sell,
gasPrice: GasP,
data: contract_sell.methods.approve(process.env.NFTMARKETC,req.body.quantity).encodeABI()
}

}

//GAS TO APPROVE
approve.gas=gas_approve;

//SIGN THE CONTRACT
web3.eth.accounts.signTransaction(approve,user[0].private_key)
//GET THE SIGNED DOC FOR APPROVE
.then(signedDocAp=>{

//SIGNED TRANSACTION
web3.eth.sendSignedTransaction(signedDocAp.rawTransaction)
//SENDING THE SIGNED DOC
.then(receipt_approval=>{
//VAR MARKET
var market_trans;
//SENDING NOW THE NFT FOR THE SMART CONTRACT FOR SELL
if(req.body.type=="nft"){
//MARKET OBJ
market_trans=
{
from: user[0].public_address,
to: process.env.NFTMARKETC,
gasPrice: GasP,
gas: gas_expose,
data: market.methods.makeNft(req.body.contract_pay,req.body.contract_sell,req.body.id,req.body.price).encodeABI()
}
//CASE IS TOKEN
}else{

//APPROVE OBJ
market_trans=
{
from: user[0].public_address,
to: process.env.NFTMARKETC,
gasPrice: GasP,
data: market.methods.makeToken(req.body.contract_pay,req.body.contract_sell,req.body.price,req.body.quantity).encodeABI()
}

}

//SIGN THE DOC
web3.eth.accounts.signTransaction(market_trans,user[0].private_key)
//RESULT FROM SIGNING THE DOC
.then(signedDoc_expose=>{

//SEND THE TRANSACTION
web3.eth.sendSignedTransaction(signedDoc_expose.rawTransaction)
//RESPONSE OF THE EXPOSURE
.then(receipt_expose=>{
//RESPONSE STATUS
res.status(200).json({receipt_transaction:receipt_transaction,receipt_approval:receipt_approval,receipt_expose:receipt_expose});
})
//CATCH THE ERROR
.catch(err=>{
//RESPONSE
res.status(500).json({msg: "Error while sending the exposure transaction "+err});
})

})

//CATCH ERROR FOR SIGNING THE DOC THAT EXPOSES THE NFT
.catch(err=>{
//RESPONSE
res.status(500).json({msg:"Error signing the doc to expose "+err});
})


})
//CATCH ERROR
.catch(err=>{
    console.log(err);
    res.status(500).json({msg: "Error sending the signed doc for approval "+err})
})

})
//CATCH ERR
.catch(err=>{
    //RESPONSE
    res.status(500).json({msg: "Error signing the doc for the approval "+err});
})


})
//ERROR ON SENDIND THE DOC
.catch(err=>{
    res.status(500).json({msg: "Error sending the doc "+err})
})


})
//CATCH THE ERROR
.catch((err)=>{
    //RESPONSE
    res.status(500).json({msg: "Error signing the doc "+err});
})    


})
//CATCH FOR SENDING THE GAS NEEDED
.catch(err=>{
//THE ERROR
res.status(500).json({msg: "Error sending the gas needed"+err}); 
})


})
//ERROR ESTIMATING GAS FOR FUNDS
.catch(err=>{
    //RESPONSE
    res.status(500).json({msg: "Error estimating gas for the sending of the funds "+err});
})




})
//CASE ERROR
.catch(err=>{
//RESPONSE
res.status(400).json({msg: "Error estimating gas exposure"+err});
})


})
//CATCH THE ERROR
.catch(err=>{
//THROW AN ERROR
res.status(400).json({msg: "Error on estimating gas approval"+err});
});


})
//CATCH THE ERROR
.catch((err)=>{
//RESPONSE WITH THE ERROR
res.status(400).json({msg: "Some error grabbing the user from the db "+err});
})






    }
    });
     
    }else{
    //RESPONSE
    res.status(400).json({message: "You need an token to pursue with this operation"});
    }
    





}



















//FUNCTION TO GET ITEM ON SELL
var items_list = async (req,res) =>{

//GET CONTRACT INSTANCE
var market = require('../abi/NftMarket')(web3);
//THE NFT
var nft = require('../abi/Nft')(web3);

//GET THE TOKEN COUNT
var tokenC = await market.methods.itemCount().call();

//ITEMS
var items = [];

//LOOP IT
for (let index = 1; index <= tokenC; index++) {
//THE ITEM
var item = await market.methods.item_list(index).call();   
//ADD IT TO THE ITEM
var url = await nft.methods.tokenURI(index).call();
item.url = url;
//THE ITEMS
if(item.quantity>0){
    items.push(item);
}

}
//THE RESPONSE
res.status(200).json({items: items});

}
















//MODULE EXPORTS
module.exports={MarketPost,items_list}