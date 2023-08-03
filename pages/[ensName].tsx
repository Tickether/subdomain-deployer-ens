import styles from '@/styles/Name.module.css'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import {formatEther, namehash} from 'viem'
import axios from 'axios'
import { SearchResult } from '@/components/searches/search'
import SubEnsFee from '@/components/name/subensfee'
import Profile from '@/components/name/profile'
import Subnames from '@/components/name/subnames'


export default function EnsName() {

  const {isConnected} = useAccount()

  const [ENS, setENS] = useState<string>('')
  const [option, setOption] = useState<string>('profile')

  //ParentNodeBalance
  //const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
  //const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
  //const [fuseBurned, setFuseBurned] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  //const [approved, setApproved] = useState<boolean>(false)
  //const [openModal, setOpenModal] = useState<boolean>(false)


  console.log(ENS)
  //console.log(nodeData)
  //console.log(activeParentNode)

  useEffect(() => {
    if (isConnected && typeof isConnected === 'boolean') {
        setConnected((true))
    } if (!isConnected && typeof isConnected === 'boolean') {
        setConnected((false))
    }
  },[isConnected])

  
    
  useEffect(()=>{
    setENS(window.location.pathname.split('/')[1])
  },[])

  console.log(ENS)

  
 
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.name}> 
            <div className={styles.nameTop}>
                <p>{ENS}</p>
            </div>
            <div className={styles.nameDown}>
              <div className={styles.nameTabs}>
                <span onClick={()=> setOption('profile')}>Profile</span>
                <span onClick={()=> setOption('subnames')}>Subnames</span>
              </div>
              <div className={styles.nameTabOption}>
                {
                  /**page options based on upper div */
                  option === 'profile' && (
                    <Profile ENS = {ENS}/>
                  )
                }
                {
                  /**page options based on upper div */
                  option === 'subnames' && (
                    <Subnames ENS = {ENS}/>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
