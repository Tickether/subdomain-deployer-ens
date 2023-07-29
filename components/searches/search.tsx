import styles from '@/styles/Search.module.css'
import axios from 'axios'
import { useRouter } from 'next/router'
import clearSVG from '@/public/assets/icons/clear.svg'
import Image from 'next/image';
//import Link from 'next/link'
import { namehash, normalize } from 'viem/ens'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import SearchResult from './searchResult'


export interface SearchResult{
  name: string,
  owner: Owner,
  wrappedOwner: Owner,
}

export interface Owner{
  id: string,
}




export default function Search() {

    const router = useRouter()

    const [ensDomain, setEnsDomain] = useState<string>('');
    const [ensSearch, setEnsSearch] = useState<string>('');
    
    const [searchResults, setSearchResults] = useState([]);
    //
    const [subEnsDomain, setSubEnsDomain] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [subEnsDomainHash, setSubEnsDomainHash] = useState<string>('0x0000000000000000000000000000000000000000000000000000000000000000');
    const [showSubEnsBox, setShowSubEnsBox] = useState<boolean>(false);
    const [showSuggestBox, setShowSuggestBox] = useState<boolean>(false);
    const [nodeActive, setNodeActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    
    
    //0x0000000000000000000000000000000000000000000000000000000000000000
    //0x675fe646308c6c88296bc9eace94ce777d74bbb0a4eaa66641afa05e99436411
    useEffect(()=>{
      const handleEnsSearchFetch = async () => {
        if (ensSearch.length >= 1) {
          setLoading(true)
          try {
            const query = `query {domains(where:{name_starts_with: "${ensSearch}", parent: "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"}, first:3){name owner{id} wrappedOwner{id}}}`
            const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
              query
            })
            // Handle the response data here
            setShowSuggestBox(true)
            console.log(response.data);
            setSearchResults(response.data.data.domains)
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (error) {
            console.error(error);
          }
        }
      }
      handleEnsSearchFetch()
    },[ensSearch])

    console.log(ensDomain)
    console.log(searchResults)
    console.log(subEnsDomainHash)
    console.log(nodeActive)
    

    useEffect(()=>{
      const handleSubEnsSearch = async() => {
        // Handle the search logic for the second search box
        // hash (string + . + ensdomain) and query is avaible with wagmi
        setSubEnsDomain(subEnsDomain);
        if (subEnsDomain.length >= 1) {
          try {
            const subENS = subEnsDomain + '.' + ensDomain
            setSubEnsDomainHash(namehash(subENS))
          } catch (error) {
            console.log(error) 
          }
        }
      };
      handleSubEnsSearch()
    },[subEnsDomain])
    
  const handleSubEnsSearchSelect = () => {
    const subENS = subEnsDomain + '.' + ensDomain
    
    router.push('/register/[subENS]', `/register/${subENS}`);
  }

    
  console.log(namehash('geeloko.eth'))
      

  const contractReadActiveNode = useContractRead({
    address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    abi: [
        {
            name: 'recordExists',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'recordExists',
    args: [subEnsDomainHash],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    if (typeof contractReadActiveNode.data === 'boolean' ) {
      setNodeActive(contractReadActiveNode?.data!)
    }
  },[contractReadActiveNode?.data!])
  console.log(contractReadActiveNode?.data!)


  const handleSetShowSubEnsBox = (showSubEnsBox: boolean) => {
    // Do something with the state received from the SearchResult component
    // For example, update a state variable in the Search component
    
    setShowSubEnsBox(showSubEnsBox);
  };
  const handleSetShowSuggestBox = (showSuggestBox: boolean) => {
    // Do something with the state received from the SearchResult component
    // For example, update a state variable in the Search component
    
    setShowSuggestBox(showSuggestBox);
  };
  const handleSetSelectENS = (ENS: string) => {
    // Do something with the state received from the SearchResult component
    // For example, update a state variable in the Search component
    
    setEnsDomain(ENS);
  };

  const handleClearInput = () => {
    setEnsSearch('')
    setEnsDomain('')
    handleFocus()
  };

  
  const handleFocus = () => {
    setShowSubEnsBox(false);
    setSubEnsDomain('')
  };

  return (
    <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div className={styles.search}>
                <div className={styles.searchENS}>
                  <input
                      type="text"
                      placeholder="Search an ENS"
                      onFocus={handleFocus}
                      value={(ensDomain)}
                      onChange={(e) => {
                        setEnsDomain((e.target.value))
                        setEnsSearch((e.target.value))
                      }}
                  />
                  {
                    ensSearch.length >= 1 && (
                      <div onClick={handleClearInput} className={styles.clear}>
                        <Image  src={clearSVG} alt='' />
                      </div>
                    )
                  }
                </div>
                {/* Search Results */}
                {showSuggestBox && ensSearch.length >= 1 && (
                  <div className={styles.searchResults}>
                      {searchResults.map((searchresult : SearchResult) => (
                      <div
                        className={styles.searchResultItem}
                        key={searchresult.name}
                      >
                        <SearchResult 
                          searchresult={searchresult}
                          subEnsBox={handleSetShowSubEnsBox}
                          suggestBox={handleSetShowSuggestBox}
                          ens={handleSetSelectENS}
                          key={searchresult.name}
                          loading={loading}
                        />
                      </div>
                      ))}
                  </div>
                )}
                
                {showSubEnsBox && (
                    <div className={styles.searchSubdomain}>
                        <input
                          type="text"
                          placeholder="Pick your communinty identyity"
                          value={(subEnsDomain)}
                          onChange={(e) => {
                            try {
                              (e.target.value.length >= 1)
                              ? setSubEnsDomain(normalize(e.target.value))
                              : setSubEnsDomain((e.target.value))
                            } catch (error : any) {
                              console.log(error.message)
                              setErrorMsg(error.message)
                              setTimeout(() => {
                                setErrorMsg(''); // Clear error state after 3 seconds
                              }, 3666);
                            }
                          }}
                        />
                        {
                          errorMsg.length >=1 && (
                            <div className={styles.errorMsg}>{errorMsg}</div>
                          )
                        }
                        {
                          subEnsDomain.length >= 1
                          ? (
                            <div className={styles.subDomainResult}>
                              { 
                                nodeActive  
                                ? <div>already registered</div>
                                : (
                                  <div>
                                    <div>available to regiter</div>
                                    <button className={styles.register} onClick={handleSubEnsSearchSelect}>Register SubDomain</button> 
                                  </div>
                                )
                              }
                            </div>
                          )
                          : null
                        }              
                        {/* Display subdomain search results */}
                        {/* Add code to display the subdomain search results */}
                    </div>
                    
                )}
                </div>
            </div>
        </div>
    </>
  )
}


