import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bank</title>
        <meta
          name="description"
          content="Bank application, created with Next.js, with the support of a LAMP rest server"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.title}>Welcome to Bank</div>
        <div className={styles.description}>The application</div>
      </main>
    </>
  );
}
