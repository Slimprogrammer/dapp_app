import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const AssetCard = ({ symbol, price, history }) => {
  const first = history[0] || price;
  const change = ((price - first) / first) * 100;
  const changeColor = change > 0 ? "green" : change < 0 ? "red" : "black";

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <strong>{symbol}</strong>
        <span>${parseFloat(price).toFixed(2)}</span>
      </div>
      <Sparklines data={history} height={40}>
        <SparklinesLine color={changeColor} />
      </Sparklines>
      <div style={{ color: changeColor }}>{change.toFixed(2)}%</div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    width: "150px",
    margin: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
};

export default AssetCard;
