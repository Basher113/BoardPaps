
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const authConfig = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token.utils");
require('dotenv').config();


const registerController = async (req, res) => {
  const {username, email, password} = req.body;
  try {
    // Check if email is still valid
    const emailInvalid = await prisma.user.findUnique({
      where: {email}
    });

    if (emailInvalid) {
      return res.status(400).json({errors: {"email": ["Email Already Taken"]}});
    }

    // Check if username is still valid
    const usernameInvalid = await prisma.user.findUnique({
      where: {username}
    });
    if (usernameInvalid) {
      return res.status(400).json({errors: {"username": ["Username Already Taken"]}});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    return res.status(201).json({message: "User registered successfully"});
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const loginController = async (req, res) => {
  const {email, password} = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });
    if (!user) {
      return res.status(400).json({message: "Invalid Credentials"});
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({message: "Invalid Credentials"});
    }

    // (user login while still logged in)
    const existingToken = req.cookies?.refreshToken;
    if (existingToken) {
      console.log("Revoke existing")
      try {
        await prisma.refreshToken.update({
          where: { token: existingToken, userId: user.id, revoked: false },
          data: { revoked: true },
        });
      } catch (err) {
        console.log("Error revoking old refresh token:", err);
      }
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 days
      }
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    const {id, email: userEmail, username, googleId, provider, avatar, role, createdAt, updatedAt } = user;
    return res.json({id, email: userEmail, username, googleId, provider, avatar, role, createdAt, updatedAt });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({error});
  }
};

const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
   

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    return res.json({ message: "Logged out successfully" });

  } catch (error) {
    console.log("Logout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token not found" });

    const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!storedToken) return res.status(403).json({ message: "Invalid Token" });

    if (storedToken.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revoked: false },
        data: { revoked: true },
      });
      return res.status(403).json({ message: "Revoked Token" });
    }

    // verify token synchronously
    try {
      const decoded = jwt.verify(refreshToken, authConfig.refresh_secret);
      if (decoded.userId !== storedToken.userId) {
        return res.status(403).json({ message: "Invalid token" });
      }
    } catch (err) {
      console.log("Refresh Token Verify Error:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    const accessToken = generateAccessToken(storedToken.userId);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    return res.json({ message: "Refresh token successfully" });

  } catch (error) {
    console.log("Refresh Token Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUserDataController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: req.user.id},
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
      }
    
    }
    );
    return res.json(user);
  } catch (error) {
    console.log("Error getting users:", error);
    return res.status(500).json({message: "Internal Service Error"});
  }
}


module.exports = {registerController, loginController, logoutController, refreshTokenController, getCurrentUserDataController};