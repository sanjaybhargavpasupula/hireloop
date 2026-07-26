const pool = require("../config/db");
const addProblem=async(request,response)=>{
    try{
    const {problem_name,platform,difficulty,topic,time_spent_minutes,notes} = request.body;
    const user_id = request.user.id;
   const [result] = await pool.query(
  "INSERT INTO problems (user_id, problem_name, platform, difficulty, topic, time_spent_minutes, notes) VALUES (?,?,?,?,?,?,?)",
  [user_id, problem_name, platform, difficulty, topic, time_spent_minutes, notes]
);
    if(result.affectedRows===1){ 
       response.status(200).send("Keep it Up! Achievement Added Successfully");
    }
    else{
       response.status(500).send("Something went wrong");
    }
}
catch(e) {
    response.status(500).send({ error: e.message });
  }
}
const getProblems = async(request, response) => {
  try {
     const user_id = request.user.id;
const [rows] =await pool.query("SELECT * FROM problems WHERE user_id = ? ORDER BY created_at DESC", [user_id])
  response.send(rows);
  } catch(e) {
    response.status(500).send("OOps! Something Went Wrong!")
  }

}

const getStats = async(request, response) => {
  try {
    const user_id = request.user.id;
    const [rows] = await pool.query(
      "SELECT topic, difficulty, COUNT(*) as count FROM problems WHERE user_id = ? GROUP BY topic, difficulty",
      [user_id]
    );
    response.send(rows);
  } catch(e) {
    response.status(500).send({ error: e.message });
  }
}
module.exports = { addProblem, getProblems, getStats };