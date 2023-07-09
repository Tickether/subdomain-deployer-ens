import styles from '@/styles/Names.module.css'
import Navbar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import {namehash} from 'viem/ens'


export default function EnsName() {

  const {address, isConnected} = useAccount()

  const [ENS, setENS] = useState<string>('')
  const [nodeData, setNodeData] = useState<any>([])
  const [prices, setPrices] = useState<any>([[BigInt(0), BigInt(0), BigInt(0)]])
  const [newPrices, setNewPrices] = useState<string[]>(['0', '0', '0'])
  const [dollarPrices, setDollarPrices] = useState<string[]>(['0', '0', '0'])
  const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
  const [fuseBurned, setFuseBurned] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
    

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
    
    
  useEffect(()=>{
    setENS(window.location.pathname.split('/')[1])
  },[])

  console.log(ENS)


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
      //setFuseBurned(contractReadFuseBurned?.data!)
    }
  },[contractReadFuseBurned?.data!])
  console.log((contractReadFuseBurned?.data!))

  
  const contractReadThreeUpLetterFee = useContractRead({
    address: "0x229C0715e70741F854C299913C2446eb4400e76C",
    abi: [
        {
            name: 'threeUpLetterFee',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'threeUpLetterFee',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  const contractReadFourFiveLetterFee = useContractRead({
    address: "0x229C0715e70741F854C299913C2446eb4400e76C",
    abi: [
        {
            name: 'fourFiveLetterFee',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'fourFiveLetterFee',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  const contractReadSixDownLetterFee = useContractRead({
    address: "0x229C0715e70741F854C299913C2446eb4400e76C",
    abi: [
        {
            name: 'sixDownLetterFee',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'sixDownLetterFee',
    args: [(namehash(ENS))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    let prices_ = []
    if (contractReadThreeUpLetterFee?.data! && typeof contractReadThreeUpLetterFee.data === 'bigint' ) {
      prices_.push(contractReadThreeUpLetterFee?.data!)
    }
    if (contractReadFourFiveLetterFee?.data! && typeof contractReadFourFiveLetterFee.data === 'bigint' ) {
      prices_.push(contractReadFourFiveLetterFee?.data!)
    }
    if (contractReadSixDownLetterFee?.data! && typeof contractReadSixDownLetterFee.data === 'bigint' ) {
      prices_.push(contractReadSixDownLetterFee?.data!)
    }
    setPrices(prices_)
  },[contractReadThreeUpLetterFee?.data!, contractReadFourFiveLetterFee?.data!, contractReadSixDownLetterFee?.data!])
  console.log(contractReadThreeUpLetterFee?.data!, contractReadFourFiveLetterFee?.data!, contractReadSixDownLetterFee?.data!)
  console.log(newPrices[0], newPrices[1], newPrices[2])
  


  const prepareContractWriteParentNode = usePrepareContractWrite({
    address: '0x229C0715e70741F854C299913C2446eb4400e76C',
    abi: [
      {
        name: 'setBaseEns',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" } ],
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'setBaseEns',
    args: [ (namehash(ENS)) ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteParentNode = useContractWrite(prepareContractWriteParentNode.config)

  const waitForTransaction = useWaitForTransaction({
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

/*
  const prepareContractWriteParentNodeFee = usePrepareContractWrite({
    address: '0x229C0715e70741F854C299913C2446eb4400e76C',
    abi: [
      {
        name: 'setLetterFees',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "uint256", name: "threeUpLetterFee_", type: "uint256"}, {internalType: "uint256", name: "fourFiveLetterFee_", type: "uint256"}, {internalType: "uint256", name: "sixDownLetterFee_", type: "uint256" } ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'setLetterFees',
    args: [ (namehash(ENS)), (BigInt(0)), (BigInt(0)), (BigInt(0)) ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteParentNodeFee = useContractWrite(prepareContractWriteParentNodeFee.config)

  const waitForTransaction = useWaitForTransaction({
    hash: contractWriteParentNodeFee.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
})

  const handleSetParentNodeFee = async () => {
    try {
        await contractWriteParentNodeFee.writeAsync?.()
    } catch (err) {
        console.log(err)
    }
  }
  */

  console.log(new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(Number(newPrices[1])))//
/*
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))
  };
*/

  useEffect(()=>{
    let dPrices = []
    for (let i = 0; i < newPrices.length; i++) {
      dPrices.push(new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(Number(newPrices[i]))); 
    }
    setDollarPrices(dPrices)
  },[newPrices])

  return (
    <>
      <Navbar/>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.name}> 
            {
              address! === nodeData[0]
              ? (
                <div className={styles.nameOwner}>
                  {
                    activeParentNode
                    ? (
                      <div>
                        {/** some stuff subs & n general info */}
                        <div>
                            <input 
                              type='number' 
                              placeholder={(newPrices[0])}
                              value={(newPrices[0])}
                              onChange={(e) => {
                                const updatedPrices = [...newPrices]
                                updatedPrices[0] = (e.target.value)
                                setNewPrices(updatedPrices)
                              }}
                            />
                            <input
                              type='number' 
                              placeholder={(newPrices[1])}
                              value={(newPrices[1])}
                              onChange={(e) => {
                                const updatedPrices = [...newPrices]
                                updatedPrices[1] = (e.target.value)
                                setNewPrices(updatedPrices)
                              }}
                            />
                            <input
                              type='number' 
                              placeholder={(newPrices[2])}
                              value={(newPrices[2])}
                              onChange={(e) => {
                                const updatedPrices = [...newPrices]
                                updatedPrices[2] = (e.target.value)
                                setNewPrices(updatedPrices)
                              }}
                            />
                        </div>
                      </div>
                    )
                    : (
                      <div>
                      </div>
                    )
                  }
                </div>
              )
              : (
                <div className={styles.nameBuyer}>
                  {
                    activeParentNode
                    ? <div></div>
                    : <div></div>
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
