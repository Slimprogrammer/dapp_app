import React from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useConnectionStore } from "../store/useConnectionStore";
import { useNavigate } from "react-router-dom";

const ConnectionStatus = () => {
  const {
    socketConnected,
    metamaskConnected,
    walletAddress,
    socket_error,
    wallet_error,
    countdown,
  } = useConnectionStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (wallet_error === "MetaMask Not Found") {
      navigate("/not-found");
    }
  }, [wallet_error, navigate]);

  return (
    <div className="p-3">
      {socket_error && (
        <Alert variant="danger">
          {socket_error} - Refreshing in {countdown} seconds...
        </Alert>
      )}
      {wallet_error && (
        <Alert variant="danger">
          {wallet_error} - Refreshing in {countdown} seconds...
        </Alert>
      )}
      <Alert variant={socketConnected ? "success" : "warning"}>
        Socket.io: {socketConnected ? "Connected ✅" : "Connecting..."}{" "}
        {!socketConnected && <Spinner animation="border" size="sm" />}
      </Alert>
      <Alert variant={metamaskConnected ? "success" : "warning"}>
        MetaMask: {metamaskConnected ? "Connected ✅" : "Not Connected"}
      </Alert>
      {walletAddress && (
        <Alert variant="info">
          Wallet Address: <strong>{walletAddress}</strong>
        </Alert>
      )}
    </div>
  );
};

export default ConnectionStatus;
