import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Signin.module.scss";
import {useState} from "react";
import {useRouter} from "next/router";
import {authenticate} from "../lib/service";

// Fr6/ese342f
export default function SignIn() {
  const [message, setMessage] = useState();
  const router = useRouter();

  const submit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    const body = await authenticate(username, password);

    if (body.error) {
      setMessage(body.message);
      return;
    }
    setMessage(null);
    window.sessionStorage.setItem("token", body.token);
    await router.push("/home");
  };

  return (
    <div>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Link href="/">
          <a className={styles.backToHome}>
            <div>&lt;-- Go back</div>
          </a>
        </Link>
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
              <small>Welcome back</small>
              Sign in
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
            <div className={styles.action}>
              <button className={styles.actionButton}>Sign in</button>
            </div>
          </form>
        </div>
        <div>{message}</div>
      </main>
    </div>
  );
}
