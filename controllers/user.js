/* GET THE CONNECTION */
const sql = require("../connection/connection");
/* WEB3 LIBRARY */
var Web3 = require('web3');
/* BCRYPT LIBRARY */
const bcrypt = require('bcrypt');
/* CREATE AN INSTANCE IN BINANCE NETWORK */
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
/* DOTENV */
require('dotenv').config();




/* ================================================================================================================================== */
/* DATA GETTERS / STATE CHANGES */
/* ================================================================================================================================== */
/* GET USER */
const getUser = (req,res) =>{
/* SESSION VERIFYING */
try{
/* DATA GET  */
sql`SELECT name,phone_number,city,post_code,birth_date FROM account WHERE public_address=${req.session.passport.user.public_address}`
/* THE RESPONSE */
.then((result)=>{
/* SENDING THE DATA */
res.status(200).json(result[0]);
})
/* THE ERROR CATCH */
.catch((err)=>{
/* THE RESPONSE */
res.status(500).json({message: "Error While Querying"});
})   
}catch(err){
/* CASE THERES NO SESSION */
res.status(400).json({message: "Please login first to pursue this operation"});
}
}

/* LOGOUT FUNCTION */
const logout = async (req,res) =>{
    /* REQUEST THE LOGOUT */
    req.logout((err)=>{
        /* CHECK ERROR MESSAGES */
        if(err){
        /* ERROR MESSAGE */
        res.status(400).json({message: "Some error occured while making the logout"});
        /* RETURN STATEMENT */
        return next(err);
        }
        /* LOGOUT MESSAGE */
        res.status(200).json({message: "The logout went Sucessfully"});
    })
}
/* ================================================================================================================================== */


/* ================================================================================================================================== */
/* DATA MODIFIERS */
/* ================================================================================================================================== */
/* FUNCTION TO INSERT AN CERTAIN USER */
const insertUser = async (req,res) =>{
/* GET BODY DATA */
const data = req.body;
/* CREATE RANDOM ACCOUNT */
const account = web3.eth.accounts.create();
/* GET AN SALT */
const salt=await bcrypt.genSalt(11);
/* GET THE PASSWORD */
const password= await bcrypt.hash(data.password,salt);


/* MAKE THE INSERT HAPPEN */
try {
/* CASE OF SUCESS */
await sql`INSERT INTO account(public_address,private_key,password,salt,name,phone_number,city,post_code,birth_date,username) 
VALUES 
(${account.address},
${account.privateKey},
${password},
${salt},
${data.name},
${data.phone_number},
${data.city},
${data.post_code},
${data.birth_date},
${data.username})`
/* SUCESS MESSAGE */
res.status(200).json({"Sucess":"Inserted Sucessfully"});
/* IN CASE OF ERROR */
} catch (error) {
res.status(500).json({"error":"Something went wrong"});
}
}
/* ================================================================================================================================== */

module.exports = {getUser,insertUser,logout};