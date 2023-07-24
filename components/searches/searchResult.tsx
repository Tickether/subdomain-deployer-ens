import styles from '@/styles/SearchResults.module.css'
import { useEffect, useState } from 'react'
import { namehash } from 'viem'
import { useAccount, useContractRead, useContractReads } from 'wagmi'
import { SearchResult } from './search'
import { motion } from 'framer-motion'
import loadingSVG from '@/public/assets/icons/loading.png'
import Image from 'next/image';


interface SearchResultProps {
    searchresult: SearchResult,
    //canSubdomain : (canSub : boolean) => void;
    subEnsBox : (showSubEnsBox : boolean) => void;
    suggestBox : (showSuggestBox : boolean) => void;
    ens : (ENS : string) => void;
    loading : boolean
}


export interface Validator {
    Wrapped: boolean,
    Approved: boolean,
    ActiveNode: boolean,
    CanSubENS: boolean,
    Erc20Approved: boolean,
    Erc20ActiveNode: boolean,
    Erc20CanSubENS: boolean,
    WLApproved:boolean,
    WLActiveNode:boolean,
    WLCanSubENS: boolean,
    Erc20WLApproved: boolean,
    Erc20WLActiveNode: boolean,
    Erc20WLCanSubENS: boolean,
}


export default function SearchResult({searchresult, /*canSubdomain,*/ subEnsBox, suggestBox, ens, loading} : SearchResultProps) {

    const {address, isConnected} = useAccount()

    //const [prices, setPrices] = useState<any[]>([[BigInt(0), BigInt(0), BigInt(0)]])
    const [owner, setOwner] = useState<string>('0x0000000000000000000000000000000000000000');
    //const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
    //const [approved, setApproved] = useState<boolean>(false)
    //const [wrapped, setWrapped] = useState<boolean>(false)
    //const [loading, setLoading] = useState<boolean>(false)


    const validatorDefault = {
        Wrapped: false,
        Approved: false,
        ActiveNode: false,
        CanSubENS: false,
        Erc20Approved: false,
        Erc20ActiveNode: false,
        Erc20CanSubENS: false,
        WLApproved:false,
        WLActiveNode:false,
        WLCanSubENS: false,
        Erc20WLApproved: false,
        Erc20WLActiveNode: false,
        Erc20WLCanSubENS: false,
    };
    const [validators, setValidators] = useState<Validator>(validatorDefault)

    console.log(searchresult.name)
    console.log(loading)
    
    // check wrapped
    /*
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
    */
    // check approved // must replace address with own ofer ens in search
    
    /*
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
        args: [(owner!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
        watch: true,
        chainId: 5,
    })  
    console.log(contractReadApproved.data)
      
    useEffect(() => {
        if (contractReadApproved?.data! && typeof contractReadApproved.data === 'boolean') {
            setApproved((contractReadApproved?.data!))
        }
    },[contractReadApproved?.data!])
    */
    // check setBase/ParentNodeActive
    /*
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
    */
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
    
    useEffect(()=>{
        if (validators!.Wrapped) {
            setOwner(searchresult.wrappedOwner.id)
        } else {
            setOwner(searchresult.owner.id)
        }
    },[validators!.Wrapped])

    const { data, isLoading } = useContractReads({
        contracts: [
            //contract 0 check if name is wrapped on nameWrapper
            {
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
                chainId: 5,
            },
            //contract 1a check if SubENS contract is approved on nameWrapper
            {
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
                args: [(owner!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
                chainId: 5,
            },
            //contract 1b check if name is enabled on SubENS contract
            {
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
            },
            //contract 1c check if CanSub name is enabled on SubENS contract
            {
                address: "0x229C0715e70741F854C299913C2446eb4400e76C",
                abi: [
                    {
                        name: 'parentNodeCanSubActive',
                        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
                        outputs: [{ internalType: "bool", name: "", type: "bool" }],
                        stateMutability: 'view',
                        type: 'function',
                    },    
                ],
                functionName: 'parentNodeCanSubActive',
                args: [(namehash(searchresult.name))],
                chainId: 5,
            },
            //contract 2a check if SubENSERC20 contract is approved on nameWrapper
            {
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
                args: [(owner!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
                chainId: 5,
            },
            //contract 2b check if name is enabled on SubENSERC20 contract
            {
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
            },
            //contract 2c check if CanSub name is enabled on SubENSERC20 contract
            {
                address: "0x229C0715e70741F854C299913C2446eb4400e76C",
                abi: [
                    {
                        name: 'parentNodeCanSubActive',
                        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
                        outputs: [{ internalType: "bool", name: "", type: "bool" }],
                        stateMutability: 'view',
                        type: 'function',
                    },    
                ],
                functionName: 'parentNodeCanSubActive',
                args: [(namehash(searchresult.name))],
                chainId: 5,
            },
            //contract 3a check if SubENSWL contract is approved on nameWrapper
            {
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
                args: [(owner!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
                chainId: 5,
            },
            //contract 3b check if name is enabled on SubENSWL contract
            {
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
            },
            //contract 3c check if CanSub name is enabled on SubENSWL contract
            {
                address: "0x229C0715e70741F854C299913C2446eb4400e76C",
                abi: [
                    {
                        name: 'parentNodeCanSubActive',
                        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
                        outputs: [{ internalType: "bool", name: "", type: "bool" }],
                        stateMutability: 'view',
                        type: 'function',
                    },    
                ],
                functionName: 'parentNodeCanSubActive',
                args: [(namehash(searchresult.name))],
                chainId: 5,
            },
            //contract 4a check if SubENSERC20WL contract is approved on nameWrapper
            {
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
                args: [(owner!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
                chainId: 5,
            },
            //contract 4b check if name is enabled on SubENSERC20WL contract
            {
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
            },
            //contract 4c check if CanSub name is enabled on SubENSERC20WL contract
            {
                address: "0x229C0715e70741F854C299913C2446eb4400e76C",
                abi: [
                    {
                        name: 'parentNodeCanSubActive',
                        inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
                        outputs: [{ internalType: "bool", name: "", type: "bool" }],
                        stateMutability: 'view',
                        type: 'function',
                    },    
                ],
                functionName: 'parentNodeCanSubActive',
                args: [(namehash(searchresult.name))],
                chainId: 5,
            },
            
        ],
        watch: true,
    })  
    console.log(data)
    useEffect(() => {
        //let dataRes : Validaters[] = [] 
        if (data! /*&& typeof data === 'boolean'*/) {

            // Extract the results from the data array
            const [isWrapped, isApproved, isNodeActive, isCanSubENS, isERC20Approved, isERC20NodeActive, isErc20CanSubENS, isWLApproved, isWLNodeActive, isWLCanSubENS, isERC20WLApproved, isERC20WLNodeActive, isErc20WLCanSubENS] = data.map(item => item.result as boolean);

            // Create a new Validator object using the extracted data
            const validatorData: Validator = {
                Wrapped: isWrapped,
                Approved: isApproved,
                ActiveNode: isNodeActive,
                CanSubENS: isCanSubENS,
                Erc20Approved: isERC20Approved,
                Erc20ActiveNode: isERC20NodeActive,
                Erc20CanSubENS: isErc20CanSubENS,
                WLApproved: isWLApproved,
                WLActiveNode: isWLNodeActive,
                WLCanSubENS: isWLCanSubENS,
                Erc20WLApproved: isERC20WLApproved,
                Erc20WLActiveNode: isERC20WLNodeActive,
                Erc20WLCanSubENS: isErc20WLCanSubENS,
            };

            /*
            const validatorData : Validator = {
                wrapped: data[0].result,
                approved: data[1].result,
                activeNode: data[2].result,
                erc20Approved: data[3].result,
                erc20ActiveNode: data[4].result,
                wLApproved:data[5].result,
                wLActiveNode:data[6].result,
                erc20WLApproved: data[7].result,
                erc20WLActiveNode: data[8].result,
            }
            */
            //dataRes.wrapped = data[0].result
            setValidators(validatorData)
        }
    },[data!])
    console.log(validators)

    
    
    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div 
                className={styles.searchResults}
                onClick={() => {
                    if (validators!.Wrapped && validators!.Approved && validators!.ActiveNode || validators!.Wrapped && validators!.Erc20Approved && validators!.Erc20ActiveNode || validators!.Wrapped && validators!.WLApproved && validators!.WLActiveNode || validators!.Wrapped && validators!.Erc20WLApproved && validators!.Erc20WLActiveNode /*wrapped && approved && activeParentNode*/) {
                        subEnsBox(true);
                        suggestBox(false);
                        ens(searchresult.name);
                      }
                }}
            >
                <div 
                    title={searchresult.name}
                    className={styles.searchResultsText}
                >
                    {searchresult.name}
                </div>
                {
                    loading
                    ? (
                        <>
                            <motion.div
                                initial={{ rotate: 0 }} // Initial rotation value (0 degrees)
                                animate={{ rotate: 360 }} // Final rotation value (360 degrees)
                                transition={{
                                    duration: 1, // Animation duration in seconds
                                    repeat: Infinity, // Infinity will make it rotate indefinitely
                                    ease: "linear", // Animation easing function (linear makes it constant speed)
                                }}
                            >
                                <Image className={styles.spinner} src={loadingSVG} alt='' />
                            </motion.div>
                        </>
                    )
                    : (
                        validators!.Wrapped && validators!.Approved && validators!.ActiveNode || validators!.Wrapped && validators!.Erc20Approved && validators!.Erc20ActiveNode || validators!.Wrapped && validators!.WLApproved && validators!.WLActiveNode || validators!.Wrapped && validators!.Erc20WLApproved && validators!.Erc20WLActiveNode  //wrapped && approved && activeParentNode // 
                        ?   (
                            <div
                                style={{
                                    backgroundColor: '#F0F6FF',
                                    padding: '5px 10px', 
                                    borderRadius: '15px',
                                    display: 'flex',
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={{

                                        color: '#008000',
                                        fontSize: '12px',
                                        
                                    }}
                                >Available</span>
                            </div>
                        )
                        :   (
                            <div 
                                style={{
                                    backgroundColor: '#F0F6FF',
                                    padding: '5px 10px', 
                                    borderRadius: '15px',
                                    display: 'flex',
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                }}
                            >  
                                <span
                                    style={{
                                        
                                        color: 'red',
                                        fontSize: '12px',
                        
                                    }}
                                >Unavailable</span>
                            </div> 
                        )
                    )
                }
            </div>
            </div>
        </div>
        </>
    )
}
