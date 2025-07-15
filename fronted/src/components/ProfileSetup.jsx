// src/components/ProfileSetup.js
import React, { useState } from "react";
import axios from "axios";

const ProfileSetup = () => {
  const [skills, setSkills] = useState("");
  const [learningGoals, setLearningGoals] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(
      "/api/users/profile",
      {
        skills: skills.split(",").map((s) => s.trim()),
        learningGoals: learningGoals.split(",").map((s) => s.trim()),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Profile updated!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div>
        <label>Skills (comma separated):</label>
        <input
          className="border p-2 w-full"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>
      <div>
        <label>Learning Goals (comma separated):</label>
        <input
          className="border p-2 w-full"
          value={learningGoals}
          onChange={(e) => setLearningGoals(e.target.value)}
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};

export default ProfileSetup;
