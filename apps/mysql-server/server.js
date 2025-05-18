const express = require("express");
const db = require("./db");
const User = require("./User");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { insertData, selectAll } = require("./db");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("wallet_connected", async ({address, role}) => {
    console.log(
      `Wallet ${address} with role ${role} connected on socket ${socket.id}`
    );
    if (!address) return;
    if (!role) return;

    /* // Check if the address is already connected
    if (users[address] && users[address].includes(socket.id)) {
      console.log(`Wallet ${address} is already connected`);
      return;
    }
    

    // Store or update socket list for the address
    if (!users[address]) users[address] = [];
    users[address].push(socket.id);

    console.log(`Wallet ${address} connected on socket ${socket.id}`);
    console.log("Current users:", users);
     */

    try {
      const exists = await db.valueExists("users", "wallet_address", address);
      if (!exists) {
        await db.insertData("users", {
          wallet_address: address,
          role: role,
        });
        const uData = await db.selectRow("users", {
          wallet_address: address,
        });
        console.log(
          `Inserted new user with wallet ${address} and role ${role} and user_id ${uData.user_id}`
        );

        db.assets_list.forEach(async (element) => {
         await db.insertData("assets", {
           user_id: uData.user_id,
           asset_name: element,
         });
        });
      }

      // Update the user socket_id if it already exists
      const result = await db.updateData(
        "users",
        { socket_id: socket.id },
        { wallet_address: address }
      );
      console.log(
        `Update user with wallet ${address} to socket_id ${socket.id} resulted: ${result}`
      );

      const userData = await db.selectRow("users", { wallet_address: address });
      console.log("User data:", userData);
      if (userData) {
        socket.emit("user_data", userData);
        socket.emit("serverNotification", {
          message: `${role} with Wallet ${address} connected  on server socket id ${socket.id} successfully.`,
        });
      } else {
        console.log("User data not found in DB");
      }

      const userAssetData = await db.selectAllWithConditions("assets", {
        user_id: userData.user_id,
      });
      console.log("User assets data:", userAssetData);
      if (userAssetData) {
        socket.emit("user_assets_data", userAssetData);
      }
      else {
        console.log("User assets data not found in DB");
      }
    } catch (error) {
      console.error("DB error:", error);
    }
  });

  socket.on("userDataChanged", async (data) => {

    // Log the user data change
    console.log("User data changed:", data["key"], data["newValue"]);
    // Update the database with the new value
    await db.updateData(
      "users",
      { [data["key"]]: data["newValue"] },
      { socket_id: socket.id }
    );
    console.log(
      `Updated user with socket ID ${socket.id}: ${data["key"]} = ${data["newValue"]}`
    );
    
    const userData = await db.selectRow("users", { socket_id: socket.id });
    if (userData) {
      console.log("User data found in DB", userData);
    }
    
    // Emit the updated user data to all connected clients
    socket.emit("serverNotification", {
      message: `User data updated successfully.`,
    });
    console.log(
      `User data updated successfully for socket ID ${socket.id}: ${data["key"]} = ${data["newValue"]}`
    );
    // Emit the updated user data to the user
    socket.emit("user_data", userData);
  }
  );


  socket.on("disconnect", async () => {
    await db.updateData(
      "users",
      { socket_id: null },
      { socket_id: socket.id }
    );
    console.log(`Disconnected socket ${socket.id} and updated DB`);
    // Remove the socket ID from the users object
  });
});

// REST API route to insert data
app.post("/add-user", async (req, res) => {
  try {
    const userId = await db.insertData("users", req.body);
    console.log("User added with ID:", userId);
    res.json({ success: true, userId });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ success: false, message: "Error inserting data" });
  }
});

// REST API route to get all users
app.get("/test", async (req, res) => {
  try {
    const users = await db.selectAll("users");
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ success: false, message: "Error getting users" });
  }
});
app.get("/test/user/:wallet_address/:role", async (req, res) => {
  try {
    const users = new User(req.params.wallet_address, req.params.role);
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ success: false, message: "Error getting users" });
  }
});
// Start both Express and Socket.io
httpServer.listen(5000, () => {
  console.log("Express + WebSocket server running on http://localhost:5000");
});
