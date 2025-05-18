import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { io } from "socket.io-client";
import { useConnectionStore } from "../store/useConnectionStore";

const NotificationToast = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
const {
    connectSocket,
    connectMetaMask,
    socketConnected,
    metamaskConnected,
    walletAddress,
    socket,
  } = useConnectionStore();
  useEffect(() => {
    // Listen for server notifications
    socket.on("serverNotification", (data) => {
      console.log("🔔 Notification received:", data);
      setMessage(data.message);
      setShow(true);
    });

    return () => socket.off("serverNotification");
  }, []);

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        bg="info"
        onClose={() => setShow(false)}
        show={show}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">🔔 Notification</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificationToast;
