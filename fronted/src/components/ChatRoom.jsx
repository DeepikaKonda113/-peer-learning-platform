// src/components/ChatRoom.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Use your backend URL

const ChatRoom = ({ roomId, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    socket.emit("chatMessage", { roomId, message: input, sender: user.name });
    setInput("");
  };

  return (
    <div className="border rounded p-4">
      <div className="h-64 overflow-y-scroll mb-2">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.sender}:</b> {msg.message}
          </div>
        ))}
      </div>
      <input
        className="border p-2 mr-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
