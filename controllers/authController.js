import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { createUser,findUserByEmail } from "../models/User.js";

export const signup = async(req,res)=>{
    const {name, email,password,comfirmpassword}=req.body;
    if(!name || !email || !password || !comfirmpassword ){
        return res.status(400)
        .json({
            success:false,
            message:"All fields are required"
        })
    }
    try {
        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(400)
            .json({
                message:"User Already exist"
            })
        }
        const passwordhash  = await bcrypt.hash(password,10);
        const result = await createUser(name, email,passwordhash);
         res.status(200)
        .json({
            message:"Signup successfull",
            success:true,
            result:result,
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Signup failed",
            success:false,
        })
    }
}

export const login = async (req, res)=>{
    const {email, password}= req.body;
    if(!email ||!password){
        return res.status(400)
        .json({
            message:"All fields are required",
        })
    }

    try {
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(400)
            ,json({
                message:"User Not found"
            })
        }
        const passmatch = await bcrypt.compare(password, user.password)
        if(!passmatch){
            return res.status(400)
            .json({
                message:"Invalid Password"
            })
        }

        const jwttoken = jwt.sign({
            email:user.email,
            userid: user.id
        },process.env.JWT_SECRET,{expiresIn:"1h"}
    )

      res.status(200)
      .json({
        message:"Login Successfull",
        success:true,
        jwttoken,
      })

    } catch (error) {
        res.status(500)
        .json({
            message:"INternal Server Error",
            success:false
        })
    }
}

