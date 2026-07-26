require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const Register = async(request,response)=>{
    try{
    const {name,email,password} = request.body;
    const bcryptPassword =await bcrypt.hash(password,12);
    const [rows]= await pool.query("SELECT * FROM users WHERE email=?",[email]);
    if(rows.length>0){
        response.send("User Already Exists");
    }
    else{
     const [result] = await pool.query("INSERT INTO users (name, email, password_hash) VALUES (?,?,?)", [name, email, bcryptPassword]);
       const token = jwt.sign(
  { id: result.insertId }, 
  process.env.JWT_SECRET, 
  { expiresIn: "7d" }
);
response.status(201).send({ token });
        
    }}
    catch(e){
        response.status(500).send({ error: e.message });
    }
}
const Login =async(request,response)=>{
    try{
    const {email,password}=request.body;
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?",[email]);
   if(rows.length === 0) {
  return response.status(404).json({ 
    error: "User not found",
    isNewUser: true 
  });
}
    else{
        const passCheck =await bcrypt.compare(password,rows[0].password_hash);
        if(passCheck===true){
        const payload = { id: rows[0].id };
const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
       response.send({jwtToken}); }
        else{
             response.status(400);
      response.send("Invalid Password");
        }

    }

}
catch(e){
    console.log("FULL ERROR:", e);
    response.status(500).send({ error: e.message, code: e.code, full: e.toString() });
}
}
module.exports ={Register,Login};