const jwt=require("jsonwebtoken");
// verify the JWT token sent by user
const authMiddleware=(req,res,next)=>{ //next-signal to next function if validation is done
    try{
        //Authentication code
        if(!process.env.JWT_SECRET){ //proces.env-access to variables in env file 
            return res.status(500).json({ 
                message:"JWT secret is not configured"
            });
        }
        const authHeader=req.headers.authorization; //header ki value read karta hain
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Authentication token is required"
            });
        }
        const token=authHeader.split(" ")[1]; //split method used to split the token
        const decoded=jwt.verify(token,process.env.JWT_SECRET); //verify method is used to verify the token
        req.user={
            id:decoded.id,
            role:decoded.role
        }; //assigning the decoded id and role to the user
        return next(); //next function is called
    }catch(error){
        //Error Handling 
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }
};
//Check whether the user has the required role
const authorizeRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"Authentication required"
            });
        }
        if(!allowedRoles.includes(req.user?.role)){ //Ye check karta hai ki logged-in user ka role allowed roles ki list mein hai ya nahi
            return res.status(403).json({
                message:"You are not authorized to perform this action"
            });
        }
        next(); //next function is called
    };
};
module.exports={authMiddleware,authorizeRoles}; //exporting the auth middleware