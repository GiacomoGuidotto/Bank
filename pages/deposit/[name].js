import Head from "next/head";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDeposit, getHistory } from "../../lib/service";
import styles from "../../styles/Deposit.module.scss";

export default function Deposit() {
  const router = useRouter();
  const [deposit, setDeposit] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    const deposit = window.sessionStorage.getItem("deposit");
    if (!token || !deposit) router.push("/home");

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

    fetchData(token, deposit);

    return () => {
      // window.sessionStorage.setItem("deposit", null);
    };
  }, [router]);

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
              Amount stored:{" "}
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
            <div className={styles.addTransaction}>New transaction</div>
          </div>
        </div>
        <div className={styles.transactions}>
          <div className={styles.transactionsHeader}>
            <div>Transactions:</div>
          </div>
        </div>
        {transactions.map((transaction) => {
          const transactionType =
            transaction.type.charAt(0).toUpperCase() +
            transaction.type.slice(1);

          return (
            <div key={transaction.date} className={styles.transaction}>
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
      </main>
    </>
  );
}
