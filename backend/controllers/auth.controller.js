import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import authBloomFilter from "../services/authBloomFilter.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validation
    if (!username || !email || !password) {
      throw new Error("All fields are required!");
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // ✨ BLOOM FILTER OPTIMIZATION - USERNAME CHECK ✨
    console.log(`🔍 Checking username: ${username}`);
    const usernameMightExist = await authBloomFilter.usernameMightExist(username);
    
    if (!usernameMightExist) {
      // Bloom filter says username definitely doesn't exist
      // Skip database check!
      console.log(`⚡ Bloom filter: Username "${username}" available (no DB query)`);
    } else {
      // Bloom filter says username might exist - check database
      console.log(`🔍 Bloom filter: Username might exist, checking DB...`);
      
      if (await User.findOne({ username })) {
        return res
          .status(400)
          .json({ message: "Username is taken, try another name." });
      }
    }

    // ✨ BLOOM FILTER OPTIMIZATION - EMAIL CHECK ✨
    console.log(`🔍 Checking email: ${email}`);
    const emailMightExist = await authBloomFilter.emailMightExist(email);
    
    if (!emailMightExist) {
      // Bloom filter says email definitely doesn't exist
      console.log(`⚡ Bloom filter: Email "${email}" available (no DB query)`);
    } else {
      // Bloom filter says email might exist - check database
      console.log(`🔍 Bloom filter: Email might exist, checking DB...`);
      
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already exists." });
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const userDoc = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // ✨ Add to bloom filters after successful registration
    authBloomFilter.addUser(username, email);
    console.log(`✅ Added "${username}" and "${email}" to bloom filters`);

    // Generate JWT token
    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
      },
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = bcryptjs.compareSync(password, userDoc.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
      },
      message: "Logged in successfully.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * @desc    Check username availability (with bloom filter)
 * @route   GET /api/auth/check-username/:username
 * @access  Public
 */
export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters",
      });
    }

    const isAvailable = await authBloomFilter.isUsernameAvailable(username);

    res.status(200).json({
      available: isAvailable,
      username,
    });
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Check email availability (with bloom filter)
 * @route   GET /api/auth/check-email/:email
 * @access  Public
 */
export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.params;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const isAvailable = await authBloomFilter.isEmailAvailable(email);

    res.status(200).json({
      available: isAvailable,
      email,
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get bloom filter stats (admin/monitoring)
 * @route   GET /api/auth/bloom-stats
 * @access  Public (change to protected in production)
 */
export const getBloomFilterStats = async (req, res) => {
  try {
    const stats = await authBloomFilter.getStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Get bloom stats error:", error);
    res.status(500).json({ message: error.message });
  }
};