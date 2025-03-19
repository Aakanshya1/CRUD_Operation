import express from "express";
import { getuser,getallUser,updateUser,deleteUser, verifyOtp, forgetPassword, resetPassword} from "../controllers/UserController.js";
import {authentication , authenticaterole} from '../middleware/Auth.js'
const router = express.Router();

router.get('/getuser',authentication,getuser);
router.get('/getalluser',getallUser);
router.put('/updateuser',authentication,updateUser);
router.delete('/deleteuser/:userid',deleteUser)
router.post('/forgetPassword',forgetPassword)
router.post('/verify-otp',verifyOtp)
router.post('/reset-password',resetPassword)

router.get("/user-dashboard", authentication, authenticaterole(["user"]), (req, res) => {
    res.json({ message: "Welcome to User Dashboard" });
});

// Admin-only route
router.get("/admin-dashboard", authentication, authenticaterole(["admin"]), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" });
});

// Superadmin-only route
router.get("/superadmin-dashboard", authentication, authenticaterole(["superadmin"]), (req, res) => {
    res.json({ message: "Welcome to Super Admin Dashboard" });
});
export default router;