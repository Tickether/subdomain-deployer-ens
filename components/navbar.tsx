import styles from '@/styles/Navbar.module.css'
import Image from 'next/image'
//import logo from '@/public/SmokleyS.svg';
import Link from 'next/link';
import { Web3Button } from '@web3modal/react';

import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';

export default function Navbar() {


  

  const { isConnected, address } = useAccount()
  const [connected, setConnected] = useState<boolean>(false)

  
  useEffect(() => {
    
    if (isConnected && typeof isConnected === 'boolean') {
  
      setConnected((true))
    } 
    
    if (!isConnected && typeof isConnected === 'boolean') {
        setConnected((false))
        
    }
},[isConnected])


/*
const contractReadUser = useContractRead({
  address: "0xe0EA5e8Bf175E517A6079716864524BE4a11CaBF",
  abi: [
      {
          name: 'userOf',
          inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: 'view',
          type: 'function',
      },    
  ],
  functionName: 'userOf',
  args: [BigInt(memberToken)],
  chainId: 11155111,
  watch: true,
})
useEffect(() => {
  if (contractReadUser?.data! && typeof contractReadUser.data === 'string' ) {
      setUserOf((contractReadUser?.data!))
  }
},[contractReadUser?.data!])
*/

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Link href='/'>
                <Image 
                  src='' 
                  alt="" 
                />
                <p>SubENS</p>
              </Link>
            </div>
          </div>
          
          <div className={styles.right}>
            <div className={styles.names}>
              <Link href='/names'>names</Link>
            </div>
            <div className={styles.connect}>
              <Web3Button icon="hide" label="Connect" balance="hide" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


