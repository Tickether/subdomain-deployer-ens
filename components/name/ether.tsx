import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { formatEther, namehash } from 'viem'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import editSVG from '@/public/assets/icons/edit.svg'
import Image from 'next/image'
import EtherModal from './priceModal/ether'



export default function Ether({ENS} : any) {
    const {address, isConnected} = useAccount()
    
    const [prices, setPrices] = useState([BigInt(0), BigInt(0), BigInt(0)])
    //const [ENS, setENS] = useState<string>('') // for now to prevent erroes will pare in props
    const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
    const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
    const [fuseBurned, setFuseBurned] = useState<boolean>(false)
    const [approved, setApproved] = useState<boolean>(false) 
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    


  const handleToggle =  () => {
    if(showUSD){
        setShowUSD(false)
    } else {
        setShowUSD(true)
    }
    
  }

  const handlePriceToggle =  () => {
    setPriceMenu(!priceMenu)
  }


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
        args: [(namehash(ENS))], //get from main div
        chainId: 5,
        watch: true,
      })
      useEffect(() => {
        if (contractReadActiveParentNode?.data! && typeof contractReadActiveParentNode.data === 'boolean' ) {
            setActiveParentNode((contractReadActiveParentNode?.data!))
        }
      },[contractReadActiveParentNode?.data!])

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
    let prices_ : bigint[] = []
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
  //console.log(newPrices[0], newPrices[1], newPrices[2])
  
  

  
    
      return (
        <>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.name}> 
              <div className={styles.profileDown}>
              <div className={styles.profileDownChild}>
                <div className={styles.profileDownPay}>
                  <div>
                    <p>Ethereum</p>
                    <span></span>
                  </div>
                  <div>
                    <p>USD</p>
                    <span></span>
                  </div>
                </div>
                <div className={styles.profileDownSubFee}>
                            <div className={styles.profileDownSub}>
                                <div className={styles.profileDownSubChild}>
                                        <div className={styles.profileDownSubChildTitle}>
                                            <div className={styles.profileDownSubChildFee}>
                                              <p>Subname Prices</p>
                                              <div onClick={()=> setOpenModal(true)}><Image src={editSVG} alt='' /></div>
                                            </div>
                                            {openModal && <EtherModal ENS ={ENS} />}
                                            <div className={styles.profileDownSubChildOption}>
                                              <p>Numbers Only</p>
                                              <Image src={drop_blueSVG} alt='' />
                                            </div>
                                            {/**
                                            <div onClick={handlePriceToggle} className={styles.profileDownSubChildOptionToggle}>
                                              <span>Letters & Numbers</span>
                                              <span>Numbers Only</span>
                                            </div>
                                             */}
                                            
                                        </div>
                                        <div onClick={handleToggle} className={styles.profileDownToggle}>
                                            {
                                                showUSD 
                                                ?(
                                                    <>
                                                        <div className={styles.profileDownToggleETH}>
                                                            <span>ETH</span>
                                                        </div>
                                                        <div className={styles.profileDownToggleSelectUSD}>
                                                            <span>USD</span>
                                                        </div>
                                                    </>
                                                )
                                                :(
                                                    <>
                                                        <div className={styles.profileDownToggleSelectETH}><span>ETH</span></div>
                                                        <div className={styles.profileDownToggleUSD}><span>USD</span></div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    
                                </div>
                            </div>
                            <div className={styles.profileDownFee}>
                                {
                                    showUSD
                                    ?( 
                                        <div className={styles.profileDownFeeChild}>
                                            <div className={styles.profileDownFees}><span>One Number Fee</span><span>{0} USD</span></div>
                                            <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{0} USD</span></div>
                                            <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{0} USD</span></div>
                                            <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{0} USD</span></div>
                                            <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{0} USD</span></div>
                                        </div>
                                    )
                                    :(
                                        <div className={styles.profileDownFeeChild}>
                                            <div className={styles.profileDownFees}><span>One Number Fee</span><span>{0} ETH</span></div>
                                            <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{0} ETH</span></div>
                                            <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{0} ETH</span></div>
                                            <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{0} ETH</span></div>
                                            <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{0} ETH</span></div>
                                        </div>   
                                    )
                                }
                            </div>
                        </div>
              </div>
            </div>
                    <div className={styles.nameOwner}>
                      {
                        approved 
                        ? (
                          <div>
                            {
                              activeParentNode
                              ? (
                                <div></div>
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
              </div>
            </div>
          </div>
        </>
      )
}
/*

<div>
                                <span>baolance{formatEther(parentNodeBalance)}</span>
                                <button onClick={() => setOpenModal(true)}>set Prices</button>
                                <button onClick={handleWithdraw}>withdraw</button>
                              </div> 
*/


/*


*/