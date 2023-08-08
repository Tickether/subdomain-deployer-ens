import styles from '@/styles/Subnamelist.module.css'
import { namehash } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { differenceInMonths, differenceInYears } from 'date-fns'
import Image from 'next/image'
import nameSVG from '@/public/assets/icons/name.svg'
import { SubName } from './subnames'

interface SubNameProps{
    subEns : SubName
  }
  
export default function Subname({subEns}: SubNameProps) {

    const [yearsLeft, setYearsLeft] = useState<number>(0)
    const [subsYears, setSubsYears] = useState<number>(1)
    const [extended, setExtend] = useState<boolean>(false)
    const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    const [monthsDiff, setMonthsDiff] = useState<number | null>(null)
    const [yearsDiff, setYearsDiff] = useState<number | null>(null);


    useEffect(()=>{
        const GetDiff = async()=>{
            const timestamp = subEns.expiryDate * 1000;
            
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
                    //onClick={() => router.push('/[ensName]', `/${ensDomains.name}`)} 
                    className={styles.name}
                >
                        <div className={styles.nameLeft}>
                            <div className={styles.nameLeftImg}>
                                <Image src={nameSVG} alt='' />
                            </div>
                            <div>
                                <p>{subEns.name}</p>
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
