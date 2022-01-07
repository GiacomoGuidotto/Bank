import styles from "../styles/Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { closeSession } from "../lib/service";

export default function Header({ MZ }) {
  const router = useRouter();

  async function onClick() {
    await signOut(router);
  }

  return (
    <header className={styles.header}>
      <Link href={MZ ? "/home" : "/"}>
        <a>
          <div className={styles.home}>Bank</div>
        </a>
      </Link>
      <div className={styles.nav}>
        {MZ ? (
          <a onClick={onClick}>
            <div className={styles.signUp}>Sign out</div>
          </a>
        ) : (
          <>
            <Link href="/signin">
              <a>
                <div className={styles.signIn}>Sign in</div>
              </a>
            </Link>
            <Link href="/signup">
              <a>
                <div className={styles.signUp}>Sign up</div>
              </a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

async function signOut(router) {
  const token = window.sessionStorage.getItem("token");

  const body = await closeSession(token);

  if (body) {
    // unknown token but equal result
    await router.push("/");
  } else {
    await router.push("/");
  }
}
