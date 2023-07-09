import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { namehash } from 'viem'
import { useAccount, useContractRead } from 'wagmi'
import { SearchResult } from './search'

interface SearchResultProps {
    searchresult: SearchResult,
    //canSubdomain : (canSub : boolean) => void;
    subEnsBox : (showSubEnsBox : boolean) => void;
    suggestBox : (showSuggestBox : boolean) => void;
    ens : (ENS : string) => void;
}



export default function SearchResult({searchresult, /*canSubdomain,*/ subEnsBox, suggestBox, ens} : SearchResultProps) {

    const {address, isConnected} = useAccount()

    //const [prices, setPrices] = useState<any[]>([[BigInt(0), BigInt(0), BigInt(0)]])
    const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
    const [approved, setApproved] = useState<boolean>(false)
    const [wrapped, setWrapped] = useState<boolean>(false)

console.log(searchresult.name)
    
    // check wrapped
    const contractReadWrapped = useContractRead({
        address: "0x114D4603199df73e7D157787f8778E21fCd13066",
        abi: [
            {
                name: 'isWrapped',
                inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'isWrapped',
        args: [(namehash(searchresult.name))],
        watch: true,
        chainId: 5,
    })  
    console.log(contractReadWrapped.data)
      
    useEffect(() => {
        if (contractReadWrapped?.data! && typeof contractReadWrapped.data === 'boolean') {
            setWrapped((contractReadWrapped?.data!))
        }
    },[contractReadWrapped?.data!])
    
    // check approved
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
    // check setBase/ParentNodeActive
    const contractReadActiveParentNode = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
        {
            name: 'parentNodeActive',
            inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: 'view',
            type: 'function',
        },    
        ],
        functionName: 'parentNodeActive',
        args: [(namehash(searchresult.name))],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadActiveParentNode?.data! && typeof contractReadActiveParentNode.data === 'boolean' ) {
            setActiveParentNode((contractReadActiveParentNode?.data!))
        }
    },[contractReadActiveParentNode?.data!])
    // prices not zero
    /*
    const contractReadThreeUpLetterFee = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
            {
                name: 'threeUpLetterFee',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'threeUpLetterFee',
        args: [(namehash(searchresult.name))],
        chainId: 5,
        watch: true,
    })
    const contractReadFourFiveLetterFee = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
            {
                name: 'fourFiveLetterFee',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'fourFiveLetterFee',
        args: [(namehash(searchresult.name))],
        chainId: 5,
        watch: true,
    })
    const contractReadSixDownLetterFee = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
            {
                name: 'sixDownLetterFee',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'sixDownLetterFee',
        args: [(namehash(searchresult.name))],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        let prices_ = []
        if (contractReadThreeUpLetterFee?.data! && typeof contractReadThreeUpLetterFee.data === 'bigint' ) {
        prices_.push(contractReadThreeUpLetterFee?.data!)
        }
        if (contractReadFourFiveLetterFee?.data! && typeof contractReadFourFiveLetterFee.data === 'bigint' ) {
        prices_.push(contractReadFourFiveLetterFee?.data!)
        }
        if (contractReadSixDownLetterFee?.data! && typeof contractReadSixDownLetterFee.data === 'bigint' ) {
        prices_.push(contractReadSixDownLetterFee?.data!)
        }
        setPrices(prices_)
    },[contractReadThreeUpLetterFee?.data!, contractReadFourFiveLetterFee?.data!, contractReadSixDownLetterFee?.data!])
    console.log(contractReadThreeUpLetterFee?.data!, contractReadFourFiveLetterFee?.data!, contractReadSixDownLetterFee?.data!)
    */
    
    

    
    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div 
                className={styles.searchResults}
                onClick={() => {
                    if (wrapped && approved && activeParentNode) {
                        subEnsBox(true);
                        suggestBox(false);
                        ens(searchresult.name);
                      }
                }}
            >
                <p>{searchresult.name}</p>
                {
                    wrapped && approved && activeParentNode
                    ?   <span>can sub</span>
                    :   <span>cannot sub</span>
                }
            </div>
            </div>
        </div>

        </>
    )
}
