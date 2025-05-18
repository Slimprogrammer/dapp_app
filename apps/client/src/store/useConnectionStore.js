import { create } from "zustand";
import { io } from "socket.io-client";
import User from '../models/User';
import { ethers } from "ethers";
//const SOCKET_URL = "http://192.168.1.11:5000"; // Replace with your server URL
const SOCKET_URL = process.env.REACT_APP_BACKEND_URL; // Replace with your server URL

export const useConnectionStore = create((set) => ({
  socket: null,
  socketConnected: false,
  socket_error: null,

  metamaskConnected: false,
  walletAddress: null,
  wallet_error: null,
  user: null,

  setUser: (userData) => {
    const user = new User(userData);
    
    user.onChange((data) => {
      const { socket } = useConnectionStore.getState();
      if (socket) {
        socket.emit("userDataChanged", data);
        console.log("User data changed:", data);
      } else {
        console.warn("Socket is not connected");
      }
    });
    set({ user });
  },
  // Register an onChange listener for the user object

  clearUser: () => set({ user: null }),

  countdown: 10,
  socketInitialized: false, // Prevent multiple socket connections
  metamaskInitialized: false, // Prevent multiple MetaMask connections
  countdownInitialized: false, // Prevent multiple countdowns
  countdownInterval: null,

  connectSocket: () => {
    if (useConnectionStore.getState().socketInitialized) {
      console.warn("Socket already initialized");
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"], // Use WebSocket for real-time performance
      reconnection: true, // Auto-reconnect
      reconnectionDelay: 5000, // Retry every 1 second
    });

    socket.on("connect", () => {
      set({
        socketConnected: true,
        socket,
        socket_error: null,
        socketInitialized: true,
      });
      console.log("🔗 Socket connected");
    });
    socket?.on("user_data", (data) => {
      const { setUser } = useConnectionStore.getState();
      console.log("User data received from server in store:", data);
      setUser(data);
    });
    socket.on("disconnect", () => {
      set({ socketConnected: false, socket_error: "Socket Disconnected" });
      console.warn("⚠️ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      set({ socket_error: `Socket Error: ${err.message}` });
      console.error("❌ Socket error:", err.message);
    });

    socket.on("reconnect_attempt", () => {
      console.log("🔄 Attempting to reconnect...");
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempt(s)`);
      set({ socketConnected: true, socket_error: null });
    });

    socket.on("reconnect_failed", () => {
      set({ socket_error: "Reconnection Failed" });
      console.error("⛔ Reconnection failed");
    });

    set({ socket });
  },

  connectMetaMask: async () => {
    if (!window.ethereum) {
      set({ wallet_error: "MetaMask Not Found" });
      return;
    }
    // Prevent duplicate connections
    if (useConnectionStore.getState().metamaskInitialized) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        //const address = accounts[0];
        set({
          metamaskConnected: true,
          walletAddress: accounts[0], // Set wallet address
          wallet_error: null,
        });
        set({ metamaskInitialized: true });
        console.log("🔑 Wallet connected:", accounts[0]);
      }
    } catch (err) {
      set({ wallet_error: `MetaMask Error: ${err.message}` });
      console.error("❌ MetaMask error:", err.message);
    }
  },

  startCountdown: () => {
    let count = 10;
    const interval = setInterval(() => {
      if (count <= 0) {
        clearInterval(interval);
        window.location.reload();
      }
      set({ countdown: count-- });
    }, 1000);
  },
}));
