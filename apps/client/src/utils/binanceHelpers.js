// utils/binanceHelpers.js
import axios from "axios";

// Helper to calculate Simple Moving Average
const calculateSMA = (data, period) => {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, val) => acc + val, 0);
    sma.push(sum / period);
  }
  return sma;
};

// Helper to calculate RSI
const calculateRSI = (closes, period = 14) => {
  const rsi = [];
  for (let i = period; i < closes.length; i++) {
    let gains = 0;
    let losses = 0;

    for (let j = i - period + 1; j <= i; j++) {
      const diff = closes[j] - closes[j - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    const rs = gains / (losses || 1); // prevent divide by 0
    rsi.push(100 - 100 / (1 + rs));
  }

  // pad with nulls for alignment
  return Array(period).fill(null).concat(rsi);
};

export const getBinanceAssetData = async (symbol) => {
  try {
    if (!symbol) {
      console.error("Symbol is required");
      return null;
    }
    if (symbol === "USDT") {
      return;
    }
    symbol = symbol.toUpperCase() + "USDT"; // Ensure symbol is in the correct format

    const baseURL = "https://api.binance.com/api/v3";

    const [statsRes, priceRes, depthRes, klineRes] = await Promise.all([
      axios.get(`${baseURL}/ticker/24hr?symbol=${symbol}`),
      axios.get(`${baseURL}/ticker/price?symbol=${symbol}`),
      axios.get(`${baseURL}/depth?symbol=${symbol}&limit=5`),
      axios.get(`${baseURL}/klines?symbol=${symbol}&interval=1h&limit=100`), // Last 100 hourly candles
    ]);

    const klineData = klineRes.data.map((k) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    const closePrices = klineData.map((k) => k.close);
    const sma20 = calculateSMA(closePrices, 20);
    const rsi14 = calculateRSI(closePrices, 14);

    return {
      symbol,
      price: priceRes.data.price,
      stats: statsRes.data,
      orderBook: depthRes.data,
      klines: klineData,
      indicators: {
        sma20,
        rsi14,
      },
    };
  } catch (error) {
    console.error("Error fetching asset data:", error);
    return null;
  }
};


export const getAssetData = async (symbol) => {
  try {
    if (!symbol) {
      console.error("Symbol is required");
      return null;
    }
    if (symbol === "USDT") {
      return;
    }
    symbol = symbol.toUpperCase() + "USDT"; // Ensure symbol is in the correct format

    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`
    );

    if (!response.ok) {
          console.log("Error fetching asset data:", response.statusText);

      throw new Error("Failed to fetch data from Binance API");
    }

    const data = await response.json();

    return {
      symbol: data.symbol,
      price: data.lastPrice,
      openPrice: data.openPrice,
      priceChange: data.priceChange,
      priceChangePercent: data.priceChangePercent,
      highPrice: data.highPrice,
      lowPrice: data.lowPrice,
      volume: data.volume,
      quoteVolume: data.quoteVolume,
      openTime: new Date(data.openTime),
      closeTime: new Date(data.closeTime),
    };
  } catch (error) {
    console.error("Error fetching asset data:", error);
    return null;
  }
};