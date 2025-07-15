// src/components/PeerMatch.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const PeerMatch = () => {
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    const fetchPeers = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/match/peers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPeers(res.data);
    };
    fetchPeers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Matched Peers</h2>
      <ul>
        {peers.map((peer) => (
          <li key={peer._id} className="mb-2 p-2 border rounded">
            <div>
              <b>{peer.name}</b>
            </div>
            <div>Skills: {peer.skills.join(", ")}</div>
            <div>Wants to learn: {peer.learningGoals.join(", ")}</div>
            {/* Add a button to start chat */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeerMatch;
