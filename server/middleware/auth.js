const jwt = require("jsonwebtoken");
require("dotenv").config();
const Authententicateuser = (request,response,next) =>{
    let jwtToken;
    const token = request.headers["authorization"];
    if(token!==undefined){
        jwtToken = token.split(" ")[1];
    }
    if(jwtToken===undefined){
        response.status(401);
        response.send("Invalid JWT Token");
    }
    else{
        
        jwt.verify(jwtToken,process.env.JWT_SECRET,(error,payload)=>{
            if(error){
                response.status(401);
        response.send("Invalid JWT Token");
            }
            else{
                request.user=payload;
                next();
            }
        })
    }

}
module.exports = Authententicateuser;