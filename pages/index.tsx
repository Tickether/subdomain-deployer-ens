import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { Web3Button } from '@web3modal/react';


export default function Home() {
  return (
    <>
      <Web3Button icon="hide" label="Connect" balance="hide" />
    </>
  )
}
