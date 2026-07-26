const pool = require("../config/db");
const addApplication =async(req,response)=>{
    try{
    const {company_name,role,status,applied_date,notes} = req.body;
    const user_id = req.user.id;
    const [result] = await pool.query("INSERT INTO applications (user_id,company_name,role,status,applied_date,notes) VALUES(?,?,?,?,?,?)",[user_id,company_name,role,status,applied_date,notes]); 
    if(result.affectedRows===1){
        response.status(200).send("Application Added Succesfully");
    }
    else{
          response.status(500).send("OOps! Something Went Wrong");
    }
}
catch(e){
     response.send({ error: e.message });
}


}
const getApplication =async(req,response)=>{
    try{
   const user_id = req.user.id
    const [rows] = await pool.query("SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC",[user_id]);
    response.send(rows);
    
}
catch(e){
     response.status(500).send({ error: e.message });
}
}


const updateApplication =async(req,response)=>{
    try{
    const appl_id = req.params.id;
    const status = req.body.status;
    const user_id = req.user.id;
    const [result] = await pool.query("UPDATE applications SET status=? WHERE id=? AND user_id=?",[status,appl_id,user_id]); 
    if(result.affectedRows===1){
        response.status(200).send("Application Updated Succesfully");
    }
    else{
          response.status(500).send("OOps! Something Went Wrong");
    }
}
catch(e){
     response.send({ error: e.message });
}
}




const deleteApplication =async(req,response)=>{
    try{
    const user_id = req.user.id;
const appl_id = req.params.id;
    const [result] = await pool.query("DELETE FROM applications WHERE id=? AND user_id=?",[appl_id,user_id]); 
    if(result.affectedRows===1){
        response.status(200).send("Application Deleted Succesfully");
    }
    else{
          response.status(500).send("OOps! Something Went Wrong");
    }
}
catch(e){
     response.send({ error: e.message });
}
}

module.exports = { addApplication, getApplication, updateApplication, deleteApplication };