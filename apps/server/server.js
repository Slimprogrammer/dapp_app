const express = require("express");
const axios = require('axios');
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
      socket.emit("serverNotification", {
        message: `${role} with Wallet ${address} connected  on server socket id ${socket.id} successfully.`,
      });
      console.log(
        `Update user with wallet ${address} to socket_id ${socket.id} resulted: ${result}`
      );

      const userData = await db.selectRow("users", { wallet_address: address });
      if (userData) {
        const userAssetData = await db.selectAllWithConditions("assets", {
          user_id: userData.user_id,
        });
        socket.emit("user_data", userData, userAssetData); // Emit the user data
        
      } else {
        console.log("User data not found in DB");
      }

      
     
    } catch (error) {
      console.error("DB error:", error);
    }
  });

  socket.on("userDataChanged", async (data) => {
    // Emit the updated user data to all connected clients
    socket.emit("serverNotification", {
      message: `User data updated successfully.`,
      data: data
    });
    /*
    
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
    
    */
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
app.get("/test/url", async (req, res) => {
  try {
    const baseUrl = 'https://data-api.coindesk.com/asset/v2/metadata';
    const params = {"asset_lookup_priority":"SYMBOL","quote_asset":"USD","asset_language":"en-US","assets":"PEPE","api_key":"1034ebf65c30ef02a206585ffdf968e545fea4e3d4db7c718b518a0fd96742a6"};
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();

    const options = {
        method: 'GET',
        headers:  {"Content-type":"application/json; charset=UTF-8"},
    };

    fetch(url, options)
        .then((response) => response.json())
      .then((json) => {
        console.log(json["LOGO_URL"]);
        console.log(json.LOGO_URL);  
        })
      .catch((err) => console.log(err));
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ success: false, message: "Error getting users" });
  }
});

// Load your CoinDesk API key securely from environment variables in your backend
// Make sure COINDESK_API_KEY is defined in your backend's .env file, e.g.,
const COINDESK_API_KEY="1034ebf65c30ef02a206585ffdf968e545fea4e3d4db7c718b518a0fd96742a6"
// const COINDESK_API_KEY = process.env.COINDESK_API_KEY;
const COINDESK_API_BASE_URL = "https://data-api.coindesk.com";

// Your proxy endpoint that the React frontend calls
app.get('/api/coindesk/asset-logo', async (req, res) => {
    // Extract the 'symbol' query parameter from the frontend request
    const symbol = req.query.symbol;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required as a query parameter.' });
    }
    if (!COINDESK_API_KEY) {
        console.error("CoinDesk API Key is not configured on the backend server.");
        return res.status(500).json({ error: 'Server configuration error: CoinDesk API Key missing.' });
    }

    try {
        // Construct the full CoinDesk API URL
        const coindeskUrl = `${COINDESK_API_BASE_URL}/asset/v1/summary/list`;
        const coindeskParams = {
            assets: symbol.toUpperCase(),
            groups: 'BASIC' // Ensure we request the 'BASIC' group for LOGO_URL
        };

        // Make the actual request to the CoinDesk API from your backend
        // This request is server-to-server, so CORS is not an issue here.
        const coindeskResponse = await axios.get(coindeskUrl, {
            headers: {
                'X-API-Key': COINDESK_API_KEY // Include the API key in the server-side request
            },
            params: coindeskParams
        });

        // Extract the relevant logo URL from the CoinDesk response
        // Based on the provided response format, data is nested under 'Data' key
        const coindeskData = coindeskResponse.data.Data;
        let logoUrl = null;

        if (coindeskData && coindeskData.LIST && coindeskData.LIST.length > 0) {
            const asset = coindeskData.LIST.find(item => item.SYMBOL === symbol.toUpperCase());
            if (asset && asset.LOGO_URL) {
                logoUrl = asset.LOGO_URL;
            } else {
                console.warn(`Backend: Logo URL not found for symbol '${symbol}' in CoinDesk response.`);
            }
        } else {
            console.warn(`Backend: No asset data found for symbol '${symbol}' from CoinDesk API.`);
        }

        // Send the extracted logoUrl back to your frontend
        res.json({ logoUrl });

    } catch (error) {
        // Log the error for server-side debugging
        console.error("Backend Error calling CoinDesk API:", error.response?.status, error.response?.data || error.message);

        // Forward a generic error message to the frontend, or more specific if needed
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch logo from CoinDesk API via proxy.',
            details: error.response?.data?.Err || error.message // Include more details if available
        });
    }
});

// Start both Express and Socket.io
httpServer.listen(5000, () => {
  console.log("Express + WebSocket server running on http://localhost:5000");
});
