import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import moment from "moment";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = async (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    await addTransaction(newTransaction);
  };

  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      toast.success("Transaction added successfully!");
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        { id: docRef.id, ...transaction },
      ]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction. Please try again.");
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${user.uid}/transactions`)
      );
      const transactionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions.");
    }
  };

  // Recalculate totals when transactions change
  useEffect(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setCurrentBalance(income - expenses);
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const resetTransactions = () => {
    setTransactions([]);
    setTotalIncome(0);
    setTotalExpenses(0);
    setCurrentBalance(0);
    toast.info("Transactions reset locally.");
  };

  return (
    <div>
      <ToastContainer />
      <Header />
      <Cards
        currentBalance={currentBalance}
        income={totalIncome}
        expenses={totalExpenses}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        reset={resetTransactions}
      />
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={(values) => onFinish(values, "expense")}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={(values) => onFinish(values, "income")}
      />
    </div>
  );
}

export default Dashboard;
