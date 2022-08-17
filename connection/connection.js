/* IMPORT THE POSTGRES */
const postgres = require("postgres")
/* CONFIG OPTIONS */
require('dotenv').config();
/* THE CONNECTION */
const sql = postgres(`postgres://${process.env.USERDB}:${process.env.PASSDB}@${process.env.HOSTDB}:${process.env.PORTDB}/${process.env.DATADB}`);
/* EXPORT IT */
module.exports=sql;