import { getUserbyId, getAlluser ,updateUserbyId, deleteUserbyId, findUserByEmail } from "../models/User.js";
import {transporter} from '../utils/Email.js'
import conn from "../connection/conn.js";
import moment from 'moment';
import bcrypt from 'bcryptjs';

const otpStore = {}

// viewing profile only when token is valid
export const getuser = async (req,res)=>{
    const userId = req.userid;
   
    try {
        const user = await getUserbyId(userId);
        if(!userId){
            return res.status(400)
            .json({
                message:"User not found",
            })
        }
        res.status(200)
        .json({
            message:"User found",
            name:user.name,
            email:user.email,
            success:true,
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false,
        })
    }
}

// fetch all users in database
export const getallUser =  async(req,res)=>{
    
    try {
        const user = await getAlluser();
      
        res.status(200)
        .json({
            message:"User fetched Successfully",
            user:user,
          
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}
// updating user 
export const updateUser = async(req,res)=>{
    const userId = req.userid;
    
    const {name,email}=req.body;
    try {
        const user = await getUserbyId(userId);
        if(!user){
            return res.status(404)
            .json({
                message:"user  not found"
            })
        }
          
        const updatedUser = await updateUserbyId(userId,name,email);
        if (!updatedUser) {
            return res.status(400).json({
              message: 'Failed to update user',
            });
          }
        res.status(200)
        .json({
            message:"Profile Updated Successfully",
            success:true,
            
           
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",error
        })
    }
}


// deleting user by userid
export const deleteUser = async(req,res)=>{
    const userId = req.params.userid;
    try {
        const user = await deleteUserbyId(userId);
        if(!user.affectedRows===0){
            return res.status(404)
            .json({
                message:"User Not Found",
                success:false,
            })
        }
         res.status(200)
            .json({
                message:"User deleted successfully",
                success:true,
            })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}


export const forgetPassword = (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Please provide an email" });
    }

    findUserByEmail(email)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found, please register" });
            }

            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpiry = moment().add(5, 'minutes').format("YYYY-MM-DD HH:mm:ss");

            const query = 'UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?';
            return conn.execute(query, [otp, otpExpiry, email])
                .then(() => otp); // Return otp to the next .then()
        })
        .then((otp) => {
            return transporter.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: "OTP Verification",
                html: `<p>Your OTP for password reset is: <strong>${otp}</strong> (expires in 5 minutes)</p>`
            });
        })
        .then(() => {
            res.status(200).json({ message: "OTP sent successfully", success: true });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error", success: false });
        });
};



// Verify OTP
export const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Please provide email and OTP" });
    }

    const query = 'SELECT otp, otp_expiry FROM users WHERE email = ?';
    
    conn.execute(query, [email])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const { otp: storedOtp, otp_expiry: otpExpiry } = rows[0];

            if (!storedOtp || moment().isAfter(moment(otpExpiry))) {
                return res.status(400).json({ message: "OTP has expired, request a new one" });
            }

            if (String(otp) !== String(storedOtp)) {
                return res.status(400).json({ message: "Invalid OTP, please try again" });
            }

            const deleteOtpQuery = 'UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = ?';
            return conn.execute(deleteOtpQuery, [email]);
        })
        .then(() => {
            return res.status(200).json({
                message: "OTP verified successfully",
                success: true,
                email
            });
        })
        .catch((error) => {
   
            if (!res.headersSent) {
                return res.status(500).json({ message: "Internal Server Error", success: false });
            }
        });
};


// Reset Password
export const resetPassword = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and new password" });
    }

 
    bcrypt.hash(password, 10)
        .then((hashedPassword) => {
            const query = 'UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?';

   
            return conn.execute(query, [hashedPassword, email]);
        })
        .then(([result]) => {
         
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Email not found", success: false });
            }

            res.status(200).json({ message: "Password reset successfully", success: true });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error", success: false });
        });
};