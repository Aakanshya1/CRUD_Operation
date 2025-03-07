import conn from "./connection/conn.js";
import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/UserRoutes.js'

dotenv.config();

const app = express();
app.use(cors());


app.use(bodyparser.json());


app.use('/auth',authRouter)
app.use('/user',userRouter)

app.get("/test",(req,res)=>{
    console.log("Server is WOrking")
    res.send("Server is working")
})
app.listen(process.env.PORT,()=>{
    console.log(`server is runing on port  ${process.env.PORT}`);
})