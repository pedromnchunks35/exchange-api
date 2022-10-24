//JSON WEB TOKENS
const jwt = require('jsonwebtoken');
//DOTENV
require('dotenv').config();
//FUNCTION TO VERIFY THE TOKEN
const authenticateToken = async (token) =>{
//VERIFTY THE TOKEN
const username = jwt.verify(token,process.env.TOKEN.toString(),(err,user)=>{
// CASE ERROR
if(err){
return false;
// CASE SUCESS
}else{
return user.username;
}
});
//RETURN THE RESULT
return username;
//RESULT OF THE VERIFIED TOKEN
}
//EXPORT IT
module.exports = authenticateToken;