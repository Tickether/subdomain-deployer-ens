import styles from '@/styles/Name.module.css'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import {formatEther, namehash} from 'viem'
import axios from 'axios'
import { SearchResult } from '@/components/searches/search'
import Profile from '@/components/name/profile/profile'
import Subnames from '@/components/name/subnames/subnames'
import History from '@/components/name/history'
import ensSVG from '@/public/assets/icons/ens.svg'
import Image from 'next/image'

export interface ENS{
  name : string,
  owner : string,
  expiry : number
}

export default function EnsName() {

  const {isConnected} = useAccount()

  const ensDefault = {
    name: '',
    owner: '',
    expiry: 0,
  };
  const [ENS, setENS] = useState<ENS>(ensDefault)
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

  
    
     const getENS = async () => {
      //get owner info
      const query = `query { domain(id: "${namehash(window.location.pathname.split('/')[1])}") {expiryDate wrappedOwner {id} owner{id}}}`
      const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
        query
      })
      const owner = response.data.data.domain.owner.id
      const expiry = response.data.data.domain.expiryDate
      const nameWrapper = '0x114D4603199df73e7D157787f8778E21fCd13066'
      if (owner === nameWrapper.toLowerCase()){
        const wrappedOwner = response.data.data.domain.wrappedOwner.id
        const ensData = {
          name: window.location.pathname.split('/')[1],
          owner: wrappedOwner,
          expiry: expiry,
        };
        setENS(ensData)

      } else {
        const ensData = {
          name: window.location.pathname.split('/')[1],
          owner: owner,
          expiry: expiry,
        };
        setENS(ensData)
      }
    }
    getENS()
    
  },[])

  

  console.log(ENS)

  
 
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.name}> 
            <div className={styles.nameTop}>
                <div className={styles.nameTopChild}>
                  <p>{ENS.name}</p>
                  <Image src={ensSVG} alt='' />
                </div>
            </div>
            <div className={styles.nameDown}>
              <div className={styles.nameTabs}>
                <div className={styles.nameTabsChild}>
                  <span 
                    className={option === 'profile' ? styles.nameTabActive : styles.nameTab}
                    onClick={()=> setOption('profile')}
                  >
                    Profile
                  </span>
                  <span 
                    onClick={()=> setOption('subnames')}
                    className={option === 'subnames' ? styles.nameTabActive : styles.nameTab}
                  >
                    Subnames
                  </span>
                  <span 
                    onClick={()=> setOption('history')}
                    className={option === 'history' ? styles.nameTabActive : styles.nameTab}
                  >
                    History
                  </span>
                </div>
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
                {
                  /**page options based on upper div */
                  option === 'history' && (
                    <History ENS = {ENS}/>
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
