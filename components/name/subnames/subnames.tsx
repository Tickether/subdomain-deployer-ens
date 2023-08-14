import styles from '@/styles/Subnames.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { namehash } from 'viem'
import { useAccount, useContractRead } from 'wagmi'
//import { SearchResult } from '../../searches/search'
import linkSVG from '@/public/assets/icons/link.svg'
import plus_whiteSVG from '@/public/assets/icons/plus-white.svg'
import Image from 'next/image'
import selectSVG from '@/public/assets/icons/select.svg'
import Subname from './subname'
import { ENS } from '@/pages/[ensName]'

export interface SubName{
  name: string,
  wrappedOwner: Owner,
  expiryDate: number,
}

export interface Owner{
  id: string,
}

interface ENSprop {
  ENS: ENS,
}

export default function Subnames({ENS} : ENSprop) {
    const {address, isConnected} = useAccount()

    const [owner, setOwner] = useState<string>('0x000000000000000000000000000000000000dead')
    const [nodeData, setNodeData] = useState<any>([])
    const [subsEns, setSubsEns] = useState([])
    const [openModal, setOpenModal] = useState<boolean>(false)

    // State for the current page number
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Number of items per page
    const itemsPerPage = 10;

    // Calculate the total number of pages based on the number of items and items per page
    const totalPages = Math.ceil(subsEns.length / itemsPerPage);

    // Slice the ensNames array to display only the items for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = subsEns.slice(startIndex, endIndex);


    useEffect(() => {
        if (address && typeof address === 'string') {
            setOwner((address))
        } 
      },[address])

       //node owner
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
    args: [(namehash(ENS.name))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (contractReadNodeData?.data! /*&& typeof contractReadNodeExpired.data === 'Array<string' */) {
      setNodeData(contractReadNodeData?.data!)
    }
  },[contractReadNodeData?.data!])
  console.log((contractReadNodeData?.data!))


  // Function to handle changing the page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  useEffect(()=>{
    const handleShowSubEns = async () => {
      if (ENS.name.length >= 1) {
        try {
          const query = `query {domains(where:{parent: "${namehash(ENS.name)}"}) { name expiryDate wrappedOwner{id} }}`
          const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
            query
          })
          console.log(response.data);
          setSubsEns(response.data.data.domains)
        } catch (error) {
          console.log(error);
        }
      }
    }
    handleShowSubEns()
  },[ENS])
  console.log(subsEns)

        
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.subnames}>
            <div className={styles.subnamesTop}>
                <div  className={styles.subnamesTopChild}>
                  <div className={styles.subnamesTopLeft}>
                    <div>
                      <p>Customize the payment options for subnames</p>
                    </div>
                    <div className={styles.subnamesTopLink}>
                      <p>Learn about subnames payment setup</p>
                      <Image src={linkSVG} alt='' />
                    </div>
                  </div>
                  <div className={styles.subnamesTopRight}>
                    <div /*onClick={}*/ className={styles.subnamesTopRightReserve}>
                      <p>Reserve Subname</p>
                      <Image src={plus_whiteSVG} alt='' />
                    </div>
                  </div>
                </div>
            </div>
            <div className={styles.subnamesDown}>
              <div className={styles.subnamesDownChild}>
              <div className={styles.subnamesDownSelection}>
                  <div className={styles.subnamesDownSort}>
                      <Image src={selectSVG} alt='' />
                  </div>
                  <div className={styles.subnamesDownSearch}></div>
              </div>
              <hr />
              {/* Render the list of ENS names based on the currentItems array */}
              {currentItems.map((subEns : SubName) => (
                <div className={styles.subnamesList} key={subEns.name}>
                    <div>
                      <Subname subEns={subEns}/>
                    </div>
                    <hr />
                </div>
              ))}
              <div className={styles.subnamesDownNav}>
                <div>
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
