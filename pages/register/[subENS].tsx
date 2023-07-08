import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { namehash } from 'viem/ens'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { fromHex } from 'viem'



export default function Register() {

    const {address, isConnected} = useAccount()
    const [ subENS, setSubENS ] = useState<string>('')
    const [nodeData, setNodeData] = useState<any>([])
    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [connected, setConnected] = useState<boolean>(false)
    

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])
    
    
    useEffect(()=>{
        setSubENS(window.location.pathname.split('/')[2])
    },[])

    useEffect(()=>{
        //conditions for reload - browser re-entry
        if (rootENS === 'eth') {
            //set some true
        }
        else if (address! === nodeData[0]) {
            //set some true
        } 
        else if (namehash(subENS)) {
            //set some true
        }   
    },[])
    
    
    //use sub ens to get root node
    const subENStoString = subENS!.toString()
    console.log(subENStoString)
    const dotIndex = subENStoString!.indexOf(".") 
    const subLabel = subENStoString!.substring(0, dotIndex) // Extract the substring before the dot
    const rootENS = subENStoString!.substring(dotIndex + 1) // Extract the substring after the dot
    const rootNodeENS = namehash(rootENS)//

    console.log(subLabel)
    console.log(rootENS)
    console.log(rootNodeENS)
    console.log(fromHex(rootNodeENS, 'bigint'))
    

    // check node expires
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
    if (contractReadNodeData?.data! /*&& typeof contractReadNodeExpired.data === 'Array<string' */) {
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
            setYearsLeft( Math.floor(timeLeft / year) )
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

    const handleSubdomain = async () => {
        try {
            await contractWriteSubdomain.writeAsync?.()
        } catch (err) {
            console.log(err)
        }
    }

    const waitForTransaction = useWaitForTransaction({
        hash: contractWriteSubdomain.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })



    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.wrapper}> 
                    <div>
                        <p>{subENStoString}</p>
                        <div className={styles.claimItemButtons}>
                            <button onClick={handleDecrement}>-</button>
                            <input 
                                readOnly
                                type='number' 
                                value={subsYears}
                            />
                            <button onClick={handleIncrement}>+</button>
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
