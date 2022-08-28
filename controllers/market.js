//GET THE SQL
const sql = require('../connection/connection');

//CREATE AN SALE FUNCTION
createSale = (req,res) =>{
//GET THE DATA
    data = req.body;
//TRE INSERT
sql`INSERT INTO market (seller,price,status,date,contract_address) VALUES (${data.seller},${data.price},'Selling',${data.date},${data.contract_address})`
//THE RESULT
.then(result=>{
    res.status(200).json({msg:"Sucess",result});
})
//THE ERROR
.catch(err=>{
    res.status(500).json({msg:"Something went wrong",err});
})

}

//FUNCTION TO GET SALES
getSales = (req,res) =>{
    //THE GET
    sql`SELECT * FROM market`
    //THE RESULT
    .then(result=>{
        res.status(200).json(result);
    })
    //THE ERROR
    .catch(err=>{
        res.status(500).json(err);
    })
}


//FUNCTION TO BUY
buy = (req,res) =>{
  //THE DATA
  data = req.body;
  //THE UPDATE
  sql`UPDATE market SET (buyer,status,sold_date) = (${data.buyer},'Sold',${data.sold_date}) WHERE id=${data.id}`
  //THE RESULT
  .then(result=>{
    res.status(200).json({msg:"Sucess",result});
  })
  //THE ERROR
  .catch(err=>{
    res.status(500).json({msg:"Error",err});
    console.log(err);
  })
  
}
//EXPORT IT
module.exports = {buy,createSale,getSales};