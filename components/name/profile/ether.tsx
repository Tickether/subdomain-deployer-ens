import styles from '@/styles/ProfileOptions.module.css'
import { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { formatEther, labelhash, namehash, encodeAbiParameters, parseAbiParameters } from 'viem'
import { useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import editSVG from '@/public/assets/icons/edit.svg'
import withdrawSVG from '@/public/assets/icons/withdraw.svg'
import Image from 'next/image'
import PriceModal from '../pricemodal/priceModal'
import { ENS } from '@/pages/[ensName]'


interface ENSprop {
  ENS: ENS,
}

interface Prices {
  threeUpLetterFee: string,
  fourFiveLetterFee: string,
  sixDownLetterFee: string,
  oneNumberFee: string,
  twoNumberFee: string,
  threeNumberFee: string,
  fourNumberFee: string,
  fiveUpNumberFee:string,
}

interface Conditions {
  Wrapped: boolean,
  CantUnwrap: boolean,
  Approved: boolean,
  ActiveNode: boolean,
  CanSubActiveNode: boolean,
}

export default function Ether({ENS} : ENSprop) {
    const {address, isConnected} = useAccount()
    
    const PricesDefault = {
      threeUpLetterFee: ('0.00'),
      fourFiveLetterFee: ('0.00'),
      sixDownLetterFee: ('0.00'),
      oneNumberFee: ('0.00'),
      twoNumberFee: ('0.00'),
      threeNumberFee: ('0.00'),
      fourNumberFee: ('0.00'),
      fiveUpNumberFee:('0.00'),
    };
    const [prices, setPrices] = useState<Prices>(PricesDefault)
    const conditionsDefault = {
      Wrapped: false,
      CantUnwrap: false,
      Approved: false,
      ActiveNode: false,
      CanSubActiveNode: false,
    };
    const [conditions, setConditions] = useState<Conditions>(conditionsDefault)
    const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedPrice, setSelectedPrice] = useState<string>('numbers');
    const [etherPrice, setEtherPrice] = useState<number>(0)
    const [roundData, setRoundData] = useState<bigint[] | null>(null)
    const [name, setName] = useState<string>('')
    const [encode, setEncode] = useState<string | null>(null)
    

    


  const handleToggle =  () => {
    if(showUSD){
        setShowUSD(false)
    } else {
        setShowUSD(true)
    }
  }

  const handlePriceToggle =  () => {
    setPriceMenu(!priceMenu)
  }

  //order of logic cos i forgot
  //check if approved for use 
  // after proved chcek for setNode
  //check if cannot unwraped is true
  // after node set check for can sub enabled

  //validations should be ens owner not connected wallet
  const checkConditions = useContractReads({
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
            args: [(namehash(ENS.name))],
            chainId: 5,
        },
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
          args: [(namehash(ENS.name)), (1)],
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
            args: [(ENS.owner!), ('0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC')],
            chainId: 5,
        },
        //contract 1b check if name is enabled on SubENS contract
        {
            address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
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
            args: [(namehash(ENS.name))],
            chainId: 5,
        },
        //contract 1c check if CanSub name is enabled on SubENS contract
        {
            address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
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
            args: [(namehash(ENS.name))],
            chainId: 5,
        },
    ],
    watch: true,
})  
console.log(checkConditions.data)
useEffect(() => {
    //let dataRes : Validaters[] = [] 
    if (checkConditions.data!) {

        // Extract the results from the data array
        const [isWrapped, isCantUnwrap, isApproved, isNodeActive, isCanSubActiveNode] = checkConditions.data.map(item => item.result as boolean);

        // Create a new Validator object using the extracted data
        const conditionsData: Conditions = {
          Wrapped: isWrapped,
          CantUnwrap: isCantUnwrap,
          Approved: isApproved,
          ActiveNode: isNodeActive,
          CanSubActiveNode: isCanSubActiveNode,
        };

        setConditions(conditionsData)
    }
},[checkConditions.data!])
console.log(conditions)

console.log((BigInt(labelhash(ENS.name.substring(0, ENS.name.lastIndexOf('.eth'))))))

const contractReadName = useContractRead({
  address: "0x114D4603199df73e7D157787f8778E21fCd13066",
  abi: [
      {
          name: 'names',
          inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
          outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
          stateMutability: 'view',
          type: 'function',
      },    
  ],
  functionName: 'names',
  args: [(namehash(ENS.name))],
  chainId: 5,
  watch: true,
})
function truncateAndPad(inputString: string) {
  const targetLength = 65
  const zeroIndex = inputString.indexOf('0');
  let truncatedString;

  if (zeroIndex !== -1) {
    truncatedString = inputString.substring(0, zeroIndex + 1);
  } else {
    truncatedString = inputString;
  }

  const remainingCharacters = targetLength - truncatedString.length;
  
  if (remainingCharacters > 0) {
    const padding = '0'.repeat(remainingCharacters);
    return truncatedString + padding;
  } else {
    return truncatedString;
  }
}
useEffect(() => {
  if (contractReadName?.data! && typeof contractReadName.data === 'string') {
    
    setName(truncateAndPad((contractReadName?.data!).slice(3)))
  }
},[contractReadName?.data!])
console.log((contractReadName?.data!))




useEffect (()=>{
  const encodedData = `0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000${address?.toLowerCase().slice(2)}0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d7a4f6473f32ac2af804b3686ae8f1932bc35750000000000000000000000000000000000000000000000000000000000000000${name}`
  setEncode(encodedData)
},[name])

console.log(encode)
console.log(namehash('shhhh.eth'))
console.log(ENS.expiry)
console.log(address?.toLowerCase())
console.log((BigInt(labelhash(ENS.name.substring(0, ENS.name.lastIndexOf('.eth'))))))

const prepareContractWriteWrap = usePrepareContractWrite({
  address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
  abi: [
      {
        name: 'safeTransferFrom',
        inputs: [ {internalType: "address", name: "from", type: "address"}, {internalType: "address", name: "to", type: "address"}, {internalType: "uint256", name: "tokenId", type: "uint256"},{ internalType: "bytes", name: "_data", type: "bytes" } ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  functionName: 'safeTransferFrom',
  args: [ (address!), ('0x114D4603199df73e7D157787f8778E21fCd13066'), ((BigInt(labelhash(ENS.name.substring(0, ENS.name.lastIndexOf('.eth')))))), (encode) ],
  chainId: 5,
  value: BigInt(0),
})

const  contractWriteWrap = useContractWrite(prepareContractWriteWrap.config)

const waitForWrap = useWaitForTransaction({
  hash: contractWriteWrap.data?.hash,
  confirmations: 1,
  onSuccess() {
  },
})

const handleWrap = async () => {
  try {
      await contractWriteWrap.writeAsync?.()
  } catch (err) {
      console.log(err)
  }    
}

const prepareContractWriteCantUnwrap = usePrepareContractWrite({
  address: '0x114D4603199df73e7D157787f8778E21fCd13066',
  abi: [
      {
        name: 'setFuses',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, { internalType: "uint16", name: "ownerControlledFuses", type: "uint16" } ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  functionName: 'setFuses',
  args: [ (namehash(ENS.name)), (1) ],
  chainId: 5,
  value: BigInt(0),
})




const  contractWriteCantUnwrap = useContractWrite(prepareContractWriteCantUnwrap.config)

const waitForCantUnwrap = useWaitForTransaction({
  hash: contractWriteCantUnwrap.data?.hash,
  confirmations: 1,
  onSuccess() {
  },
})

const handleCantUnwrap = async () => {
  try {
      await contractWriteCantUnwrap.writeAsync?.()
  } catch (err) {
      console.log(err)
  }    
}

    
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
          args: [ ('0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC'), (true) ],
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

  const prepareContractWriteParentNode = usePrepareContractWrite({
    address: '0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC',
    abi: [
      {
        name: 'setBaseEns',
        inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"} ],
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'setBaseEns',
    args: [ (namehash(ENS.name)) ],
    value: BigInt(0),
    chainId: 5,
  })
  const contractWriteParentNode = useContractWrite(prepareContractWriteParentNode.config)

  const waitForSetParentNode = useWaitForTransaction({
    hash: contractWriteParentNode.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
})

  const handleSetParentNode = async () => {
    try {
        await contractWriteParentNode.writeAsync?.()
    } catch (err) {
        console.log(err)
    }
  }


const prepareContractWriteParentNodeSubMode = usePrepareContractWrite({
address: '0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC',
abi: [
  {
    name: 'flipBaseEnsSubMode',
    inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"} ],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
],
functionName: 'flipBaseEnsSubMode',
args: [ (namehash(ENS.name)) ],
value: BigInt(0),
chainId: 5,
})
const contractWriteParentNodeSubMode = useContractWrite(prepareContractWriteParentNodeSubMode.config)

const waitForSetParentNodeSubMode = useWaitForTransaction({
hash: contractWriteParentNodeSubMode.data?.hash,
confirmations: 2,
onSuccess() {
},
})

const handleSetParentNodeSubMode = async () => {
try {
    await contractWriteParentNodeSubMode.writeAsync?.()
} catch (err) {
    console.log(err)
}
}


//read balance and withdraw
  const contractReadParentNodeBalance = useContractRead({
    address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
    abi: [
        {
            name: 'parentNodeBalance',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeBalance',
    args: [(namehash(ENS.name))],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    
    if (contractReadParentNodeBalance?.data! && typeof contractReadParentNodeBalance.data === 'bigint' ) {
      setParentNodeBalance(contractReadParentNodeBalance?.data!)
    }

  },[ contractReadParentNodeBalance?.data!])
  

//read balance and withdraw
  const prepareContractWriteWithdraw = usePrepareContractWrite({
    address: '0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC',
    abi: [
        {
          name: 'withdrawNodeBalance',
          inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"} ],
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    functionName: 'withdrawNodeBalance',
    args: [ (namehash(ENS.name)) ],
    chainId: 5,
    value: BigInt(0),
  })




  const  contractWriteWithdraw = useContractWrite(prepareContractWriteWithdraw.config)

  const waitForWithdraw = useWaitForTransaction({
    hash: contractWriteWithdraw.data?.hash,
    confirmations: 1,
    onSuccess() {
    },
  })

  const handleWithdraw = async () => {
    try {
        await contractWriteWithdraw.writeAsync?.()
    } catch (err) {
        console.log(err)
    }    
  }

  //read fees
  const getPrices = useContractReads({
    contracts: [
        //contract 0 check if name is wrapped on nameWrapper
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
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
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 1a check if SubENS contract is approved on nameWrapper
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
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
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 1b check if name is enabled on SubENS contract
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
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
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 1c check if CanSub name is enabled on SubENS contract
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
          abi: [
              {
                  name: 'oneNumberFee',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'oneNumberFee',
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 2a check if SubENSERC20 contract is approved on nameWrapper
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
          abi: [
              {
                  name: 'twoNumberFee',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'twoNumberFee',
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 2b check if name is enabled on SubENSERC20 contract
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
          abi: [
              {
                  name: 'threeNumberFee',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'threeNumberFee',
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 2c check if CanSub name is enabled on SubENSERC20 contract
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
          abi: [
              {
                  name: 'fourNumberFee',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'fourNumberFee',
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
        //contract 3a check if SubENSWL contract is approved on nameWrapper
        {
          address: "0xDb4E489A6476ad51d32BA9F7F629aB491a16ECEC",
          abi: [
              {
                  name: 'fiveUpNumberFee',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'fiveUpNumberFee',
          args: [(namehash(ENS.name))],
          chainId: 5,
        },
    ],
    watch: true,
  })  
  
  useEffect(() => {
    if (getPrices.data!) {
      const [ThreeUpLetterFee, FourFiveLetterFee, SixDownLetterFee, 
        OneNumberFee, TwoNumberFee, ThreeNumberFee,
        FourNumberFee, FiveUpNumberFee, ] =getPrices.data.map(item => item.result as bigint);

            //
            const dec8 = 100000000
            const pricesData: Prices = {
              threeUpLetterFee: (Number(ThreeUpLetterFee)/dec8).toFixed(2),
              fourFiveLetterFee: (Number(FourFiveLetterFee)/dec8).toFixed(2),
              sixDownLetterFee: (Number(SixDownLetterFee)/dec8).toFixed(2),
              oneNumberFee: (Number(OneNumberFee)/dec8).toFixed(2),
              twoNumberFee: (Number(TwoNumberFee)/dec8).toFixed(2),
              threeNumberFee: (Number(ThreeNumberFee)/dec8).toFixed(2),
              fourNumberFee: (Number(FourNumberFee)/dec8).toFixed(2),
              fiveUpNumberFee: (Number(FiveUpNumberFee)/dec8).toFixed(2),
            };
            setPrices(pricesData)
    }
  },[getPrices.data!])
  console.log(getPrices.data!)
  console.log(prices)

  // check node price in usd
  const contractReadETH = useContractRead({
    address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    abi: [
        {
            name: 'latestRoundData',
            inputs: [/*{ internalType: "uint80", name: "_roundId", type: "uint80" }*/],
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" }, 
                { internalType: "int256", name: "answer", type: "int256" }, 
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],

            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'latestRoundData',
    chainId: 1,
    watch: true,
})
useEffect(() => {
    if (contractReadETH?.data/* && contractReadETH.data === bigint[]*/) {
        setRoundData(contractReadETH?.data as bigint[])
    }
},[contractReadETH?.data!])


useEffect(() => {
    if (roundData != null) {
        const ethPrice = Number((Number(roundData[1].toString()) / Math.pow(10, 8)).toFixed(2));
        setEtherPrice(ethPrice)
    }
},[roundData])
console.log(roundData)
console.log(etherPrice)

const getEther = (usd : string) =>{
  let ether = Number(usd) / etherPrice
  return ether.toFixed(18)
}

  
  

  
    
      return (
        <>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              {
                conditions.Wrapped && conditions.CantUnwrap && conditions.Approved && conditions.ActiveNode
                ?(
                  <div className={styles.profileDown}>
                    <div className={styles.profileDownChild}>
                      <div className={styles.profileDownPay}>
                        <div className={styles.profileDownPayLeft}>
                          <p>Ethereum</p>
                          {
                            conditions.CanSubActiveNode 
                            ? <span className={styles.profileDownPayLeftActive}>Active</span>
                            : <span className={styles.profileDownPayLeftInactive}>Inactive</span>
                          }
                        </div>
                        <div className={styles.profileDownPayRight}>
                          <div className={styles.profileDownPayRightBalance}>
                            <p>{formatEther(parentNodeBalance)} ETH</p>
                            <p>USD</p>
                          </div>
                          <div onClick={handleWithdraw} className={styles.profileDownPayRightWithdraw}>
                            <Image src={withdrawSVG} alt='' />
                          </div>
                        </div>
                      </div>
                      <div className={styles.profileDownSubFee}>
                                  <div className={styles.profileDownSub}>
                                      <div className={styles.profileDownSubChild}>
                                              <div className={styles.profileDownSubChildTitle}>
                                                  <div className={styles.profileDownSubChildFee}>
                                                    <div className={styles.profileDownSubChildFeeTitle}><p>Subname Prices</p></div>
                                                    <div className={styles.profileDownSubChildFeeIcon} onClick={()=> setOpenModal(true)}><Image src={editSVG} alt='' /></div>
                                                  </div>
                                                  {openModal && <PriceModal ENS ={ENS} setOpenModal ={setOpenModal} />}
                                                  <div onClick={handlePriceToggle} className={styles.profileDownSubChildOption}>
                                                    { selectedPrice === 'numbers' && <p>Numbers Only</p>}
                                                    { selectedPrice === 'letters' && <p>Letters & Numbers</p>}
                                                    <Image src={drop_blueSVG} alt='' />
                                                  </div>
                                                  <div className={styles.dropOverlay}>
                                                    {
                                                      priceMenu && (
                                                        <div className={styles.profileDownSubChildOptionDrop}>
                                                          <div className={styles.profileDownSubChildOptionToggle}>
                                                            <div className={styles.profileDownSubChildOptionToggleSpan}>
                                                              <span
                                                                onClick={()=> {
                                                                  setSelectedPrice('letters'); 
                                                                  setPriceMenu(false);
                                                                }}
                                                              >
                                                                Letters & Numbers
                                                              </span>
                                                            </div>
                                                            <div className={styles.profileDownSubChildOptionToggleSpan}>
                                                              <span
                                                                onClick={()=> {
                                                                  setSelectedPrice('numbers'); 
                                                                  setPriceMenu(false);
                                                                }}
                                                              >
                                                                Numbers Only
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    }
                                                  </div>
                                                  
                                                  
                                                  
                                              </div>
                                              <div onClick={handleToggle} className={styles.profileDownToggle}>
                                                  {
                                                      showUSD 
                                                      ?(
                                                          <>
                                                              <div className={styles.profileDownToggleETH}>
                                                                  <span>ETH</span>
                                                              </div>
                                                              <div className={styles.profileDownToggleSelectUSD}>
                                                                  <span>USD</span>
                                                              </div>
                                                          </>
                                                      )
                                                      :(
                                                          <>
                                                              <div className={styles.profileDownToggleSelectETH}><span>ETH</span></div>
                                                              <div className={styles.profileDownToggleUSD}><span>USD</span></div>
                                                          </>
                                                      )
                                                  }
                                              </div>
                                          
                                      </div>
                                  </div>
                                  {
                                    selectedPrice === 'numbers' && (
                                      <div className={styles.profileDownFee}>
                                          {
                                              showUSD
                                              ?( 
                                                  <div className={styles.profileDownFeeChild}>
                                                      <div className={styles.profileDownFees}><span>One Number Fee</span><span>{prices.oneNumberFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{prices.twoNumberFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{prices.threeNumberFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{prices.fourNumberFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{prices.fiveUpNumberFee} USD</span></div>
                                                  </div>
                                              )
                                              :(
                                                  <div className={styles.profileDownFeeChild}>
                                                      <div className={styles.profileDownFees}><span>One Number Fee</span><span>{getEther(prices.oneNumberFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{getEther(prices.twoNumberFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{getEther(prices.threeNumberFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{getEther(prices.fourNumberFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{getEther(prices.fiveUpNumberFee)} ETH</span></div>
                                                  </div>   
                                              )
                                          }
                                      </div>
                                    )
                                  }
                                  {
                                    selectedPrice === 'letters' && (
                                      <div className={styles.profileDownFee}>
                                          {
                                              showUSD
                                              ?( 
                                                  <div className={styles.profileDownFeeChild}>
                                                      <div className={styles.profileDownFees}><span>Three- Number Fee</span><span>{prices.threeUpLetterFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Four/Five Number Fee</span><span>{prices.fourFiveLetterFee} USD</span></div>
                                                      <div className={styles.profileDownFees}><span>Six+ Number Fee</span><span>{prices.sixDownLetterFee} USD</span></div>
                                                      
                                                  </div>
                                              )
                                              :(
                                                  <div className={styles.profileDownFeeChild}>
                                                      <div className={styles.profileDownFees}><span>Three- Number Fee</span><span>{getEther(prices.threeUpLetterFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Four/Five Number Fee</span><span>{getEther(prices.fourFiveLetterFee)} ETH</span></div>
                                                      <div className={styles.profileDownFees}><span>Six+ Number Fee</span><span>{getEther(prices.sixDownLetterFee)} ETH</span></div>
                                                  </div>   
                                              )
                                          }
                                      </div>
                                    )
                                  }
                              </div>
                          </div>
                    </div>
                )
                :(
                  <div className={styles.profileDown}>
                    <div className={styles.profileDownChild}>
                      <div>
                        <div>                            
                            <span>Please wrapped your domain to enable domain mangement dashboard</span>
                            <button disabled={conditions.Wrapped} onClick={handleWrap}>wrap ENS</button>                 
                        </div>
                        <div>                          
                            <span>In order to rent out subnames you must permanently wrap your domain!</span>
                            <button disabled={conditions.CantUnwrap} onClick={handleCantUnwrap}>Burn Wrap Fuse!</button>            
                        </div>
                      </div>
                      <div>
                        <div>                            
                            <span>Please approve to enable domain mangement dashboard</span>
                            <button disabled={conditions.Approved} onClick={handleApproval}>approve</button>                 
                        </div>
                        <div>                          
                            <span>Parent Node is not set! Dont worry click below to init</span>
                            <button disabled={conditions.ActiveNode} onClick={handleSetParentNode}>Set Parent Node</button>            
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              
                  {/** 
                    <div>
                      {
                        true//approved 
                        ? (
                          <div>
                            {
                              true//activeParentNode
                              ? (
                                <div></div>
                              )
                              : (
                                
                              )
                            }
                          </div>
                        )
                        : (
                          
                        )
                      }
                    </div>
                  */}
            </div>
          </div>
        </>
      )
}



