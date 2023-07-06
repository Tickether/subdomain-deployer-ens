import styles from '@/styles/Search.module.css'
import axios from 'axios';
import { useRouter } from 'next/router'
//import Image from 'next/image'
//import logo from '@/public/SmokleyS.svg';
//import Link from 'next/link';
import { namehash, normalize } from 'viem/ens'
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';


export interface SearchResults{
  name: string,
}

export default function Search() {

    const [ensDomain, setEnsDomain] = useState<string>('');
    const [searchResults, setSearchResults] = useState([]);
    const [subEnsDomain, setSubEnsDomain] = useState<string>('');
    const [subEnsDomainHash, setSubEnsDomainHash] = useState<string>('0x0000000000000000000000000000000000000000000000000000000000000000');
    const [showSubEnsBox, setShowSubEnsBox] = useState<boolean>(false);
    const [showSuggestBox, setShowSuggestBox] = useState<boolean>(false);
    const [nodeActive, setNodeActive] = useState<boolean>(false);

    const router = useRouter()
    
    //0x0000000000000000000000000000000000000000000000000000000000000000
    //0x675fe646308c6c88296bc9eace94ce777d74bbb0a4eaa66641afa05e99436411
    useEffect(()=>{
      const handleEnsSearchFetch = async () => {
        if (ensDomain.length >= 1) {
          try {
            const query = `query {domains(where:{name_starts_with: "${ensDomain}"}, first:5){name}}`
            const response = await axios.post('https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli', {
              query
            });
            // Handle the response data here
            setShowSuggestBox(true)
            console.log(response.data);
            setSearchResults(response.data.data.domains)
          } catch (error) {
            console.error(error);
          }
        }
      }
      handleEnsSearchFetch()
    },[ensDomain])

    console.log(ensDomain)
    console.log(searchResults)
    console.log(subEnsDomainHash)
    console.log(nodeActive)
    



    const handleEnsSearchSelect = (selectedENS: string) => {
      setShowSubEnsBox(true);
      setShowSuggestBox(false);
      setEnsDomain(selectedENS);
    }

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


 


  return (
    <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div>
                <input
                    type="text"
                    placeholder="Search your favorite ENS Community"
                    value={ensDomain}
                    onChange={(e) => setEnsDomain(e.target.value)}
                />
                {/* Search Results */}
                {showSuggestBox && (
                  <div>
                      {searchResults.map((searchresults : SearchResults) => (
                      <div
                          key={searchresults.name}
                          onClick={() => handleEnsSearchSelect(searchresults.name)}
                      >
                          {searchresults.name}
                      </div>
                      ))}
                  </div>
                )}
                
                {showSubEnsBox && (
                    <div>
                        <input
                          type="text"
                          placeholder="Pick your communinty identyity"
                          value={subEnsDomain}
                          onChange={(e) => setSubEnsDomain(e.target.value)}
                        />
                        {
                          subEnsDomain.length >= 1
                          ? (
                            <div>
                              { 
                                nodeActive  
                                ? <div>already registered</div>
                                : (
                                  <div>
                                    <div>available to regiter</div>
                                    <button onClick={handleSubEnsSearchSelect}>Register SubDomain</button> 
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


