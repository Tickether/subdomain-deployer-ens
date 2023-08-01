import styles from '@/styles/Name.module.css'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import {formatEther, namehash} from 'viem'
import axios from 'axios'
import { SearchResult } from '@/components/searches/search'
import SubEnsFee from '@/components/name/subensfee'


export default function EnsName() {

  const {address, isConnected} = useAccount()

  const [ENS, setENS] = useState<string>('')
  const [owner, setOwner] = useState<string>('0x0000000000000000000000000000000000000000')
  const [nodeData, setNodeData] = useState<any>([])
  const [subsEns, setSubsEns] = useState([])
  //ParentNodeBalance
  //const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
  //const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
  //const [fuseBurned, setFuseBurned] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  //const [approved, setApproved] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)


  console.log(ENS)
  console.log(nodeData)
  //console.log(activeParentNode)

  useEffect(() => {
    if (isConnected && typeof isConnected === 'boolean') {
        setConnected((true))
    } if (!isConnected && typeof isConnected === 'boolean') {
        setConnected((false))
    }
  },[isConnected])

  useEffect(() => {
    if (address && typeof address === 'string') {
        setOwner((address))
    } 
  },[address])
    
    
  useEffect(()=>{
    setENS(window.location.pathname.split('/')[1])
  },[])

  console.log(ENS)

  
  //node owner
  const contractReadNodeData = useContractRead({
    address: "0x114D4603199df73e7D157787f8778E21fCd13066",
    abi: [
        {
            name: 'getData',
            inputs: [{ internalType: "uint256", name: "node", type: "uint256" }],
            outputs: [{ internalType: "address", name: "", type: "address" }, { internalType: "uint32", name: "", type: "uint32" }, { internalType: "uint64", name: "", type: "uint64" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'getData',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadNodeData?.data! /*&& typeof contractReadNodeExpired.data === 'Array<string' */) {
      setNodeData(contractReadNodeData?.data!)
    }
  },[contractReadNodeData?.data!])
  console.log((contractReadNodeData?.data!))


  


  useEffect(()=>{
    const handleShowSubEns = async () => {
      if (ENS.length >= 1) {
        try {
          const query = `query {domains(where:{parent: "${namehash(ENS)}"}) { name wrappedOwner{id} }}`
          const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
            query
          })
          console.log(response.data);
          setSubsEns(response.data.data.domains)
        } catch (error) {
          console.log(error);
        }
      }
    }
    handleShowSubEns()
  },[ENS])
  console.log(subsEns)

  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.name}> 
            {
              owner! === nodeData[0]
              ? (
                <div className={styles.nameOwner}>
                  <div className={styles.nameOwnerActiveParentNode}>
                              {/** some stuff subs & n general info */}
                              {/**will propably modal // moved to modal*/}
                              {openModal && <SubEnsFee setOpen ={setOpenModal} ENS ={ENS} />}
                              
                              <div>
                                {/** show list subnames */}
                                {
                                  subsEns.length < 1
                                  ? (
                                    <div>
                                      <p>No Subdmains for this ENS yet...</p>
                                    </div>
                                  )
                                  : (
                                    <div>
                                      <p>ENS Subdomains</p>
                                      {
                                        subsEns.map((subEns : SearchResult)=> (
                                          <div>
                                            
                                            <p>{subEns.name}</p>
                                            <p>{subEns.wrappedOwner.id}</p>

                                          </div>
                                        ))
                                      }
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                </div>
              )
              : (
                <div className={styles.nameBuyer}>
                  {/**plan what to show if buyer most like a sub search and register flow */}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
