import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { createUser,findUserByEmail } from "../models/User.js";

export const signup = async(req,res)=>{
    const {name, email,password,comfirmpassword,role}=req.body;
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
        const result = await createUser(name, email,passwordhash,role);
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

export const login = async (req, res,role) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find user by email
        const user = await findUserByEmail(email);
        if (!user|| user.role !==role) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token with role
        const jwttoken = jwt.sign(
            {
                email: user.email,
                userid: user.id,
                role: user.role, // Include role for authorization
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(200).json({
            message: "Login Successful",
            success: true,
            jwttoken,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
export const userLogin = (req, res) => login(req, res, "user");
export const adminLogin = (req, res) => login(req, res, "admin");
export const superAdminLogin = (req, res) => login(req, res, "superadmin");

