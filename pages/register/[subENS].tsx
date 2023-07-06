import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { namehash } from 'viem/ens'
import { useContractRead } from 'wagmi';
import { fromHex } from 'viem'




export default function Register() {
    const router = useRouter();
    const { subENS } = router.query;
    const subENStoString = subENS!.toString();

    console.log(subENStoString)
    //use sub ens to get root node
    // check node price
    // check node expires


    const dotIndex = subENStoString!.indexOf("."); 
    const subLabel = subENStoString!.substring(0, dotIndex); // Extract the substring before the dot
    const rootENS = subENStoString!.substring(dotIndex + 1); // Extract the substring after the dot
    const rootNodeENS = namehash(rootENS);//

    console.log(subLabel)
    console.log(rootENS)
    console.log(rootNodeENS)
    console.log(fromHex(rootNodeENS, 'bigint'))
    
    const contractReadNodeExpired = useContractRead({
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
        if (typeof contractReadNodeExpired.data === 'boolean' ) {
          //setNodeActive(contractReadActiveNode?.data!)
        }
      },[contractReadNodeExpired?.data!])
      console.log(contractReadNodeExpired?.data!)
    
    
    
      useEffect(()=>{

    },[])
    return (
        <>
        <Navbar/>
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <p>llll</p>
            </div>
        </div>

        </>
    )
}
