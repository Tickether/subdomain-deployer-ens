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
    FuseBurned: boolean,
    Approved: boolean,
    ActiveNode: boolean,
    Erc20Approved: boolean,
    Erc20ActiveNode: boolean,
    WLApproved:boolean,
    WLActiveNode:boolean,
    Erc20WLApproved: boolean,
    Erc20WLActiveNode: boolean,
}


export default function SearchResult({searchresult, /*canSubdomain,*/ subEnsBox, suggestBox, ens, loading} : SearchResultProps) {

    const {address, isConnected} = useAccount()

    //const [prices, setPrices] = useState<any[]>([[BigInt(0), BigInt(0), BigInt(0)]])
    const [owner, setOwner] = useState<string>('0x000000000000000000000000000000000000dead');
    //const [activeParentNode, setActiveParentNode] = useState<boolean>(false)
    //const [approved, setApproved] = useState<boolean>(false)
    //const [wrapped, setWrapped] = useState<boolean>(false)
    //const [loading, setLoading] = useState<boolean>(false)


    const validatorDefault = {
        Wrapped: false,
        FuseBurned: false,
        Approved: false,
        ActiveNode: false,
        Erc20Approved: false,
        Erc20ActiveNode: false,
        WLApproved:false,
        WLActiveNode:false,
        Erc20WLApproved: false,
        Erc20WLActiveNode: false,
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
            //contract 0a check if name is wrapped on nameWrapper
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
            
            //contract 0b check if fuse burned enabled on SubENS contract
            {
                address: "0x114D4603199df73e7D157787f8778E21fCd13066",
                abi: [
                    {
                        name: 'allFusesBurned',
                        inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "uint32", name: "fuseMask", type: "uint32" }],
                        outputs: [{ internalType: "bool", name: "", type: "bool" }],
                        stateMutability: 'view',
                        type: 'function',
                    },    
                ],
                functionName: 'allFusesBurned',
                args: [(namehash(searchresult.name)), (1)],
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
                args: [(owner!), ('0x4Ec5C1381c9B049F9A737843cDFE12D761947Bc2')],
                chainId: 5,
            },
            //contract 1b check if name is enabled on SubENS contract
            {
                address: "0x4Ec5C1381c9B049F9A737843cDFE12D761947Bc2",
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
                args: [(owner!), ('0xB783560a30273cBCc94476f7375225d803eC12a9')],
                chainId: 5,
            },
            //contract 2b check if name is enabled on SubENSERC20 contract
            {
                address: "0xB783560a30273cBCc94476f7375225d803eC12a9",
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
                args: [(owner!), ('0x089052090493F92fDA947Bc9362d439f2EF979E2')],
                chainId: 5,
            },
            //contract 3b check if name is enabled on SubENSWL contract
            {
                address: "0x089052090493F92fDA947Bc9362d439f2EF979E2",
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
                args: [(owner!), ('0x87456C9B38905b130ace3c5a0c83d05972e50bbC')],
                chainId: 5,
            },
            //contract 4b check if name is enabled on SubENSERC20WL contract
            {
                address: "0x87456C9B38905b130ace3c5a0c83d05972e50bbC",
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
        ],
        watch: true,
    })  
    console.log(data)
    useEffect(() => {
        //let dataRes : Validaters[] = [] 
        if (data! /*&& typeof data === 'boolean'*/) {

            // Extract the results from the data array
            const [isWrapped, isFuseBurned, isApproved, isNodeActive, isERC20Approved, isERC20NodeActive, isWLApproved, isWLNodeActive, isERC20WLApproved, isERC20WLNodeActive] = data.map(item => item.result as boolean);

            // Create a new Validator object using the extracted data
            const validatorData: Validator = {
                Wrapped: isWrapped,
                FuseBurned: isFuseBurned,
                Approved: isApproved,
                ActiveNode: isNodeActive,
                Erc20Approved: isERC20Approved,
                Erc20ActiveNode: isERC20NodeActive,
                WLApproved: isWLApproved,
                WLActiveNode: isWLNodeActive,
                Erc20WLApproved: isERC20WLApproved,
                Erc20WLActiveNode: isERC20WLNodeActive,
            };

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
                    if (validators!.Wrapped && validators!.FuseBurned && validators!.Approved && validators!.ActiveNode || validators!.Wrapped && validators!.FuseBurned && validators!.Erc20Approved && validators!.Erc20ActiveNode || validators!.Wrapped &&  validators!.FuseBurned && validators!.WLApproved && validators!.WLActiveNode || validators!.Wrapped && validators!.FuseBurned && validators!.Erc20WLApproved && validators!.Erc20WLActiveNode) {
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
                    loading || isLoading
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
                        validators!.Wrapped && validators!.FuseBurned && validators!.Approved && validators!.ActiveNode || validators!.Wrapped && validators!.FuseBurned && validators!.Erc20Approved && validators!.Erc20ActiveNode || validators!.Wrapped &&  validators!.FuseBurned && validators!.WLApproved && validators!.WLActiveNode || validators!.Wrapped && validators!.FuseBurned && validators!.Erc20WLApproved && validators!.Erc20WLActiveNode  //wrapped && approved && activeParentNode // 
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
                                        
                                        color: '#BF5345',
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
