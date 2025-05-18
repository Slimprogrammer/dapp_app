import React, { useEffect, useState } from 'react';
import AssetInfo from "../components/AssetInfo";
import AssetGrid from '../components/AssetGrid';
import CryptoNews from '../components/CryptoNews';

export default function Dashboard() {
    const [asset, setAsset] = useState("USDT");

  return (
    <div>
      <h1>Dashboard</h1>
      <select onChange={(e) => setAsset(e.target.value)}>
        <option value="USDT">USDT</option>
        <option value="ETH">ETH</option>
        <option value="HT">HT</option>
        <option value="DOGE">DOGE</option>
        <option value="SHIB">SHIB</option>
        <option value="XRP">XRP</option>
        <option value="ETC">ETC</option>
      </select>

      <div>
        <h3>AssetInfo:</h3>
        <p>Asset: {asset}</p>
        <AssetInfo asset={asset} />
        <CryptoNews />
      </div>
     
    </div>
  );
}
