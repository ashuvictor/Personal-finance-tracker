import React from "react";
import { Card, Row } from "antd";
import "./styles.css";
import Button from "../Button";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  reset,
}) {
  return (
    <Row className="my-row">
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>₹{currentBalance}</p>
        <Button blue text="Reset" onClick={reset} />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <Button blue text="Add Income" onClick={showIncomeModal} />
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>₹{expenses}</p>
        <Button blue text="Add Expense" onClick={showExpenseModal} />
      </Card>
    </Row>
  );
}

export default Cards;
