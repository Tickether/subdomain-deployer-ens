import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { namehash, formatGwei } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { NumericFormat } from 'react-number-format'
import Ether from './ether'
import EtherWL from './etherWL'
import Erc20WL from './erc20WL'
import Erc20 from './erc20'

export default function SubEnsFee({setOpen, ENS} : any) {


    
    return (
        <>

            <div className={styles.container}>
                <div className={styles.wrapper}>
                  <div>
                    <Ether ENS ={ENS} />
                    <Erc20 ENS ={ENS} />
                    <EtherWL ENS ={ENS} />
                    <Erc20WL ENS ={ENS} />
                    <button onClick={() => setOpen(false)}>cancel</button>
                  </div>
                </div>
            </div>

        </>
    )
}
