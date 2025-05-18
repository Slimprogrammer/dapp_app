import React from "react";
import useWalletStore from "../store/walletStore";

const WalletConnect = () => {
  const { walletAddress, isConnected, connectWallet } = useWalletStore();

  return (
    <div>
      <button onClick={connectWallet}>
        {isConnected ? "Connected" : "Connect Wallet"}
      </button>
      {isConnected && <p>Wallet: {walletAddress}</p>}
    </div>
  );
};

export default WalletConnect;
