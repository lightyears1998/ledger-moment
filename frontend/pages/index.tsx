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

      <div>
        <h2>自定义服务器</h2>
        <button>转到“设置”</button>
      </div>

      <div>
        <h2>账本管理</h2>
        <button>新建账本</button>
        <button>切换账本</button>
        <button>移除账本</button>
      </div>
    </div>
  );
}
