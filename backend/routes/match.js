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

router.get("/peers", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const peers = await User.find({
    _id: { $ne: user._id },
    skills: { $in: user.learningGoals },
    learningGoals: { $in: user.skills }
  }).select("-password");
  res.json(peers);
});

export default router;