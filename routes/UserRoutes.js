import express from "express";
import { getuser,getallUser,updateUser,deleteUser } from "../controllers/UserController.js";
import authentication from "../middleware/Auth.js";
const router = express.Router();

router.get('/getuser',authentication,getuser);
router.get('/getalluser',getallUser);
router.put('/updateuser',authentication,updateUser);
router.delete('/deleteuser/:userid',deleteUser)

export default router;