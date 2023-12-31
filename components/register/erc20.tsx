import styles from '@/styles/RegisterOptions.module.css'
import { useEffect, useState } from 'react'
import { createPublicClient, formatEther, formatGwei, fromHex, http } from 'viem'
import { useAccount, useContractRead, useContractWrite, useFeeData, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import plusSVG from '@/public/assets/icons/plus.svg'
import minusSVG from '@/public/assets/icons/minus.svg'
import plus_disabledSVG from '@/public/assets/icons/plus-disabled.svg'
import minus_disabledSVG from '@/public/assets/icons/minus-disabled.svg'
import gasSVG from '@/public/assets/icons/gas.svg'
import dropSVG from '@/public/assets/icons/drop.svg'
import gobackSVG from '@/public/assets/icons/goback.svg'
import Image from 'next/image'
import { goerli } from 'viem/chains'
import ERC20Contract from '../name/profile/erc20Contract'


interface RegisterProps {
    rootNodeENS: `0x${string}`,
    subLabel : string
    clearOption: () => void;
}



export default function Erc20({rootNodeENS, subLabel, clearOption} : RegisterProps) {

    const {address, isConnected} = useAccount()
    const { data } = useFeeData({watch: true})
    const [gas, setGas] = useState<string>('')
    const [gasFee, setGasFee] = useState<string>('')
    const [nodeData, setNodeData] = useState<any>([])
    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [allowance, setAllowance] = useState<bigint>(BigInt(0))
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)
    const [canSubActiveNode, setCanSubActiveNode] = useState<boolean>(false)
    const [contractMenu, setContractMenu] = useState<boolean>(false)
    const [selectedContract, setSelectedContract] = useState<string>('')
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
    const [tokenDecimal, setTokenDecimal] = useState<number | null>(null);
    const [ERC20List, setERC20List] = useState<string[] | null>(null)

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
            const value = data?.gasPrice! + BigInt(1500000000)
            const valueAsString = formatGwei(value)
            const truncatedValue = parseFloat(valueAsString!).toFixed(2);
            setGas((truncatedValue))
        } 
    },[data])
    console.log(data)
    console.log(gasFee)

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
    address: "0x7a6901b13e520fB1c487D5aaFb032174de5791aA",
    abi: [
        {
            name: 'parentNodeCanSubERC20Active',
            inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }, {internalType: "address", name: "", type: "address"} ],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeCanSubERC20Active',
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
    address: "0x7a6901b13e520fB1c487D5aaFb032174de5791aA",
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
  
  
  
  const handleContractSelect =(ERC20Contract: string, ERC20Symbol: string, ERC20Decimal: number)=>{
    setSelectedContract(ERC20Contract)
    setTokenSymbol(ERC20Symbol)
    setTokenDecimal(ERC20Decimal)
    setContractMenu(false)
  }
    
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


    console.log(Number(subNodeFee) * Math.pow(10, tokenDecimal!))
    // check node price
    const contractReadSubNodeFee = useContractRead({
        address: "0x7a6901b13e520fB1c487D5aaFb032174de5791aA",
        abi: [
            {
                name: 'getPricetoUse',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "string", name: "label", type: "string" }, { internalType: "uint256", name: "duration", type: "uint256" }, { internalType: "address", name: "erc20Contract", type: "address" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'getPricetoUse',
        args: [(rootNodeENS), (subLabel), (subsYears), (selectedContract)],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadSubNodeFee?.data! && typeof contractReadSubNodeFee.data === 'bigint' ) {
          setSubNodeFee(contractReadSubNodeFee?.data!)
        }
    },[contractReadSubNodeFee?.data!])
    console.log((contractReadSubNodeFee?.data!))

    //transac est gas
    useEffect(()=>{
        const gasUsed = 260000
        
        const fee = (Number(gas) * (gasUsed)) * 1000000000
    
        setGasFee(formatEther(BigInt(fee)))
    },[gas, selectedContract])

    const { config } = usePrepareContractWrite({
        address: '0x7a6901b13e520fB1c487D5aaFb032174de5791aA',
        abi: [
            {
              name: 'setSubDomainERC20',
              inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" }, {internalType: "address", name: "erc20Contract", type: "address"} ],
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        functionName: 'setSubDomainERC20',
        args: [ (rootNodeENS), (subLabel), (address!), (subsYears), (selectedContract) ],
        value: BigInt(0),
        chainId: 5,
     })
    const contractWriteSubdomain = useContractWrite(config)
/*
    const waitForTransaction = useWaitForTransaction({
        hash: contractWriteSubdomain.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })
*/
    const handleSubdomain = async () => {
        try {
            contractWriteSubdomain.write?.()
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

    // check allowance price
    const contractReadAllowance = useContractRead({
        address: `0x${selectedContract.slice(2)}`,
        abi: [
            {
                name: 'allowance',
                inputs: [  { internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" } ],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'allowance',
        args: [(address), ('0x7a6901b13e520fB1c487D5aaFb032174de5791aA')],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadAllowance?.data! && typeof contractReadAllowance.data === 'bigint' ) {
          setAllowance(contractReadAllowance?.data!)
        }
    },[contractReadAllowance?.data!])
    console.log((contractReadAllowance?.data!))
    //approval
    const prepareContractWriteApproval = usePrepareContractWrite({
        address: `0x${selectedContract.slice(2)}`,
        abi: [
            {
              name: 'approve',
              inputs: [  { internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" } ],
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        functionName: 'approve',
        args: [ ('0x7a6901b13e520fB1c487D5aaFb032174de5791aA'), (Number(subNodeFee) * Math.pow(10, tokenDecimal!))],
        value: BigInt(0),
        chainId: 5,
     })
    const contractWriteApproval = useContractWrite(prepareContractWriteApproval.config)
/*
    const waitForApproval = useWaitForTransaction({
        hash: contractWriteApproval.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })
*/
    const handleApproval = async () => {
        try {
            contractWriteApproval.write?.()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                <div className={styles.content}>
                        <div onClick={() => clearOption()} className={styles.caption}>
                            <div className={styles.captionTitle}>
                                <div className={styles.captionTitleImgERC20}><Image src={gobackSVG} alt='' /></div>
                                <div className={styles.captionTitleText}><p>ERC20</p></div>
                            </div>
                            <div className={styles.captionSub}>
                                {
                                    canSubActiveNode 
                                    ? <div className={styles.captionCanSub}><span>Live</span></div>
                                    : <div className={styles.captionCanNotSub}><span>Paused</span></div>
                                }
                            </div>
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
                                <div onClick={handleToggle} className={styles.feeNgasTopChild}>
                                    
                                    <div className={styles.gas}>
                                        <Image src={gasSVG} alt='' />
                                        <span>{gas} Gwei</span>
                                    </div>
                                    <div className={styles.feeNgasTopToggleParent}>
                                        <div onClick={handleContractToggle}>
                                            <Image src={dropSVG} alt='' />
                                        </div>
                                        <div className={styles.contractDropOverlay}>
                                            {
                                              contractMenu && (
                                                <div className={styles.profileDownOptionDrop}>
                                                  <div className={styles.profileDownOptionToggle}>
                                                    
                                                    {ERC20List?.map((erc20Contract: string) => (
                                                      <ERC20Contract 
                                                        erc20Contract={erc20Contract}
                                                        selectERC20 = {handleContractSelect}
                                                      />
                                                    ))}
                                                  </div>
                                                </div>
                                              )
                                            }
                                          </div>
                                        <div onClick={handleToggle} className={styles.feeNgasTopToggle}>
                                            
                                            {
                                                showUSD 
                                                ?(
                                                    <>
                                                        <div className={styles.feeNgasTopToggleETH}>
                                                            <span>{selectedContract === '' ? 'ERC20' : tokenSymbol}</span>
                                                        </div>
                                                        <div className={styles.feeNgasTopToggleSelectUSD}>
                                                            <span>USD</span>
                                                        </div>
                                                    </>
                                                )
                                                :(
                                                    <>
                                                        <div className={styles.feeNgasTopToggleSelectETH}><span>{selectedContract === '' ? 'ERC20' : tokenSymbol}</span></div>
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
                                            <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>{Number(subNodeFee)} {selectedContract === '' ? 'ERC20' : tokenSymbol}</span></div>
                                            <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>{gasFee} ETH</span></div>
                                            <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>{Number(subNodeFee)} {selectedContract === '' ? 'ERC20' : tokenSymbol} + {gasFee} ETH</span></div>
                                        </div>   
                                    )
                                }
                            </div>
                            
                        </div>
                        <div className={styles.actionButtons}>
                            <button 
                                disabled={Number(allowance) === Number(subNodeFee)}
                                onClick={handleApproval}
                            >
                                Approval...
                            </button>
                            <button 
                                disabled={!connected || Number(allowance) <= Number(subNodeFee)}
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
