import express from "express"
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send("Hello World!");
});

app.listen(PORT,()=>{
    connectToDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});