import React, { useEffect, useState } from "react";
import AssetCard from "./AssetCard";
import { Dropdown, Form, Spinner } from "react-bootstrap";

const allSymbols = [
  "BTCUSDT", "ETHUSDT", "XRPUSDT", "DOGEUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT"
];

const AssetGrid = () => {
  const [selectedSymbols, setSelectedSymbols] = useState(["BTCUSDT", "ETHUSDT"]);
  const [assets, setAssets] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSymbolToggle = (symbol) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = {};

      for (let symbol of selectedSymbols) {
        try {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
          const data = await res.json();
          results[symbol] = {
            price: parseFloat(data.lastPrice),
            history: Array(20).fill(parseFloat(data.prevClosePrice)), // mock flat history
          };
          results[symbol].history[19] = results[symbol].price; // last point is the current price
        } catch (err) {
          console.error("Error fetching data for", symbol, err);
        }
      }

      setAssets(results);
      setLoading(false);
    };

    if (selectedSymbols.length > 0) {
      fetchData();
    } else {
      setAssets({});
    }
  }, [selectedSymbols]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Select Trading Pairs
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
            {allSymbols.map((symbol) => (
              <Form.Check
                key={symbol}
                type="checkbox"
                id={`checkbox-${symbol}`}
                label={symbol}
                checked={selectedSymbols.includes(symbol)}
                onChange={() => handleSymbolToggle(symbol)}
                className="mx-3 my-1"
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading data...</p>
        </div>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-3">
        {selectedSymbols.map((symbol) => (
          <AssetCard
            key={symbol}
            symbol={symbol}
            price={assets[symbol]?.price || 0}
            history={assets[symbol]?.history || []}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetGrid;
