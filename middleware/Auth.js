import jwt from "jsonwebtoken"

export const authentication = (req, res,next)=>{
    const token = req.headers ['authorization']?.split(' ')[1];
    if(!token){
        return res.status(400)
        .json({
            message:"Access Denied",
        })
    }
    try {
        console.log("token",token)
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        console.log(decoded)
        req.userid = decoded.userid;
        console.log(decoded.userid)
        next();
        
    } catch (error) {
        res.status(400).json({message:"Invalid Token"})
    }
}

export default authentication;