import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.put("/profile", auth, async (req, res) => {
  const { skills, learningGoals } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { skills, learningGoals },
    { new: true }
  ).select("-password");
  res.json(user);
});

export default router;