import styles from '@/styles/Home.module.css'
import { namehash } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ensNames } from '@/pages/names'

interface NameProps{
    ensDomains : ensNames
}

export default function Name({ensDomains}: NameProps) {

    const router = useRouter()

    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [extended, setExtend] = useState<boolean>(false)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))

    const ENStoString = ensDomains.name!.toString()
    
    const dotIndex = ENStoString!.indexOf(".") 
    const subLabel = ENStoString!.substring(0, dotIndex) // Extract the substring before the dot
    const rootENS = ENStoString!.substring(dotIndex + 1) // Extract the substring after the dot
    console.log(ENStoString)
    console.log(rootENS)
    console.log(subLabel)
   
   
    
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
    args: [(namehash(rootENS)), (subLabel), (subsYears)],
    chainId: 5,
    watch: true,
})
useEffect(() => {
    if (contractReadSubNodeFee?.data! && typeof contractReadSubNodeFee.data === 'bigint' ) {
      setSubNodeFee(contractReadSubNodeFee?.data!)
    }
},[contractReadSubNodeFee?.data!])
console.log((contractReadSubNodeFee?.data!))

    const prepareContractWriteExtendExp = usePrepareContractWrite({
        address: '0x229C0715e70741F854C299913C2446eb4400e76C',
        abi: [
          {
            name: 'extendSubDomain',
            inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "bytes32", name: "subNode", type: "bytes32"}, {internalType: "uint256", name: "duration", type: "uint256"} ],
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
        ],
        functionName: 'extendSubDomain',
        args: [ (namehash(rootENS)), (namehash(ensDomains.name)), (subsYears) ],
        value: subNodeFee,
        chainId: 5,
      })
      const contractWriteExtendExp = useContractWrite(prepareContractWriteExtendExp.config)
    
      const waitForSetExtendExp = useWaitForTransaction({
        hash: contractWriteExtendExp.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })
    
    const handleExtendExp = async () => {
        try {
            await contractWriteExtendExp.writeAsync?.()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDecrement = () => {
        if (subsYears <= 1) return
        setSubsYears(subsYears - 1 );
    };
    
    const handleIncrement = () => {
        if (subsYears >= yearsLeft ) return
        setSubsYears(subsYears + 1)
    };

    console.log(ensDomains.expiry)
    console.log(ensDomains.parent)
    
    useEffect(()=>{
        const domainTime = ensDomains.expiry 
        const parentExpiry = ensDomains.parent
        let timeLeft
        const year = 31556926
        if (domainTime) {
            
            timeLeft = Number(parentExpiry) - domainTime
            setYearsLeft( (Math.floor(timeLeft / year) - 1) ) // till sync
        }
    },[ensDomains])
    

    console.log(yearsLeft)

    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div className={styles.search}>
                    <p onClick={() => 
                                
                                    router.push('/[ensName]', `/${ensDomains.name}`)}
                    >
                        {ensDomains.name}
                    </p>
                    <span>wrapped: {ensDomains.wrapped}</span>
                    {
                        extended
                        ? (
                            <div>
                                <div>
                                <button onClick={handleDecrement}>-</button>
                                <input 
                                    readOnly
                                    type='number' 
                                    value={subsYears}
                                />
                                <button onClick={handleIncrement}>+</button>
                                </div>
                                <button onClick={() => setExtend(false)}>cancel</button>
                            </div>
                        )
                        : <div></div>
                    }
                    
                    <button disabled={yearsLeft <= 0} onClick={()=> {extended ? handleExtendExp : setExtend(true)}}>extend</button>
                    
            </div>
            </div>
        </div>
        </>
    )
}
