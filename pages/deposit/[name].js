import Head from "next/head";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createTransaction, getDeposit, getHistory } from "../../lib/service";
import styles from "../../styles/Deposit.module.scss";

export default function Deposit() {
  const router = useRouter();
  const [deposit, setDeposit] = useState({});
  const [transactions, setTransactions] = useState([]);

  async function fetchData(token, deposit) {
    const depositBody = await getDeposit(token, deposit);

    if (depositBody.error) {
      await router.push("/home");
    } else {
      setDeposit(depositBody);
    }

    const transactionsBody = await getHistory(token, deposit);

    if (transactionsBody.error) {
      console.error(depositBody);
    } else {
      setTransactions(transactionsBody);
    }
  }

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    const deposit = window.sessionStorage.getItem("deposit");
    if (!token || !deposit) router.push("/home");

    fetchData(token, deposit);

    return () => {
      // window.sessionStorage.setItem("deposit", null);
    };
  }, [router]);

  function formatDate(stringDate) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(stringDate);

    const [month, day, year] = [
      months[date.getMonth()],
      date.getDate(),
      date.getFullYear(),
    ];

    const [hour, minutes, seconds] = [
      date.getHours().toString().padStart(2, "0"),
      date.getMinutes().toString().padStart(2, "0"),
      date.getSeconds().toString().padStart(2, "0"),
    ];
    return `${month} ${day} ${year}, ${hour}:${minutes}.${seconds}`;
  }

  const [newTransaction, setNewTransaction] = useState(false);
  const [newTransactionMessage, setNewTransactionMessage] = useState(null);

  const submit = async (event) => {
    event.preventDefault();

    const token = window.sessionStorage.getItem("token");
    const deposit = window.sessionStorage.getItem("deposit");
    const action = event.target.action.value;
    const amount = event.target.amount.value;

    const body = await createTransaction(token, deposit, action, amount);

    if (body.error) {
      const transactionMessage =
        body.message.charAt(0).toUpperCase() + body.message.slice(1);
      setNewTransactionMessage(transactionMessage);
      return;
    }

    await fetchData(token, deposit);

    setNewTransaction(false);
  };

  return (
    <>
      <Head>
        <title>Deposit</title>
      </Head>

      <Header MZ />

      <main className={styles.main}>
        <div className={styles.banner}>
          <div className={styles.info}>
            <div className={styles.title}>{deposit.name}</div>
            <div className={styles.type}>{deposit.type} deposit</div>
          </div>
          <div className={styles.amountBox}>
            <div className={styles.amount}>
              Available amount:{" "}
              <p
                className={
                  deposit.amount > 0
                    ? styles.positiveAmount
                    : styles.negativeAmount
                }
              >
                {deposit.amount}
              </p>
            </div>
            <button
              onClick={() => setNewTransaction(!newTransaction)}
              className={styles.addTransaction}
            >
              New transaction
            </button>
          </div>
        </div>
        <div className={styles.transactionsBox}>
          {newTransaction ? (
            <div className={styles.newTransactionBox}>
              <button
                onClick={() => setNewTransaction(false)}
                className={styles.newTransactionBackground}
              />
              <form className={styles.newTransaction} onSubmit={submit}>
                <div className={styles.newTransactionTitle}>
                  Create a new transaction
                </div>
                <div className={styles.newTransactionFields}>
                  <div className={styles.selectField}>
                    <label className={styles.selectLabel}>Type</label>
                    <select id="action" className={styles.select}>
                      <option value="deposit">Deposit</option>
                      <option value="withdraw">Withdraw</option>
                    </select>
                  </div>
                  <div className={styles.inputField}>
                    <label className={styles.inputLabel}>Amount</label>
                    <input
                      id="amount"
                      type="number"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                <div className={styles.action}>
                  <button>Commit</button>
                </div>
              </form>
              {newTransactionMessage ? (
                <button
                  onClick={() => setNewTransactionMessage(null)}
                  className={styles.error}
                >
                  {newTransactionMessage}
                </button>
              ) : null}
            </div>
          ) : null}
          <div className={styles.transactionsHeader}>
            <div>Transactions:</div>
          </div>
          <div className={styles.transactions}>
            {transactions.map((transaction) => {
              const transactionType =
                transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1);

              return (
                <div key={transaction.date} className={styles.transaction}>
                  <div className={styles.date}>
                    {formatDate(transaction.date)}
                  </div>
                  <div className={styles.details}>
                    <p>{transactionType}</p>
                    <p className={styles.author}>{transaction.author}</p>
                  </div>
                  <div className={styles.transactionAmount}>
                    <p>Amount</p>
                    <p>{transaction.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
