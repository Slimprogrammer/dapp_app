const mysql = require("mysql2/promise");
require("dotenv").config();

const express = require("express");
const axios = require('axios');
const db = require("./db");
const User = require("./User");
const { createServer } = require("http");
const cors = require("cors");
const { insertData, selectAll } = require("./db");
const app = express();
const httpServer = createServer(app);


const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());


// REST API route to get all users
app.get("/test", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: process.env.DB_HOST });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ success: false, message: process.env.DB_HOST });
  }
});

// Start both Express and Socket.io
httpServer.listen(5000, () => {
  console.log("Express + WebSocket server running on http://localhost:5000");
});
