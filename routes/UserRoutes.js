import express from "express";
import { getuser,getallUser,updateUser,deleteUser, verifyOtp, forgetPassword, resetPassword} from "../controllers/UserController.js";
import authentication from "../middleware/Auth.js";
const router = express.Router();

router.get('/getuser',authentication,getuser);
router.get('/getalluser',getallUser);
router.put('/updateuser',authentication,updateUser);
router.delete('/deleteuser/:userid',deleteUser)
router.post('/forgetPassword',forgetPassword)
router.post('/verify-otp',verifyOtp)
router.post('/reset-password',resetPassword)

export default router;