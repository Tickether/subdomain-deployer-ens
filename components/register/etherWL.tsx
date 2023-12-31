import styles from '@/styles/RegisterOptions.module.css'
import { useEffect, useState } from 'react'
import { createPublicClient, formatEther, formatGwei, fromHex, http, namehash, parseEther } from 'viem'
import { useAccount, useContractRead, useContractWrite, useFeeData, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import plusSVG from '@/public/assets/icons/plus.svg'
import minusSVG from '@/public/assets/icons/minus.svg'
import plus_disabledSVG from '@/public/assets/icons/plus-disabled.svg'
import minus_disabledSVG from '@/public/assets/icons/minus-disabled.svg'
import gasSVG from '@/public/assets/icons/gas.svg'
import wlSVG from '@/public/assets/icons/wl.svg'
import nowlSVG from '@/public/assets/icons/nowl.svg'
import gobackSVG from '@/public/assets/icons/goback.svg'
import Image from 'next/image'
import { goerli } from 'viem/chains'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'



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


export default function EtherWL({rootNodeENS, subLabel, clearOption} : RegisterProps) {

    const {address, isConnected} = useAccount()
    const { data } = useFeeData({watch: true})
    const [gas, setGas] = useState<string>('')
    const [gasFee, setGasFee] = useState<string>('')
    const [totalFee, setTotalFee] = useState<string>('')
    const [nodeData, setNodeData] = useState<any>([])
    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [etherPrice, setEtherPrice] = useState<number>(0)
    const [roundData, setRoundData] = useState<bigint[] | null>(null)
    const [USData, setUSData] = useState<any>([])
    const [allowlisted, setAllowlisted] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)
    const [canSubActiveNode, setCanSubActiveNode] = useState<boolean>(false)
    const [offChainHolders, setOffChainHolders] = useState<OffChainHolders | null >(null)
    const [merkleProof, setMerkleProof] = useState<string[] | null>(null)
    //
    

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
    address: "0x089052090493F92fDA947Bc9362d439f2EF979E2",
    abi: [
        {
            name: 'parentNodeCanSubActive',
            inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeCanSubActive',
    args: [(rootNodeENS)],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadCanSubActiveParentNode?.data! && typeof contractReadCanSubActiveParentNode.data === 'boolean' ) {
      setCanSubActiveNode((contractReadCanSubActiveParentNode?.data!))
    }
  },[contractReadCanSubActiveParentNode?.data!])

  useEffect(()=>{
    const handleGetAllowlist = async () => {
        const enshash = rootNodeENS
        try {
            const res = await fetch('../../api/allowlist/getETH', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                enshash,
            })
            }) 
            const data = await res.json()
            console.log(data)
            if (data) {
            const offChainData : OffChainHolders = {
                mode: (data.modeETH),
                merkle: (data.merkleETH),
                allowlist: (data.allowlistETH),
            };
            
            setOffChainHolders(offChainData)
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
        address: "0x089052090493F92fDA947Bc9362d439f2EF979E2",
        abi: [
            {
                name: 'getPricetoUse',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "string", name: "label", type: "string" }, { internalType: "uint256", name: "duration", type: "uint256" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'getPricetoUse',
        args: [(rootNodeENS), (subLabel), (subsYears)],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadSubNodeFee?.data! && typeof contractReadSubNodeFee.data === 'bigint' ) {
          setSubNodeFee(contractReadSubNodeFee?.data!)
        }
    },[contractReadSubNodeFee?.data!])
    console.log((contractReadSubNodeFee?.data!))
    

    // check node price in usd
    const contractReadETH = useContractRead({
        address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        abi: [
            {
                name: 'latestRoundData',
                inputs: [/*{ internalType: "uint80", name: "_roundId", type: "uint80" }*/],
                outputs: [
                    { internalType: "uint80", name: "roundId", type: "uint80" }, 
                    { internalType: "int256", name: "answer", type: "int256" }, 
                    { internalType: "uint256", name: "startedAt", type: "uint256" },
                    { internalType: "uint256", name: "updatedAt", type: "uint256" },
                    { internalType: "uint80", name: "answeredInRound", type: "uint80" },
                ],

                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'latestRoundData',
        chainId: 1,
        watch: true,
    })
    useEffect(() => {
        if (contractReadETH?.data/* && contractReadETH.data === bigint[]*/) {
            setRoundData(contractReadETH?.data as bigint[])
        }
    },[contractReadETH?.data!])

    
    useEffect(() => {
        if (roundData != null) {
            const ethPrice = Number((Number(roundData[1].toString()) / Math.pow(10, 8)).toFixed(2));
            setEtherPrice(ethPrice)
        }
    },[roundData])
    
    

    
    useEffect(()=>{
        const setUSD = async () => {
            setUSData([
                (Number(formatEther(subNodeFee)) * etherPrice).toFixed(2), //(Number(ether) * etherPrice).toFixed(2)
                (Number(gasFee) * etherPrice).toFixed(2), 
                (Number(totalFee) * etherPrice).toFixed(2)
            ])
        }
        setUSD()
    },[subNodeFee, gasFee, totalFee, etherPrice])
    
    //console.log(getUSD(totalFee))

    console.log((contractReadETH?.data))
    console.log(etherPrice)

    useEffect(()=>{
        if (offChainHolders?.allowlist != null) {
            const leafNodes = offChainHolders?.allowlist.map(addr => keccak256((addr)));
            const merkleTree = new MerkleTree(leafNodes!, keccak256, {sortPairs: true});
            const index = offChainHolders?.allowlist.indexOf(address!.toLowerCase());
            console.log(index)
            
            if (index < 0) {
                setAllowlisted(false)
            } else {
                let clamingAddress = leafNodes![index!];
                let hexProof = merkleTree.getHexProof(clamingAddress);
                setAllowlisted(true)
                setMerkleProof(hexProof)
            }
        }
    })

    //transac est gas
    useEffect(()=>{
        const gasUsed =  278006
        
        const fee = (Number(gas) * (gasUsed)) * 1000000000
    
        setGasFee(formatEther(BigInt(fee)))
    },[gas])
    
    //total fee+gas
    useEffect(()=>{
        const total = subNodeFee + parseEther(gasFee)
        setTotalFee(formatEther(total))
    },[gasFee, subNodeFee])

    //read on-Allow

    const { config } = usePrepareContractWrite({
        address: '0x089052090493F92fDA947Bc9362d439f2EF979E2',
        abi: [
            {
              name: 'setSubDomain',
              inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" },{internalType: "bytes32[]", name: "merkleRoot", type: "bytes32[]"} ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'setSubDomain',
        args: [ (rootNodeENS), (subLabel), (address!), (subsYears), (merkleProof) ],
        value: subNodeFee,
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

    return (
        <>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <div onClick={() => clearOption()} className={styles.caption}>
                        
                            <div className={styles.captionTitle}>
                                <div className={styles.captionTitleImgEtherWL}><Image src={gobackSVG} alt='' /></div>
                                <div className={styles.captionTitleText}><p>ETHEREUM + ALLOWLIST</p></div>
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
                                allowlisted && 
                                (
                                    <div className={styles.allowlisted}>
                                        <div className={styles.allowlistedInfoImg}>
                                            <Image src={wlSVG} alt='' />
                                        </div>
                                        <div className={styles.allowlistedInfoText}>
                                            <span>You are on allowlist.</span>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                !allowlisted &&
                                (
                                    <div className={styles.allowlistNot}>
                                        <div className={styles.allowlistedInfoImg}>
                                            <Image src={nowlSVG} alt='' />
                                        </div>
                                        <div className={styles.allowlistedInfoText}>
                                            <span>You are not on allowlist.</span>
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
                            <div className={styles.feeNgasDown}>
                                {
                                    showUSD
                                    ?( 
                                        <div className={styles.feeNgasDownChild}>
                                            <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>{USData[0]} USD</span></div>
                                            <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>{USData[1]} USD</span></div>
                                            <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>{USData[2]} USD</span></div>
                                        </div>
                                    )
                                    :(
                                        <div className={styles.feeNgasDownChild}>
                                            <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>{formatEther(subNodeFee)} ETH</span></div>
                                            <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>{gasFee} ETH</span></div>
                                            <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>{totalFee} ETH</span></div>
                                        </div>   
                                    )
                                }
                            </div>
                            
                        </div>
                        <div className={styles.actionButtons}>
                            <button 
                                disabled={!connected || !allowlisted || merkleProof === null || !canSubActiveNode}
                                
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
