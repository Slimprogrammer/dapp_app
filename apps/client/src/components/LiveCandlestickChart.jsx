// components/LiveCandlestickChart.jsx

import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const LiveCandlestickChart = ({ symbol = "btcusdt", interval = "1m" }) => {
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);
  const wsRef = useRef(null);
  const candleSeriesRef = useRef([]);

  


  // Fetch initial historical data
  const fetchInitialCandles = async () => {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
    );
    const raw = await response.json();

    const formatted = raw.map((item) => [
      item[0], // open time
      parseFloat(item[1]), // open
      parseFloat(item[2]), // high
      parseFloat(item[3]), // low
      parseFloat(item[4]), // close
    ]);

    candleSeriesRef.current = formatted;

    setOptions({
      rangeSelector: { selected: 1 },
      title: { text: `${symbol.toUpperCase()} Live Candlestick` },
      series: [
        {
          type: "candlestick",
          name: symbol.toUpperCase(),
          data: formatted,
          id: "candlestick-data",
          tooltip: {
            valueDecimals: 2,
          },
        },
      ],
    });
  };

  // Open WebSocket and listen for updates
  const initWebSocket = () => {
    const endpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    wsRef.current = new WebSocket(endpoint);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const k = data.k;

      const newCandle = [
        k.t, // open time
        parseFloat(k.o),
        parseFloat(k.h),
        parseFloat(k.l),
        parseFloat(k.c),
      ];

      const last = candleSeriesRef.current[candleSeriesRef.current.length - 1];

      if (last && last[0] === newCandle[0]) {
        // Update last candle
        candleSeriesRef.current[candleSeriesRef.current.length - 1] = newCandle;
      } else {
        // Add new candle
        candleSeriesRef.current.push(newCandle);
      }

      // Limit to last 100 candles
      if (candleSeriesRef.current.length > 100) {
        candleSeriesRef.current.shift();
      }

      const chart = chartRef.current?.chart;
      if (chart) {
        const series = chart.get("candlestick-data");
        if (series) {
          series.setData([...candleSeriesRef.current], true, false, false);
        }
      }
    };
  };

    useEffect(() => {
      fetchInitialCandles();
      initWebSocket();

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
  }, [symbol, interval]);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default LiveCandlestickChart;
