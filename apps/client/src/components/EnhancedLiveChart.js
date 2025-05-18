import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import IndicatorsAll from "highcharts/indicators/indicators-all";



const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

const EnhancedLiveChart = ({ symbol = "btcusdt" }) => {
  const [interval, setInterval] = useState("1m");
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);
  const wsRef = useRef(null);
  const candleSeriesRef = useRef([]);

  const fetchInitialCandles = async () => {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
    );
    const raw = await response.json();

    const formatted = raw.map((item) => [
      item[0],
      parseFloat(item[1]),
      parseFloat(item[2]),
      parseFloat(item[3]),
      parseFloat(item[4]),
    ]);

    candleSeriesRef.current = formatted;

    setOptions({
      rangeSelector: { selected: 1 },
      title: { text: `${symbol.toUpperCase()} Live Chart (${interval})` },
      yAxis: [
        {
          height: "60%",
          resize: { enabled: true },
        },
        {
          top: "65%",
          height: "35%",
          offset: 0,
        },
      ],
      tooltip: { split: true },
      series: [
        {
          type: "candlestick",
          name: symbol.toUpperCase(),
          data: formatted,
          id: "base-candle",
          tooltip: { valueDecimals: 2 },
        },
        {
          type: "sma",
          linkedTo: "base-candle",
          params: { period: 14 },
          marker: { enabled: false },
          tooltip: { valueDecimals: 2 },
        },
        {
          type: "macd",
          linkedTo: "base-candle",
          yAxis: 1,
          params: {
            shortPeriod: 12,
            longPeriod: 26,
            signalPeriod: 9,
          },
          tooltip: { valueDecimals: 2 },
        },
      ],
    });
  };

  const initWebSocket = () => {
    const endpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    wsRef.current = new WebSocket(endpoint);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const k = data.k;

      const newCandle = [
        k.t,
        parseFloat(k.o),
        parseFloat(k.h),
        parseFloat(k.l),
        parseFloat(k.c),
      ];

      const last = candleSeriesRef.current[candleSeriesRef.current.length - 1];
      if (last && last[0] === newCandle[0]) {
        candleSeriesRef.current[candleSeriesRef.current.length - 1] = newCandle;
      } else {
        candleSeriesRef.current.push(newCandle);
      }

      if (candleSeriesRef.current.length > 100) {
        candleSeriesRef.current.shift();
      }

      const chart = chartRef.current?.chart;
      if (chart) {
        const series = chart.get("base-candle");
        if (series) {
          series.setData([...candleSeriesRef.current], true, false, false);
        }
      }
    };
  };

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

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
      <h2>{symbol.toUpperCase()} Chart</h2>
      <select
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        {intervals.map((intvl) => (
          <option key={intvl} value={intvl}>
            {intvl}
          </option>
        ))}
      </select>

      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

export default EnhancedLiveChart;
