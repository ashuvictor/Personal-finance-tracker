import React, { useState } from "react";
import { Select, Table, Radio } from "antd";
import "./styles.css";
import searchImg from "../../assets/search.svg"
const { Option } = Select;

function TransactionsTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <span style={{ color: text === "income" ? "green" : "red" }}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `₹${text}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
  ];

  // Filter transactions based on search input
  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter ? item.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  // Provide the data source for the table
  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const dataSource = sortedTransactions.map((transaction, index) => ({
    key: index,
    ...transaction,
  }));

  return (
    <>
     <div className="filters-container">
  {/* Search Input */}
  <div className="input-flex">
    <img src={searchImg} width="16" alt="Search" />
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by Name"
      className="search-input"
    />
  </div>

  {/* Dropdown Filter */}
  <Select
    className="select-input"
    placeholder="Filter by Type"
    allowClear
    value={typeFilter}
    onChange={(value) => {
      setTypeFilter(value);
    }}
  >
    <Option value="">All</Option>
    <Option value="income">Income</Option>
    <Option value="expense">Expense</Option>
  </Select>

  {/* Sorting Options */}
  <Radio.Group
    className="radio-group"
    value={sortKey}
    onChange={(e) => {
      setSortKey(e.target.value);
    }}
  >
    <Radio.Button value="">No Sort</Radio.Button>
    <Radio.Button value="date">Sort By Date</Radio.Button>
    <Radio.Button value="amount">Sort By Amount</Radio.Button>
  </Radio.Group>
</div>

<div className="transactions-table">
  <Table
    columns={columns}
    dataSource={dataSource}
    bordered
    title={() => <h2>Transactions</h2>}
    pagination={{ pageSize: 6 }} // Show 6 transactions per page
  />
</div>

    </>
  );
}

export default TransactionsTable;
