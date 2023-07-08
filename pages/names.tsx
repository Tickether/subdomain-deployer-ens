import styles from '@/styles/Names.module.css'
import axios from 'axios'
import Navbar from '@/components/navbar'
import { labelhash , fromHex} from 'viem'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
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
            let ensNames = [] //: ensNames
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

    

    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                <div className={styles.products}>
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
