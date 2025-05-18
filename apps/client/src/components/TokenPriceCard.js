import React, { useEffect, useState } from 'react';
import { getERC20MarketData } from "../utils/MetaMaskHelper";

const TokenPriceCard = ({ tokenName }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      const result = await getERC20MarketData(tokenName);
      setData(result);
    };

    fetchMarketData();
  }, [tokenName]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="token-card">
      <h2>{data.token.toUpperCase()}</h2>
      <p>Open: ${data.open}</p>
      <p>High: ${data.high}</p>
      <p>Low: ${data.low}</p>
      <p>Close (24h): ${data.close}</p>
      <p>Real-Time: ${data.real_time_current}</p>
    </div>
  );
};

export default TokenPriceCard;