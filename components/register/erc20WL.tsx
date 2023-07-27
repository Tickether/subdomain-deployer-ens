import styles from '@/styles/RegisterOptions.module.css'
import { useEffect, useState } from 'react'
import { formatEther, fromHex } from 'viem'
import { useAccount, useContractRead, useContractWrite, useFeeData, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import plusSVG from '@/public/assets/icons/plus.svg'
import minusSVG from '@/public/assets/icons/minus.svg'
import Image from 'next/image'


interface RegisterProps {
    rootNodeENS: `0x${string}`,
    subLabel : string
    clearOption: () => void;
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
    const [connected, setConnected] = useState<boolean>(false)
    

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
                        <div className={styles.yearButtons}>
                        
                            <div 
                                className={styles.countButtons}
                                onClick={handleDecrement}
                            >
                                <Image src={minusSVG} alt='' />
                            </div>
                            <div className={styles.yearButtonsInput}>
                                <input 
                                    readOnly
                                    type='text' 
                                    value={subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'}
                                />
                            </div>
                            <div 
                                className={styles.countButtons}
                                onClick={handleIncrement}
                            >
                                <Image src={plusSVG} alt='' />
                            </div>
                            
                        </div>
                        <div className={styles.feeNgas}>
                            <div className={styles.feeNgasTop}>
                                <div onClick={handleToggle} className={styles.feeNgasTopChild}>
                                    
                                        <span>{gas} Gwei</span>
                                        <div className={styles.feeNgasTopToggle}>
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
                                <div className={styles.feeNgasDownChild}>
                                    <div className={styles.feeNgasDownFees}><span>{subsYears === 1 ? subsYears + ' ' + 'year' : subsYears + ' ' + 'years'} registraion</span><span>{formatEther(subNodeFee)} ETH</span></div>
                                    <div className={styles.feeNgasDownGas}><span>Est. network fee</span><span>0 ETH</span></div>
                                    <div className={styles.feeNgasDownSum}><span>Estimated total</span><span>0 ETH</span></div>
                                </div>
                            </div>
                            
                        </div>
                        <div className={styles.actionButtons}>
                            <button
                                onClick={() => clearOption()}
                                //onClick={handleSubdomain}
                            >
                                Choose Payment..
                            </button>
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
