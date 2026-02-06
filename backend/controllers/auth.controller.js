import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= SIGN UP (USER ONLY) ================= */
export const signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username is taken." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // 🔒 FORCED
    });

    const token = jwt.sign(
      { id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      user: userDoc,
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const loginInput = username.trim().toLowerCase();

    const userDoc = await User.findOne({
      $or: [{ username: loginInput }, { email: loginInput }],
    });

    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      userDoc.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      user: userDoc,
      message: "Logged in successfully.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
