const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, skills, learningGoals } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash, skills, learningGoals });
    await user.save();
    res.status(201).json({ msg: "Registered" });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, skills: user.skills, learningGoals: user.learningGoals } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};