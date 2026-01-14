import express from "express"
import { connectToDB } from "./config/db.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "./models/user.model.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Hello World!");
});

app.post("/api/signup",async(req,res)=>{
    const {username,email,password}=req.body;

    try{
        if (!username || !email || !password) {
            throw new Error("All fields are required!");
        }

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            return res
            .status(400)
            .json({ message: "Username is taken, try another name." });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (userDoc) {
            // jwt.sign(payload, secret, options)
            const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }


    return res
      .status(200)
      .json({ user: userDoc, message: "User created successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT,()=>{
    connectToDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});