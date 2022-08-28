/* REQUIRE THE SQL CONNECTION */
const sql = require('../connection/connection');


//FUNCTION TO CREATE AN ASSET
createAssets= (req,res) =>{
//REQUEST THE BODY
data = req.body;
//INSERTING AN ASSET
sql`INSERT INTO asset (contract_address,type) VALUES (${data.contract_address},${data.type})`
//RESULT
.then(result=>{
    res.status(200).json({msg:"Sucess",result});
})
//CATCH THE ERROR
.catch(err=>{
    res.status(500).json({msg:"Something went wrong",err})
})
}

//FUNCTION TO GET THE ASSETS
getAssets = (req,res) =>{
//THE GET
sql`SELECT * FROM asset`
//THE RESULT
.then(result=>{
res.status(200).json(result);
})
//THE ERROR CATCHED
.catch(err=>{
res.status(500).json({msg:"Something went wrong",err});
})
}
//EXPORT IT
module.exports = {createAssets,getAssets};