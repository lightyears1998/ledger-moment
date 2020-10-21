import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'

export default function Home() {
  const [title, setTitle] = useState('')

  return (
    <div className={styles.container}>
      <Head>
        <title>Ledger Moment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
