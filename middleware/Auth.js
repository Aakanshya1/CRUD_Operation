import jwt from "jsonwebtoken";

export const authentication = (req, res, next) => {
    try {
   
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userid = decoded.userid;
        req.role = decoded.role; 

        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

export const authenticaterole= (role)=>{
return(req,res,next)=>{
    if(!role.includes(req.role)){
        return res.status(403).json({error:"forbidden:You don't have access"})
    }
    next();
}
}


