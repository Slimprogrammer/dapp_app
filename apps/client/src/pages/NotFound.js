import React, { useState } from "react";
import { useConnectionStore } from "../store/useConnectionStore";
import { sendToken } from "../utils/MetaMaskHelper";
import AssetInfo from "../components/AssetInfo";

export default function NotFound() {
  const { user } = useConnectionStore();

  const [receiver, setReceiver] = useState(
    "0x5Bee3f145Ac13729ad6844C7Fa5b333637C6ab5A"
  );
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");

  const handleSend = async () => {
    const result = await sendToken(null, receiver, asset, amount);
    if (result.success) {
      alert(`Transaction sent! TxHash: ${result.txHash}`);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <div>
        <h2>User Data:</h2>
      </div>
      {user && (
        <div>
          <h3>User Information:</h3>
          <p>
            <strong>user["has_joined"]</strong>:{" "}
            {user.has_joined ? "true" : "false"}
          </p>
          <p>
            <strong>user["wallet_address"]</strong>: {user.wallet_address}
          </p>
          {Object.entries(user.toKeyValue()).map(([key, value]) => (
            <p key={key}>
              <strong>{key}</strong>: {value}
            </p>
          ))}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Receiver Address"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <select onChange={(e) => setAsset(e.target.value)}>
          <option value="USDT">USDT</option>
          <option value="ETH">ETH</option>
          <option value="HT">HT</option>
          <option value="DOGE">DOGE</option>
          <option value="SHIB">SHIB</option>
          <option value="XRP">XRP</option>
          <option value="ETC">ETC</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div>
        <h3>AssetInfo:</h3>
        <p>Asset: {asset}</p>
        <AssetInfo symbol={asset} />
      </div>
    </div>
  );
}
