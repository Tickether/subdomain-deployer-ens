import styles from '@/styles/RegisterOptions.module.css'
import { useEffect, useState } from 'react'
import { formatEther, fromHex } from 'viem'
import { useAccount, useContractRead, useContractWrite, useFeeData, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import plusSVG from '@/public/assets/icons/plus.svg'
import minusSVG from '@/public/assets/icons/minus.svg'
import plus_disabledSVG from '@/public/assets/icons/plus-disabled.svg'
import minus_disabledSVG from '@/public/assets/icons/minus-disabled.svg'
import gasSVG from '@/public/assets/icons/gas.svg'
import wlSVG from '@/public/assets/icons/wl.svg'
import nowlSVG from '@/public/assets/icons/nowl.svg'
import dropSVG from '@/public/assets/icons/drop.svg'
import gobackSVG from '@/public/assets/icons/goback.svg'
import Image from 'next/image'


interface RegisterProps {
    rootNodeENS: `0x${string}`,
    subLabel : string
    clearOption: () => void;
}

interface OffChainHolders {
    mode: string,
    merkle: string,
    allowlist: string[]
  }


export default function Erc20WL({rootNodeENS, subLabel, clearOption} : RegisterProps) {

    const {address, isConnected} = useAccount()
    const { data, isError, isLoading } = useFeeData()
    const [gas, setGas] = useState<string>('')
    const [nodeData, setNodeData] = useState<any>([])
    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [allowlisted, setAllowlisted] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)
    const [canSubActiveNode, setCanSubActiveNode] = useState<boolean>(false)
    const [contractMenu, setContractMenu] = useState<boolean>(false)
    const [selectedContract, setSelectedContract] = useState<string>('');
    const [ERC20List, setERC20List] = useState<string[] | null>(null)
    const [offChainHolders, setOffChainHolders] = useState<OffChainHolders | null >(null)
    
    const handleContractToggle =  () => {
        setContractMenu(!contractMenu)
    }

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])
    useEffect(() => {
        if (data /* && typeof isConnected === 'boolean'*/) {
            const valueAsString = data?.formatted.gasPrice;
            const truncatedValue = parseFloat(valueAsString!).toFixed(2);
            setGas((truncatedValue))
        } 
    },[data])
    console.log(data?.formatted.gasPrice)

    // check node data
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
        args: [fromHex(rootNodeENS, 'bigint')],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadNodeData?.data!) {
            setNodeData(contractReadNodeData?.data!)
        }
    },[contractReadNodeData?.data!])
    console.log((contractReadNodeData?.data!))
      
    
    // check canSub/ParentNodeActive

const contractReadCanSubActiveParentNode = useContractRead({
    address: "0x5c7d14e3d9a9b5778D8d51A0f209dCae2648c406",
    abi: [
        {
            name: 'parentNodeCanSubActive',
            inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeCanSubActive',
    args: [(rootNodeENS), (selectedContract)],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadCanSubActiveParentNode?.data! && typeof contractReadCanSubActiveParentNode.data === 'boolean' ) {
      setCanSubActiveNode((contractReadCanSubActiveParentNode?.data!))
    }
  },[contractReadCanSubActiveParentNode?.data!])

  // get erc20 list
const contractReadERC20List = useContractRead({
    address: "0x5c7d14e3d9a9b5778D8d51A0f209dCae2648c406",
    abi: [
        {
            name: 'listERC20',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
  
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'listERC20',
    args: [(rootNodeENS)],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadERC20List?.data/* && contractReadETH.data === bigint[]*/) {
      setERC20List(contractReadERC20List?.data as string[])
    }
  },[contractReadERC20List?.data!])
  
  
  
  const handleContractSelect =(ERC20Contract: string, ERC20Symbol: string)=>{
    setSelectedContract(ERC20Contract); 
    //setTokenSymbol(ERC20Symbol)
    setContractMenu(false); 
  }

  useEffect(()=>{
    const handleGetAllowlist = async () => {
      try {
        const res = await fetch('../../api/allowlist/get', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            address,
          })
        }) 
        const data = await res.json()
        console.log(data)
        if (data) {
          const offChainDefault : OffChainHolders = {
            mode: (data.address),
            merkle: (data.merkle),
            allowlist: (data.allowlist),
          };
          
          setOffChainHolders(offChainDefault)
        }
        
        return data
      } catch (error) {
        console.log(error)
      }
    }
    handleGetAllowlist()
  })
  
  
  console.log(offChainHolders)
    
    useEffect(()=>{
        let timeNow
        let timeLeft
        const year = 31556926000
        if (nodeData.length > 0) {
            const nodeExpiry = Number(nodeData[2]) * 1000
            timeNow = Date.now()
            timeLeft = nodeExpiry - timeNow
            setYearsLeft( (Math.floor(timeLeft / year) - 1) ) // till sync
        }
    },[nodeData])

    console.log(yearsLeft)

    const handleDecrement = () => {
        if (subsYears <= 1) return
        setSubsYears(subsYears - 1 );
    };
    
    const handleIncrement = () => {
        if (subsYears >= yearsLeft ) return
        setSubsYears(subsYears + 1)
    };


    
    // check node price
    const contractReadSubNodeFee = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
            {
                name: 'getLetterFees',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "string", name: "label", type: "string" }, { internalType: "uint256", name: "duration", type: "uint256" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'getLetterFees',
        //args: [(rootNodeENS), (subLabel), (subsYears)],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadSubNodeFee?.data! && typeof contractReadSubNodeFee.data === 'bigint' ) {
          setSubNodeFee(contractReadSubNodeFee?.data!)
        }
    },[contractReadSubNodeFee?.data!])
    console.log((contractReadSubNodeFee?.data!))

    const { config } = usePrepareContractWrite({
        address: '0x229C0715e70741F854C299913C2446eb4400e76C',
        abi: [
            {
              name: 'setSubDomain',
              inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'setSubDomain',
        args: [ (rootNodeENS), (subLabel), (address!), (subsYears) ],
        value: subNodeFee,
        chainId: 5,
     })
    const contractWriteSubdomain = useContractWrite(config)

    const waitForTransaction = useWaitForTransaction({
        hash: contractWriteSubdomain.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })

    const handleSubdomain = async () => {
        try {
            await contractWriteSubdomain.writeAsync?.()
        } catch (err) {
            console.log(err)
        }
    }

    const handleToggle =  () => {
        if(showUSD){
            setShowUSD(false)
        } else {
            setShowUSD(true)
        }
        
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                <div className={styles.content}>
                        <div onClick={() => clearOption()} className={styles.caption}>
                    
                            <div className={styles.captionTitle}>
                                <div className={styles.captionTitleImgERC20WL}><Image src={gobackSVG} alt='' /></div>
                                <div className={styles.captionTitleText}><p>ERC20 + ALLOWLIST</p></div>
                            </div>

                            <div className={styles.captionSub}>
                                {
                                    canSubActiveNode 
                                    ? <div className={styles.captionCanSub}><span>Live</span></div>
                                    : <div className={styles.captionCanNotSub}><span>Paused</span></div>
                                }
                            </div>
                        </div>
                        <div className={styles.allowlist}>
                            {
                                allowlisted
                                ?(
                                    <div className={styles.allowlisted}>
                                        <div>
                                            <Image src={wlSVG} alt='' />
                                        </div>
                                        <div className={styles.allowlistedInfoText}>
                                            <span>You are on allowlist.</span>
                                        </div>
                                    </div>
                                )
                                :(
                                    <div className={styles.allowlistNot}>
                                        <div>
                                            <Image src={nowlSVG} alt='' />
                                        </div>
                                        <div className={styles.allowlistedInfoText}>
                                            <span>You are not  on allowlist.</span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className={styles.yearButtons}>
                            {
                                subsYears == 1
                                ?(
                                    <div 
                                        className={styles.countButtons}
                                    >
                                        <Image src={minus_disabledSVG} alt='' />
                                    </div>
                                )
                                :(
                                    <div 
                                        className={styles.countButtons}
                                        onClick={handleDecrement}
                                    >
                                        <Image src={minusSVG} alt='' />
                                    </div>
                                )
                            }

                            <div className={styles.yearButtonsInput}>
                                <input 
                                    readOnly
                                    type='text' 
                                    value={subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'}
                                />
                            </div>
                            {
                                subsYears == yearsLeft 
                                ?(
                                    <div 
                                        className={styles.countButtons}
                                    >
                                        <Image src={plus_disabledSVG} alt='' />
                                    </div>
                                ) 
                                :(
                                    <div 
                                        className={styles.countButtons}
                                        onClick={handleIncrement}
                                    >
                                        <Image src={plusSVG} alt='' />
                                    </div>
                                )
                            }
                            
                        </div>
                        <div className={styles.feeNgas}>
                            <div className={styles.feeNgasTop}>
                                <div className={styles.feeNgasTopChild}>
                                    
                                    <div className={styles.gas}>
                                        <Image src={gasSVG} alt='' />
                                        <span>{gas} Gwei</span>
                                    </div>
                                    <div className={styles.feeNgasTopToggleParent}>
                                        <div /*onClick={handleToggle}*/>
                                            <Image src={dropSVG} alt='' />
                                        </div>
                                        <div onClick={handleToggle} className={styles.feeNgasTopToggle}>
                                            
                                            {
                                                showUSD 
                                                ?(
                                                    <>
                                                        <div className={styles.feeNgasTopToggleETH}>
                                                            <span>ETH</span>
                                                        </div>
                                                        <div className={styles.feeNgasTopToggleSelectUSD}>
                                                            <span>USD</span>
                                                        </div>
                                                    </>
                                                )
                                                :(
                                                    <>
                                                        <div className={styles.feeNgasTopToggleSelectETH}><span>ETH</span></div>
                                                        <div className={styles.feeNgasTopToggleUSD}><span>USD</span></div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                    
                                </div>
                            </div>
                            <div className={styles.feeNgasDown}>
                                {
                                    showUSD
                                    ?( 
                                        <div className={styles.feeNgasDownChild}>
                                            <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>0 USD</span></div>
                                            <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>0 USD</span></div>
                                            <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>0 USD</span></div>
                                        </div>
                                    )
                                    :(
                                        <div className={styles.feeNgasDownChild}>
                                            <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>{formatEther(subNodeFee)} ETH</span></div>
                                            <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>0 ETH</span></div>
                                            <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>0 ETH</span></div>
                                        </div>   
                                    )
                                }
                            </div>
                            
                        </div>
                        <div className={styles.actionButtons}>
                            <button 
                                disabled={!connected}
                                
                                //onClick={() => setOpenModal(true)}
                                onClick={handleSubdomain}
                            >
                                Lets Go!
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
