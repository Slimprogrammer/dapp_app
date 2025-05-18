import React, { useEffect, useState } from "react";
import { getAssetData } from "../utils/binanceHelpers";
import LiveCandlestickChart from "./LiveCandlestickChart";
import EnhancedLiveChart from "./EnhancedLiveChart";
import AssetGrid from "./AssetGrid";

const AssetInfo = ({ asset }) => {
  const [assetData, setAssetData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAssetData(asset);
      setAssetData(data);
      console.log(data);
     // console.log("Asset data:", data.symbol);
    };

    fetchData();
  }, [asset]);

  return (
    <div>
      {assetData ? (
        <div>
          <h2>{assetData.symbol}</h2>
          <p>Price: ${assetData.price}</p>
          <p>Open Price: ${assetData.openPrice}</p>
          <p>
            24h Change: {assetData.priceChange} ({assetData.priceChangePercent}
            %)
          </p>
          <p>High: ${assetData.highPrice}</p>
          <p>Low: ${assetData.lowPrice}</p>
          <p>Volume: {assetData.volume}</p>
          <AssetGrid  />
          <div>
            <h1>BTC/USDT Candlestick Chart</h1>
            <LiveCandlestickChart symbol={assetData.symbol} interval="1m" />
          </div>
          <div>
            <EnhancedLiveChart symbol={assetData.symbol} />
          </div>
        </div>
      ) : (
        <p>Loading asset data...</p>
      )}
    </div>
  );
};

export default AssetInfo;
