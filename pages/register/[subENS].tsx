import styles from '@/styles/Register.module.css'
import { useEffect, useState } from 'react'
import { namehash } from 'viem/ens'
import { useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { formatEther, fromHex } from 'viem'
import Ether from '@/components/register/ether'
import { Validator } from '@/components/searches/searchResult'
import Erc20WL from '@/components/register/erc20WL'
import EtherWL from '@/components/register/etherWL'
import Erc20 from '@/components/register/erc20'



export default function Register() {

    const {address, isConnected} = useAccount()
    const [ subENS, setSubENS ] = useState<string>('')
    const [nodeData, setNodeData] = useState<any>([])
    //const [yearsLeft, setYearsLeft] = useState<number>(0)
    //const [subsYears, setSubsYears] = useState<number>(1)
    //const [subNodeFee, setSubNodeFee] = useState<bigint>(BigInt(0))
    //const [connected, setConnected] = useState<boolean>(false)
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
    
/*
    useEffect(() => {
        if (isConnected && typeof isConnected === 'boolean') {
            setConnected((true))
        } if (!isConnected && typeof isConnected === 'boolean') {
            setConnected((false))
        }
    },[isConnected])
*/
    
    useEffect(()=>{
        setSubENS(window.location.pathname.split('/')[2])
    },[])

    useEffect(()=>{
        //conditions for reload - browser re-entry
        if (rootENS === 'eth') {
            //set some true
        }
        else if (address! === nodeData[0]) {
            //set some true
        } 
        else if (namehash(subENS)) {
            //set some true
        }   
    },[])
    
    
    //use sub ens to get root node
    const subENStoString = subENS!.toString()
    console.log(subENStoString)
    const dotIndex = subENStoString!.indexOf(".") 
    const subLabel = subENStoString!.substring(0, dotIndex) // Extract the substring before the dot
    const rootENS = subENStoString!.substring(dotIndex + 1) // Extract the substring after the dot
    const rootNodeENS = namehash(rootENS)//

    //console.log(subLabel)
    //console.log(rootENS)
    //console.log(rootNodeENS)
    //console.log(fromHex(rootNodeENS, 'bigint'))
    

    // check node data
    
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
        args: [fromHex(rootNodeENS, 'bigint')],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadNodeData?.data!) {
            setNodeData(contractReadNodeData?.data!)
        }
    },[contractReadNodeData?.data!])
    console.log((contractReadNodeData?.data!))
    /*
    
    
    
    useEffect(()=>{
        let timeNow
        let timeLeft
        const year = 31556926000
        if (nodeData.length > 0) {
            const nodeExpiry = Number(nodeData[2]) * 1000
            timeNow = Date.now()
            timeLeft = nodeExpiry - timeNow
            setYearsLeft( (Math.floor(timeLeft / year) - 1) ) // till sync
        }
    },[nodeData])

    console.log(yearsLeft)

    const handleDecrement = () => {
        if (subsYears <= 1) return
        setSubsYears(subsYears - 1 );
    };
    
    const handleIncrement = () => {
        if (subsYears >= yearsLeft ) return
        setSubsYears(subsYears + 1)
    };


    
    // check node price
    const contractReadSubNodeFee = useContractRead({
        address: "0x229C0715e70741F854C299913C2446eb4400e76C",
        abi: [
            {
                name: 'getLetterFees',
                inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, { internalType: "string", name: "label", type: "string" }, { internalType: "uint256", name: "duration", type: "uint256" }],
                outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                stateMutability: 'view',
                type: 'function',
            },    
        ],
        functionName: 'getLetterFees',
        args: [(rootNodeENS), (subLabel), (subsYears)],
        chainId: 5,
        watch: true,
    })
    useEffect(() => {
        if (contractReadSubNodeFee?.data! && typeof contractReadSubNodeFee.data === 'bigint' ) {
          setSubNodeFee(contractReadSubNodeFee?.data!)
        }
    },[contractReadSubNodeFee?.data!])
    console.log((contractReadSubNodeFee?.data!))

    const { config } = usePrepareContractWrite({
        address: '0x229C0715e70741F854C299913C2446eb4400e76C',
        abi: [
            {
              name: 'setSubDomain',
              inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "string", name: "subNodeLabel", type: "string"}, {internalType: "address", name: "owner", type: "address"}, {internalType: "uint256", name: "duration", type: "uint256" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: 'setSubDomain',
        args: [ (rootNodeENS), (subLabel), (address!), (subsYears) ],
        value: subNodeFee,
        chainId: 5,
     })
    const contractWriteSubdomain = useContractWrite(config)

    const waitForTransaction = useWaitForTransaction({
        hash: contractWriteSubdomain.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
    })

    const handleSubdomain = async () => {
        try {
            await contractWriteSubdomain.writeAsync?.()
        } catch (err) {
            console.log(err)
        }
    }
    */

    // use this info to check which option of payments should be tagged available
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
                args: [(rootNodeENS)],
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
                args: [(nodeData[0]!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
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
                args: [(rootNodeENS)],
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
                args: [(rootNodeENS)],
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
                args: [(nodeData[0]!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
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
                args: [(rootNodeENS)],
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
                args: [(rootNodeENS)],
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
                args: [(nodeData[0]!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
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
                args: [(rootNodeENS)],
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
                args: [(rootNodeENS)],
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
                args: [(nodeData[0]!), ('0x229C0715e70741F854C299913C2446eb4400e76C')],
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
                args: [(rootNodeENS)],
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
                args: [(rootNodeENS)],
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
                    <div className={styles.register}>
                        <p>{subENStoString}</p>
                        <div className={styles.registerOptions}>
                            <Ether 
                                rootNodeENS={rootNodeENS}
                                subLabel={subLabel}
                            />
                            <Erc20 
                                rootNodeENS={rootNodeENS}
                                subLabel={subLabel}
                            />
                            <EtherWL 
                                rootNodeENS={rootNodeENS}
                                subLabel={subLabel}
                            />
                            <Erc20WL
                                rootNodeENS={rootNodeENS}
                                subLabel={subLabel}
                            />
                        </div>
                    </div>       
                </div>
            </div>
        </>
    )
}
