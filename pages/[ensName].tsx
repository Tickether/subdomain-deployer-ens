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
  const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
  const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
  const [fuseBurned, setFuseBurned] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [approved, setApproved] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)


  console.log(ENS)
  console.log(nodeData)
  console.log(activeParentNode)

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

  const contractReadApproved = useContractRead({
    address: "0x114D4603199df73e7D157787f8778E21fCd13066",
    abi: [
        {
            name: 'isApprovedForAll',
            inputs: [{ internalType: "address", name: "account", type: "address" }, { internalType: "address", name: "operator", type: "address" }],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },
    ],
    functionName: 'isApprovedForAll',
    args: [(address!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
    watch: true,
    chainId: 5,
  })  
  console.log(contractReadApproved.data)
    
  useEffect(() => {
      if (contractReadApproved?.data! && typeof contractReadApproved.data === 'boolean') {
          setApproved((contractReadApproved?.data!))
      }
  },[contractReadApproved?.data!])

  const prepareContractWriteApproval = usePrepareContractWrite({
      address: '0x114D4603199df73e7D157787f8778E21fCd13066',
      abi: [
          {
            name: 'setApprovalForAll',
            inputs: [ {internalType: "address", name: "operator", type: "address"}, { internalType: "bool", name: "approved", type: "bool" } ],
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
      functionName: 'setApprovalForAll',
      args: [ ('0x229C0715e70741F854C299913C2446eb4400e76C'), (true) ],
      chainId: 5,
      value: BigInt(0),
  })




  const  contractWriteApproval = useContractWrite(prepareContractWriteApproval.config)

  const waitForApproval = useWaitForTransaction({
      hash: contractWriteApproval.data?.hash,
      confirmations: 1,
      onSuccess() {
      },
  })

  const handleApproval = async () => {
      try {
          await contractWriteApproval.writeAsync?.()
      } catch (err) {
          console.log(err)
      }    
  }

  const contractReadActiveParentNode = useContractRead({
    address: "0x229C0715e70741F854C299913C2446eb4400e76C",
    abi: [
      {
          name: 'parentNodeActive',
          inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: 'view',
          type: 'function',
      },    
    ],
    functionName: 'parentNodeActive',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadActiveParentNode?.data! && typeof contractReadActiveParentNode.data === 'boolean' ) {
        setActiveParentNode((contractReadActiveParentNode?.data!))
    }
  },[contractReadActiveParentNode?.data!])

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


  //check if cannot unwrap is burnt need to allow subdomains esp for 2LD .eth domains
  const contractReadFuseBurned = useContractRead({
    address: "0x114D4603199df73e7D157787f8778E21fCd13066",
    abi: [
        {
            name: 'allFusesBurned',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "uint32", name: "fuseMask", type: "uint32" }],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'allFusesBurned',
    args: [(namehash(ENS)), (1)],
    chainId: 5,
    watch: true,
  })
  
  useEffect(() => {
    if (contractReadFuseBurned?.data! && typeof contractReadFuseBurned.data === 'boolean' ) {
      setFuseBurned(contractReadFuseBurned?.data!)
    }
  },[contractReadFuseBurned?.data!])
  console.log((contractReadFuseBurned?.data!))

  

  const prepareContractWriteParentNode = usePrepareContractWrite({
    address: '0x229C0715e70741F854C299913C2446eb4400e76C',
    abi: [
      {
        name: 'setBaseEns',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"} ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'setBaseEns',
    args: [ (namehash(ENS)) ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteParentNode = useContractWrite(prepareContractWriteParentNode.config)

  const waitForSetParentNode = useWaitForTransaction({
    hash: contractWriteParentNode.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
})

  const handleSetParentNode = async () => {
    try {
        await contractWriteParentNode.writeAsync?.()
    } catch (err) {
        console.log(err)
    }
  }

//read balance and withdraw
  const contractReadParentNodeBalance = useContractRead({
    address: "0x229C0715e70741F854C299913C2446eb4400e76C",
    abi: [
        {
            name: 'parentNodeBalance',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeBalance',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    
    if (contractReadParentNodeBalance?.data! && typeof contractReadParentNodeBalance.data === 'bigint' ) {
      setParentNodeBalance(contractReadParentNodeBalance?.data!)
    }

  },[ contractReadParentNodeBalance?.data!])
  

//read balance and withdraw
  const prepareContractWriteWithdraw = usePrepareContractWrite({
    address: '0x229C0715e70741F854C299913C2446eb4400e76C',
    abi: [
        {
          name: 'withdrawNodeBalance',
          inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"} ],
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    functionName: 'withdrawNodeBalance',
    args: [ (namehash(ENS)) ],
    chainId: 5,
    value: BigInt(0),
  })




  const  contractWriteWithdraw = useContractWrite(prepareContractWriteWithdraw.config)

  const waitForWithdraw = useWaitForTransaction({
    hash: contractWriteWithdraw.data?.hash,
    confirmations: 1,
    onSuccess() {
    },
  })

  const handleWithdraw = async () => {
    try {
        await contractWriteWithdraw.writeAsync?.()
    } catch (err) {
        console.log(err)
    }    
  }


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
                  {
                    approved 
                    ? (
                      <div>
                        {
                          activeParentNode
                          ? (
                            <div className={styles.nameOwnerActiveParentNode}>
                              <div>
                                <span>baolance{formatEther(parentNodeBalance)}</span>
                                <button onClick={() => setOpenModal(true)}>set Prices</button>
                                <button onClick={handleWithdraw}>withdraw</button>
                              </div> 
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
                          )
                          : (
                            <div className={styles.nameOwnerNoParentNode}>
               
                                <span>Parent Node is not set! Dont worry click below to init</span>
                                <button onClick={handleSetParentNode}>Set Parent Node</button>
                
                            </div>
                          )
                        }
                      </div>
                    )
                    : (
                      <div className={styles.nameOwnerNotApproved}>
                        
                          <span>Please approve to enable domain mangement dashboard</span>
                          <button onClick={handleApproval}>approve</button>
                
                      </div>
                    )
                  }
                </div>
              )
              : (
                <div className={styles.nameBuyer}>
                  {
                    approved
                    ? (
                      <div className={styles.nameBuyerApproved}>
                        {
                          activeParentNode
                          ? (
                            <div className={styles.nameBuyerActiveParentNode}>
                              <div>
                                {/**route to register page */}
                              </div>
                            </div>
                          )
                          : (
                            <div className={styles.nameBuyerNoParentNode}>
                    
                                <span>domain not active yet, owner must add parent</span>
                 
                            </div>
                          )
                        }
                      </div>
                    )
                    : (
                      <div className={styles.nameBuyerNotApproved}>
     
                          <span>domain not active yet</span>
             
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
