import styles from '@/styles/Namelist.module.css'
import { namehash } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ensNames } from '@/pages/names'
import { differenceInMonths, differenceInYears } from 'date-fns'
import Image from 'next/image'
import nameSVG from '@/public/assets/icons/name.svg'

interface NameProps{
    ensDomains : ensNames
}

export default function Name({ensDomains}: NameProps) {

    const router = useRouter()

    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [extended, setExtend] = useState<boolean>(false)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [monthsDiff, setMonthsDiff] = useState<number | null>(null)
    const [yearsDiff, setYearsDiff] = useState<number | null>(null);
    

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
    /*
      const waitForSetExtendExp = useWaitForTransaction({
        hash: contractWriteExtendExp.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })
    */
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

    useEffect(()=>{
        const GetDiff = async()=>{
            const timestamp = ensDomains.expiry * 1000;
            
            // Create a Date object from the timestamp
            const expDate = new Date(timestamp);
    
            // Get the current date
            const currentDate = new Date();
            let mlef = differenceInMonths(expDate, currentDate)
            let yrlef = differenceInYears(expDate, currentDate)
            // Calculate the difference in months
            if (yrlef == 0) {
                setMonthsDiff(mlef)
            } else if (yrlef >= 1) {
                //const remainingMonths = mlef - (yrlef * 12)
                //setMonthsDiff( remainingMonths)
                setYearsDiff(yrlef)
                
            }
    
            
        }
        GetDiff()
    },[])

    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div 
                    onClick={() => router.push('/[ensName]', `/${ensDomains.name}`)} 
                    className={styles.name}
                >
                        <div className={styles.nameLeft}>
                            <div className={styles.nameLeftImg}>
                                <Image src={nameSVG} alt='' />
                            </div>
                            <div>
                                <p>{ensDomains.name}</p>
                                <p>{ yearsDiff === null ? `Expires in ${monthsDiff} months` : `Expires in ${yearsDiff} years`}</p>
                            </div>
                        </div>
                        <div className={styles.nameRight}>
                            <span>wrapped</span>
                        </div>
                </div>
            </div>
        </div>
        </>
    )
}
