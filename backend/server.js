import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import matchRoutes from "./routes/match.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/match", matchRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(5000, () => console.log("Server running")))
  .catch(err => console.log(err));

// Socket.io logic
const users = {};

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => { users[userId] = socket.id; });
  socket.on("send_message", ({ to, message, from }) => {
    if (users[to]) io.to(users[to]).emit("receive_message", { from, message });
  });
  socket.on("disconnect", () => {
    for (const [userId, id] of Object.entries(users)) {
      if (id === socket.id) delete users[userId];
    }
  });
});