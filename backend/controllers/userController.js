const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { skills, learningGoals } = req.body;
  const user = await User.findByIdAndUpdate(req.user, { skills, learningGoals }, { new: true }).select('-password');
  res.json(user);
};