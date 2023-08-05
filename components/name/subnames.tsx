import styles from '@/styles/Subnames.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { namehash } from 'viem'
import { useAccount, useContractRead } from 'wagmi'
import SubEnsFee from './subensfee'
import { SearchResult } from '../searches/search'



export default function Subnames({ENS} : any) {
    const {address, isConnected} = useAccount()

    const [owner, setOwner] = useState<string>('0x0000000000000000000000000000000000000000')
    const [nodeData, setNodeData] = useState<any>([])
    const [subsEns, setSubsEns] = useState([])
    const [openModal, setOpenModal] = useState<boolean>(false)


    useEffect(() => {
        if (address && typeof address === 'string') {
            setOwner((address))
        } 
      },[address])

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
          <div className={styles.subnames}>
            <div className={styles.subnamesChild}>
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
      </div>

    </>
  )
}
