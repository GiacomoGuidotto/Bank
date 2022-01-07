import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Signin.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import { authenticate, createUser } from "../lib/service";

export default function SignIn() {
  const [message, setMessage] = useState();
  const router = useRouter();

  const submit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    const name = event.target.name.value;
    const surname = event.target.surname.value;

    const signUpBody = await createUser(username, password, name, surname);

    if (signUpBody.error) {
      setMessage(signUpBody.message);
      return;
    }

    setMessage(null);

    const signInBody = await authenticate(username, password);

    if (signInBody.error) {
      setMessage(signInBody.message);
      return;
    }
    setMessage(null);
    window.sessionStorage.setItem("token", signInBody.token);
    await router.push("/home");
  };

  return (
    <div>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardImage}>
            <Image
              src="/bank.jpg"
              className={styles.image}
              width={800}
              height={500}
              alt={"bank"}
            />
            <h2 className={styles.cardHeading}>
              <small>Let{"'"}s create an account</small>
              Welcome
            </h2>
          </div>
          <form className={styles.cardForm} onSubmit={submit}>
            <div className={styles.input}>
              <input
                id="username"
                type="text"
                className={styles.inputField}
                required
              />
              <label className={styles.inputLabel}>Username</label>
            </div>
            <div className={styles.input}>
              <input
                id="password"
                type="password"
                className={styles.inputField}
                required
              />
              <label className={styles.inputLabel}>Password</label>
            </div>
            <div className={styles.input}>
              <input
                id="name"
                type="text"
                className={styles.inputField}
                required
              />
              <label className={styles.inputLabel}>Name</label>
            </div>
            <div className={styles.input}>
              <input
                id="surname"
                type="text"
                className={styles.inputField}
                required
              />
              <label className={styles.inputLabel}>Surname</label>
            </div>
            <div className={styles.action}>
              <button className={styles.actionButton}>Create an account</button>
            </div>
          </form>
        </div>
        <div>{message}</div>
      </main>
    </div>
  );
}
