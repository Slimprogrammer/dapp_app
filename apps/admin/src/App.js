import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ConnectionStatus from "./components/ConnectionStatus";
import { useConnectionStore } from "./store/useConnectionStore";
import NotFound from "./pages/NotFound";
import WalletError from "./pages/WalletError";
import UnsupportedBrowser from "./pages/UnsupportedBrowser";
import AppNavBar from "./components/AppNavBar";
import Dashboard from "./pages/Dashboard";
import NotificationToast from "./utils/NotificationToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const {
    connectSocket,
    connectMetaMask,
    socketConnected,
    metamaskConnected,
    walletAddress,
    socket,
    user,
    setUser,
  } = useConnectionStore();

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      connectSocket();
      connectMetaMask();
      initialized.current = true; // Ensures the effect runs only once
    }
  });

  // Listen for wallet address from MetaMask
  useEffect(() => {
    // Listen for user data from the server
    socket?.on("user_data", (data) => {
      setUser(data);
      console.log("User data received from server:", data);
      // Check if the user has joined
      if (data.has_joined === 1) {
        console.log("User has joined the event.");
      } else {
        console.log("User has not joined the event.");
      }
    });

    return () => {
      socket?.off("user_data");
    };
  }, [socket, setUser, user]);
  // Listen for server notifications

  // Emit wallet address to the server via Socket.io
  useEffect(() => {
    if (socketConnected && metamaskConnected && walletAddress && socket) {
      socket.emit("wallet_connected", { address: walletAddress , role: "admin" });
      console.log(
        "📤 Wallet address emitted on both connections success:",
        walletAddress
      );
    }
  }, [socketConnected, metamaskConnected, walletAddress, socket]);

  return (
    <Router>
      <div className="container mt-3">
        {socketConnected && metamaskConnected ? (
          <>
            <NotificationToast />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
            />

            <AppNavBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="/error" element={<WalletError />} />
              <Route path="/not-supported" element={<UnsupportedBrowser />} />
            </Routes>
          </>
        ) : (
          <ConnectionStatus />
        )}
      </div>
    </Router>
  );
};

export default App;
