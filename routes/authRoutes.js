import express from "express";
import { signup,login,userLogin,adminLogin,superAdminLogin } from "../controllers/authController.js";
// import {authentication,authenticaterole} from '../middleware/Auth.js'
const router = express.Router();

router.post('/register',signup);
// router.post('/login',login);
router.post("/login/user", userLogin);
router.post("/login/admin", adminLogin);
router.post("/login/superadmin", superAdminLogin);

export default router; 