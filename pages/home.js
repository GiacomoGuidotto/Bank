import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/header";
import Link from "next/link";
import styles from "../styles/UserHome.module.scss";
import { createDeposits, getDeposits, getUser } from "../lib/service";

export default function User() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (!token) router.push("/");

    async function fetchData(token) {
      const userBody = await getUser(token);

      if (userBody.error) {
        await router.push("/signin");
      } else {
        setUser(userBody);
      }

      const depositsBody = await getDeposits(token);

      if (depositsBody.error) {
        console.error(depositsBody);
      } else {
        setDeposits(depositsBody);
      }
    }

    fetchData(token);
  }, [router]);

  const [newDeposit, setNewDeposit] = useState(false);
  const [newDepositMessage, setNewDepositMessage] = useState(null);

  const submit = async (event) => {
    event.preventDefault();

    const token = window.sessionStorage.getItem("token");
    const name = event.target.name.value;
    const type = event.target.type.value;

    const body = await createDeposits(token, name, type);

    if (body.error) {
      setNewDepositMessage(body.message);
      return;
    }

    const depositsBody = await getDeposits(token);

    if (depositsBody.error) {
      console.error(depositsBody);
      return;
    }

    setDeposits(depositsBody);
    setNewDeposit(false);
  };
  return (
    <>
      <Head>
        <title>Bank</title>
      </Head>

      <Header MZ />

      <main className={styles.main}>
        <div className={styles.banner}>
          <div className={styles.title}>
            Hi {user.name} {user.surname}
          </div>
          <div className={styles.IBAN}>Your IBAN: {user.IBAN}</div>
        </div>
        <div className={styles.deposits}>
          <div className={styles.depositsHeader}>
            <div>Your deposits:</div>
            <button
              onClick={() => setNewDeposit(!newDeposit)}
              className={styles.addDeposit}
            >
              New
            </button>
          </div>
          {newDeposit ? (
            <>
              <form className={styles.newDeposit} onSubmit={submit}>
                <div className={styles.inputField}>
                  <input
                    id="name"
                    type="text"
                    className={styles.input}
                    required
                  />
                  <label className={styles.inputLabel}>Name</label>
                </div>
                <div className={styles.selectField}>
                  <label className={styles.selectLabel}>Type</label>
                  <select id="type" className={styles.select}>
                    <option value="standard">standard</option>
                  </select>
                </div>
                <div className={styles.action}>
                  <button>Create</button>
                </div>
              </form>
              {newDepositMessage ? (
                <button
                  onClick={() => setNewDepositMessage(null)}
                  className={styles.error}
                >
                  {newDepositMessage}
                </button>
              ) : null}
            </>
          ) : null}
          {deposits.map((deposit) => {
            return (
              <div key={deposit.name} className={styles.deposit}>
                <div className={styles.details}>
                  <p>{deposit.name}</p>
                  <p className={styles.type}>{deposit.type}</p>
                </div>
                <div className={styles.amount}>
                  <p>Amount</p>
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
                <Link href={`/deposit/${deposit.name}`} passHref>
                  <div className={styles.viewDeposit}>
                    <a>Details</a>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
