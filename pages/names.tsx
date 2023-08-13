import styles from '@/styles/Names.module.css'
import axios from 'axios'
import { labelhash , fromHex} from 'viem'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Name from '@/components/names/name'
import selectSVG from '@/public/assets/icons/select.svg'
import Image from 'next/image'

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
    const [connected, setConnected] = useState<boolean>(false)
    // State for the current page number
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Number of items per page
    const itemsPerPage = 10;

    // Calculate the total number of pages based on the number of items and items per page
    const totalPages = Math.ceil(ensDomains.length / itemsPerPage);

    // Slice the ensNames array to display only the items for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = ensDomains.slice(startIndex, endIndex);

    // Function to handle changing the page
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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

    


    return (
        <>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.names}>
                        <div className={styles.namesTop}>
                            <div className={styles.namesTopChildren}>
                                <p>Names</p>
                            </div>
                        </div>
                        <div className={styles.namesDown}>
                            <div className={styles.namesDownChildren}>
                                <div className={styles.namesSelection}>
                                    <div className={styles.namesSelectionChild}>
                                        <div className={styles.namesSort}>
                                            <Image src={selectSVG} alt='' />
                                        </div>
                                        <div className={styles.namesSearch}></div>
                                    </div>
                                </div>
                                <hr />
                                {/* Render the list of ENS names based on the currentItems array */}
                                {currentItems.map((ensDomain: ensNames) => (
                                <div className={styles.namesListHover}>
                                    <div className={styles.namesList} key={ensDomain.name}>
                                        <Name ensDomains={ensDomain} />
                                        <hr />
                                    </div>
                                </div>
                                ))}
                                <div className={styles.namesNav}>
                                    <div className={styles.namesNavChild}>
                                        {/* Add pagination buttons to navigate between pages */}
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            disabled={currentPage === pageNumber}
                                        >
                                            {pageNumber}
                                        </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}