import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "./layout";
import Link from "next/link";

export default function WelcomeHome() {
  return (
    <Layout>
      <Head>
        <title>Welcome Home!</title>
      </Head>
      <main className={styles.main}>
        <Link href="/" passHref>
          <a>
            <div>&#8962;</div>
          </a>
        </Link>
      </main>
    </Layout>
  );
}
