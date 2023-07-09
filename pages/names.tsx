import styles from '@/styles/Names.module.css'
import axios from 'axios'
import Navbar from '@/components/navbar'
import { labelhash , fromHex} from 'viem'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useRouter } from 'next/router'

console.log(labelhash('geeloko'))
console.log(fromHex(labelhash('buju'), 'bigint'))
// 420
export interface ensNames{
    name: string,
    wrapped: boolean,
}

export default function Names() {

    const router = useRouter()
    const {address, isConnected} = useAccount()

    const [ensDomains, setEnsDomains] = useState<ensNames[]>([])
    const [approved, setApproved] = useState<boolean>(false)
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])

    
    useEffect(()=>{
        const handleEnsOwnedFetch = async ()=>{
            let ensNames = []
            try {
                const query = `query { domains(where:{owner: "${address!.toLowerCase()}"}){name} wrappedDomains(where: {owner:"0xf7b083022560c6b7fd0a758a5a1edd47ea87c2bc"}){name} }`
                const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
                query
                })
                console.log(response.data)
                const nw = response.data.data.domains
                const wr = response.data.data.wrappedDomains

                for (let i = 0; i < nw.length; i++) {
                    if (!nw[i].name.includes('addr.reverse')) {
                        ensNames.push({
                            name: nw[i].name,
                            wrapped: false
                        }) 
                    }
                }
                for (let i = 0; i < wr.length; i++) {
                    ensNames.push({
                        name: wr[i].name,
                        wrapped: true
                    })
                }
                setEnsDomains(ensNames)
            } catch (error) {
                console.error(error)
            }        
        }
        handleEnsOwnedFetch()
    })

    console.log(ensDomains)


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

    const waitForTransaction = useWaitForTransaction({
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


    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                <div className={styles.names}>
                    {
                        approved
                        ? <button> Approved </button>
                        : <button onClick={handleApproval}> Approve</button>
                    }
                    
                    
                        {ensDomains.map(( ensDomains: ensNames) =>(
                        <div 
                            onClick={() => {
                                router.push('/[subENS]', `/${ensDomains.name}`)
                            }} 
                            key={ensDomains.name}
                        >
                            <p>{ensDomains.name}</p>
                            <span>wrapped</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
