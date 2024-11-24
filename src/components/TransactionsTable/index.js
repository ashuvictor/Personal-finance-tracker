import React, { useState } from "react";
import { Select, Table, Radio } from "antd";
import "./styles.css";
import searchImg from "../../assets/search.svg";
import { unparse,parse } from "papaparse";
import { toast } from "react-toastify";
const { Option } = Select;

function TransactionsTable({ transactions,addTransaction,fetchTransactions}) {
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

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
<>
  {/* First Line: Search by Name and Filter by Type */}
  <div className="filters-row">
    <div className="input-flex">
      <img src={searchImg} width="16" alt="Search" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Name"
        className="search-input"
      />
    </div>

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
  </div>

  {/* Second Line: Heading, Sort Buttons, Export/Import */}
  <div className="actions-row">
    <h2 className="transactions-heading">Transactions</h2>

    <div className="center-sort-buttons">
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

    <div className="export-import-buttons">
      <button className="btn" onClick={exportToCsv}>Export to CSV</button>
      <label htmlFor="file-csv" className="btn btn-blue">
        Import from CSV
      </label>
      <input
      onChange={importFromCsv}
        id="file-csv"
        type="file"
        accept=".csv"
        required
        style={{ display: "none" }}
      />
    </div>
  </div>

  {/* Transactions Table */}
  <div className="transactions-table">
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={{ pageSize: 6 }}
    />
  </div>
</>

  );
}

export default TransactionsTable;
