import React, { useEffect, useState } from "react";
import { useConnectionStore } from "../store/useConnectionStore";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Stack,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
} from "react-bootstrap";
import AssetInfo from "../components/AssetInfo";
import AssetGrid from '../components/AssetGrid';
import CryptoNews from '../components/CryptoNews';

export default function Dashboard() {
    const { walletAddress, user } = useConnectionStore();
    const [asset, setAsset] = useState("USDT");
    const assets_list = [
      "USDT",
      "BCH",
      "DOGE",
      "ETC",
      "SHIB",
      "SOL",
      "XRP",
      "BNB",
      "ETH",
      "PEPE",
    ];
  return (
    <div>
      <h1>Dashboard</h1>
      
      <select onChange={(e) => setAsset(e.target.value)}>
        {assets_list.map((asset, index) => (
          <option value={asset}>{asset}</option>
        ))}
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
