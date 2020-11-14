import Head from "next/head";

import styles from "./index.module.scss";

export default function HomePage(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ledger Moment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>刻刻账本</h1>
    </div>
  );
}
