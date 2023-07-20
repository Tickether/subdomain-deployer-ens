import styles from '@/styles/Names.module.css'
import axios from 'axios'
import { labelhash , fromHex} from 'viem'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Name from '@/components/names/name'

console.log(labelhash('geeloko'))
console.log(fromHex(labelhash('buju'), 'bigint'))
// 420
export interface ensNames{
    name: string,
    wrapped: boolean,
    expiry: number,
    parent: Parent 
}

export interface Parent{
    expiry : number
}

export default function Names() {

    
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
        let ensNames: any = []
        const handleEnsOwnedFetch = async ()=>{
            
            try {
                const query = `query { domains(where:{owner: "${address!.toLowerCase()}"}){name expiryDate parent{expiryDate}} wrappedDomains(where: {owner:"${address!.toLowerCase()}"}){name expiryDate domain {parent {expiryDate}}} }`
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
                            wrapped: false,
                            expiry: nw[i].expiryDate,
                            parent : nw[i].parent.expiryDate === null ? 16571273 : nw[i].parent.expiryDate


                        }) 
                    }
                }
                for (let i = 0; i < wr.length; i++) {
                    ensNames.push({
                        name: wr[i].name,
                        wrapped: true,
                        expiry: wr[i].expiryDate,
                        parent : wr[i].domain.parent.expiryDate === null ? 0 : wr[i].domain.parent.expiryDate
                    })
                }
                setEnsDomains(ensNames)
            } catch (error) {
                console.error(error)
            }        
        }
        handleEnsOwnedFetch()
    },[address])

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

    const waitForApproval = useWaitForTransaction({
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
                            
                            key={ensDomains.name}
                        >
                            <Name
                                ensDomains={ensDomains}
                            /> 
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
