import React from "react";
import { Line } from "@ant-design/plots"; // Import Ant Design Line Chart

function ChartComponent({ sortedTransactions = [] }) {
  // Map sortedTransactions safely
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
    type: item.type,
  }));

  // Line chart configuration
  const config = {
    data,
    xField: "date", // Use date for the x-axis
    yField: "amount", // Use amount for the y-axis
    seriesField: "type", // Separate lines for income and expenses
    color: ["#4caf50", "#f44336"], // Green for Income, Red for Expense
    smooth: true, // Makes the line smooth
    tooltip: {
      showMarkers: true, // Show markers on hover
      shared: true, // Display values of all series in a tooltip
    },
    xAxis: {
      title: {
        text: "Date",
        style: { fontSize: 14, fontWeight: 600 },
      },
    },
    yAxis: {
      title: {
        text: "Amount (₹)",
        style: { fontSize: 14, fontWeight: 600 },
      },
    },
    legend: {
      position: "top",
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h3 style={{ textAlign: "center" }}>Income vs. Expenses Over Time</h3>
      <Line {...config} />
    </div>
  );
}

export default ChartComponent;
