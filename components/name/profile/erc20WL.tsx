import styles from '@/styles/ProfileOptions.module.css'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import editSVG from '@/public/assets/icons/edit.svg'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import withdrawSVG from '@/public/assets/icons/withdraw.svg'
import toggle_onSVG from '@/public/assets/icons/toggle-on.svg'
import toggle_offSVG from '@/public/assets/icons/toggle-off.svg'
import setting_wlSVG from '@/public/assets/icons/setting-wl.svg'
import dropSVG from '@/public/assets/icons/drop.svg'
import addSVG from '@/public/assets/icons/add.svg'
import { Prices } from './ether'
import { ENS } from '@/pages/[ensName]'
import { useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { formatUnits, labelhash, namehash } from 'viem'
import AddressModal from '../addressmodal/addressModal'
import AllowlistModal from '../allowlistmodal/allowlistModal'
import PriceModalERC20 from '../pricemodal/priceModalERC20'
import ERC20Contract from './erc20Contract'


interface ENSprop {
  ENS: ENS,
}


interface Hovered {
  toggleID: number,
  isHovered: boolean,
}


export default function Erc20WL({ENS} : ENSprop) {
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

  const [parentNodeBalance, setParentNodeBalance] = useState<bigint>(BigInt(0))
  const [showUSD, setShowUSD] = useState<boolean>(false)
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openAddressModal, setOpenAddressModal] = useState<boolean>(false) 
    const [openAllowlistModal, setOpenAllowlistModal] = useState<boolean>(false) 
    const [selectedPrice, setSelectedPrice] = useState<string>('numbers');
    const [contractMenu, setContractMenu] = useState<boolean>(false)
    const [selectedContract, setSelectedContract] = useState<string>('');
    //const [tokenName, setTokenName] = useState<string| null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
    const [tokenDecimal, setTokenDecimal] = useState<number | null>(null);
    const [etherPrice, setEtherPrice] = useState<number>(0)
    const [roundData, setRoundData] = useState<bigint[] | null>(null)
    const [ERC20List, setERC20List] = useState<string[] | null>(null)
    const [name, setName] = useState<string>('')
    const [encode, setEncode] = useState<string | null>(null)
    const [wrapped, setWrapped] = useState<boolean>(false)
    const [cantUnwrap, setCantUnwrap] = useState<boolean>(false)
    const [approved, setApproved] = useState<boolean>(false)
    const [activeNode, setActiveNode] = useState<boolean>(false)
    const [canSubActiveNode, setCanSubActiveNode] = useState<boolean>(false)
    const hoverDefault = {
      toggleID: 0,
      isHovered: false,
    };
    const [hovered, setHovered] = useState<Hovered>(hoverDefault);

  const handleHover = (id : number) => {
    const hoverData = {
      toggleID: id,
      isHovered: true,
    };
    setHovered(hoverData);
  };

  const handleMouseLeave = (id : number) => {
    const hoverData = {
      toggleID: id,
      isHovered: false,
    };
    setHovered(hoverData);
  };
    


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

  const handleContractToggle =  () => {
    setContractMenu(!contractMenu)
  }


  //order of logic cos i forgot
  //check if approved for use 
  // after proved chcek for setNode
  //check if cannot unwraped is true
  // after node set check for can sub enabled

  //validations should be ens owner not connected wallet
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
    args: [(namehash(ENS.name))],
    watch: true,
    chainId: 5,
})  
console.log(contractReadWrapped.data)
  
useEffect(() => {
    if (contractReadWrapped?.data! && typeof contractReadWrapped.data === 'boolean') {
        setWrapped((contractReadWrapped?.data!))
    }
},[contractReadWrapped?.data!])

// check cannot unwrap

const contractReadFuseBurned = useContractRead({
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
  watch: true,
  chainId: 5,
})  
console.log(contractReadFuseBurned.data)

useEffect(() => {
  if (contractReadFuseBurned?.data! && typeof contractReadFuseBurned.data === 'boolean') {
    setCantUnwrap((contractReadFuseBurned?.data!))
  }
},[contractReadFuseBurned?.data!])

// check approved // must replace address with own ofer ens in search


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
  args: [(ENS.owner!), ('0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6')],
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
  address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
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
    watch: true,
})
useEffect(() => {
    if (contractReadActiveParentNode?.data! && typeof contractReadActiveParentNode.data === 'boolean' ) {
      setActiveNode((contractReadActiveParentNode?.data!))
    }
},[contractReadActiveParentNode?.data!])

// check canSub/ParentNodeActive

const contractReadCanSubActiveParentNode = useContractRead({
  address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
  abi: [
      {
          name: 'parentNodeCanSubERC20Active',
          inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }, {internalType: "address", name: "", type: "address"}],
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: 'view',
          type: 'function',
      },    
  ],
  functionName: 'parentNodeCanSubERC20Active',
  args: [(namehash(ENS.name)), (selectedContract)],
  chainId: 5,
  watch: true,
})
useEffect(() => {
  if (contractReadCanSubActiveParentNode?.data! && typeof contractReadCanSubActiveParentNode.data === 'boolean' ) {
    setCanSubActiveNode((contractReadCanSubActiveParentNode?.data!))
  }
},[contractReadCanSubActiveParentNode?.data!])
/*
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
            args: [(ENS.owner!), ('0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6')],
            chainId: 5,
        },
        //contract 1b check if name is enabled on SubENS contract
        {
            address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
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
            address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
            abi: [
                {
                    name: 'parentNodeCanSubActive',
                    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                    outputs: [{ internalType: "bool", name: "", type: "bool" }],
                    stateMutability: 'view',
                    type: 'function',
                },    
            ],
            functionName: 'parentNodeCanSubActive',
            args: [(namehash(ENS.name)), (selectedContract)],
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
console.log(checkConditions.data!)
console.log(conditions)
*/

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
/*
const waitForWrap = useWaitForTransaction({
  hash: contractWriteWrap.data?.hash,
  confirmations: 1,
  onSuccess() {
  },
})
*/

const handleWrap = async () => {
  try {
      contractWriteWrap.write?.()
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
/*
const waitForCantUnwrap = useWaitForTransaction({
  hash: contractWriteCantUnwrap.data?.hash,
  confirmations: 1,
  onSuccess() {
  },
})
*/

const handleCantUnwrap = async () => {
  try {
      contractWriteCantUnwrap.write?.()
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
          args: [ ('0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6'), (true) ],
          chainId: 5,
          value: BigInt(0),
      })
    
    
    
    
      const  contractWriteApproval = useContractWrite(prepareContractWriteApproval.config)
    /*
      const waitForApproval = useWaitForTransaction({
          hash: contractWriteApproval.data?.hash,
          confirmations: 1,
          onSuccess() {
          },
      })
    */
      const handleApproval = async () => {
          try {
              contractWriteApproval.write?.()
          } catch (err) {
              console.log(err)
          }    
      }

  const prepareContractWriteParentNode = usePrepareContractWrite({
    address: '0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6',
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
/*
  const waitForSetParentNode = useWaitForTransaction({
    hash: contractWriteParentNode.data?.hash,
    confirmations: 2,
    onSuccess() {
    },
})
*/

  const handleSetParentNode = async () => {
    try {
        contractWriteParentNode.write?.()
    } catch (err) {
        console.log(err)
    }
  }


const prepareContractWriteParentNodeSubMode = usePrepareContractWrite({
address: '0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6',
abi: [
  {
    name: 'flipBaseEnsSubMode',
    inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "address", name: "erc20Contract", type: "address"} ],
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
],
functionName: 'flipBaseEnsSubMode',
args: [ (namehash(ENS.name)), (selectedContract) ],
value: BigInt(0),
chainId: 5,
})
const contractWriteParentNodeSubMode = useContractWrite(prepareContractWriteParentNodeSubMode.config)
/*
const waitForSetParentNodeSubMode = useWaitForTransaction({
hash: contractWriteParentNodeSubMode.data?.hash,
confirmations: 2,
onSuccess() {
},
})
*/

const handleSetParentNodeSubMode = async () => {
try {
    contractWriteParentNodeSubMode.write?.()
} catch (err) {
    console.log(err)
}
}


//read balance and withdraw
  const contractReadParentNodeBalance = useContractRead({
    address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
    abi: [
        {
            name: 'parentNodeBalanceERC20',
            inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: 'view',
            type: 'function',
        },    
    ],
    functionName: 'parentNodeBalanceERC20',
    args: [(namehash(ENS.name)), (selectedContract)],
    chainId: 5,
    watch: true,
  })
  useEffect(() => {
    
    if (contractReadParentNodeBalance?.data! && typeof contractReadParentNodeBalance.data === 'bigint' ) {
      setParentNodeBalance(contractReadParentNodeBalance?.data!)
    }

  },[ contractReadParentNodeBalance?.data!])
  console.log(parentNodeBalance)
  

//read balance and withdraw
  const prepareContractWriteWithdraw = usePrepareContractWrite({
    address: '0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6',
    abi: [
        {
          name: 'withdrawNodeBalance',
          inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "address", name: "erc20Contract", type: "address"} ],
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
    functionName: 'withdrawNodeBalance',
    args: [ (namehash(ENS.name)), (selectedContract) ],
    chainId: 5,
    value: BigInt(0),
  })




  const  contractWriteWithdraw = useContractWrite(prepareContractWriteWithdraw.config)
/*
  const waitForWithdraw = useWaitForTransaction({
    hash: contractWriteWithdraw.data?.hash,
    confirmations: 1,
    onSuccess() {
    },
  })
*/
  const handleWithdraw = async () => {
    try {
        contractWriteWithdraw.write?.()
    } catch (err) {
        console.log(err)
    }    
  }

  //read fees
  const getPrices = useContractReads({
    contracts: [
        //contract 0 check if name is wrapped on nameWrapper
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'threeUpLetterFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'threeUpLetterFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 1a check if SubENS contract is approved on nameWrapper
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'fourFiveLetterFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'fourFiveLetterFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 1b check if name is enabled on SubENS contract
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'sixDownLetterFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'sixDownLetterFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 1c check if CanSub name is enabled on SubENS contract
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'oneNumberFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'oneNumberFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 2a check if SubENSERC20 contract is approved on nameWrapper
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'twoNumberFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'twoNumberFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 2b check if name is enabled on SubENSERC20 contract
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'threeNumberFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'threeNumberFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 2c check if CanSub name is enabled on SubENSERC20 contract
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'fourNumberFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'fourNumberFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
        //contract 3a check if SubENSWL contract is approved on nameWrapper
        {
          address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
          abi: [
              {
                  name: 'fiveUpNumberFeeERC20',
                  inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }, {internalType: "address", name: "erc20Contract", type: "address"}],
                  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
                  stateMutability: 'view',
                  type: 'function',
              },    
          ],
          functionName: 'fiveUpNumberFeeERC20',
          args: [(namehash(ENS.name)), (selectedContract)],
          chainId: 5,
        },
    ],
    watch: true,
    allowFailure: false,
  })  
  
  useEffect(() => {
    if (getPrices.data!) {
      const [ThreeUpLetterFee, FourFiveLetterFee, SixDownLetterFee, 
        OneNumberFee, TwoNumberFee, ThreeNumberFee,
        FourNumberFee, FiveUpNumberFee, ] =getPrices.data.map(item => item as bigint);

            //
            const dec8 = 100000000
            const pricesData: Prices = {
              threeUpLetterFee: (Number(ThreeUpLetterFee)).toFixed(2),
              fourFiveLetterFee: (Number(FourFiveLetterFee)).toFixed(2),
              sixDownLetterFee: (Number(SixDownLetterFee)).toFixed(2),
              oneNumberFee: (Number(OneNumberFee)).toFixed(2),
              twoNumberFee: (Number(TwoNumberFee)).toFixed(2),
              threeNumberFee: (Number(ThreeNumberFee)).toFixed(2),
              fourNumberFee: (Number(FourNumberFee)).toFixed(2),
              fiveUpNumberFee: (Number(FiveUpNumberFee)).toFixed(2),
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

// get erc20 list
const contractReadERC20List = useContractRead({
  address: "0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6",
  abi: [
      {
          name: 'listERC20',
          inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
          outputs: [{ internalType: "address[]", name: "", type: "address[]" }],

          stateMutability: 'view',
          type: 'function',
      },    
  ],
  functionName: 'listERC20',
  args: [(namehash(ENS.name))],
  chainId: 5,
  watch: true,
})
useEffect(() => {
  if (contractReadERC20List?.data/* && contractReadETH.data === bigint[]*/) {
    setERC20List(contractReadERC20List?.data as string[])
  }
},[contractReadERC20List?.data!])



const handleContractSelect =(ERC20Contract: string, ERC20Symbol: string, ERC20Decimal: number)=>{
  setSelectedContract(ERC20Contract)
  setTokenSymbol(ERC20Symbol)
  setTokenDecimal(ERC20Decimal)
  setContractMenu(false)
}

    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            {
              wrapped && cantUnwrap && approved && activeNode
              ? (
                <div className={styles.profileDown}>
              <div className={styles.profileDownChild}>
                <div className={styles.profileDownPay}>
                <div className={styles.profileDownPayLeftWL}>
                    <div className={styles.profileDownPayLeft}>
                      <p>ERC20 + Allowlist</p>
                      {
                        canSubActiveNode 
                        ? <span onClick={handleSetParentNodeSubMode} className={styles.profileDownPayLeftActive}>Active</span>
                        : <span onClick={handleSetParentNodeSubMode} className={styles.profileDownPayLeftInactive}>Inactive</span>
                      }
                    </div>
                    <div onClick={()=> setOpenAllowlistModal(true)} className={styles.profileDownPayWL}>
                        <div className={styles.profileDownPayWLSpan}><span>Allowlist Setup</span></div>
                        <div className={styles.profileDownPayWLImg}><Image src={setting_wlSVG} alt='' /></div>
                    </div>
                  </div>
                  <div className={styles.profileDownPayRight}>
                    <div className={styles.profileDownPayRightBalance}>
                      <p>{formatUnits(parentNodeBalance, tokenDecimal!)} {selectedContract === '' ? 'ERC20' : tokenSymbol}</p>
                      <p>USD</p>
                    </div>
                    <div className={styles.profileDownPayRightWithdraw}>
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
                                            {openModal && <PriceModalERC20 ENS ={ENS} setOpenModal ={setOpenModal} prices ={prices} ERC20List={ERC20List} contract='0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6'/>}
                                            {openAddressModal && <AddressModal ENS ={ENS} setOpenAddressModal ={setOpenAddressModal} contract='0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6'/>}
                                            {openAllowlistModal && <AllowlistModal ENS ={ENS} setOpenAllowlistModal ={setOpenAllowlistModal} contract='0x04D2bC82A99f6B7DeE6309AdF84d9F44a04502a6'/>}
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
                                        <div className={styles.profileDownToggleArea}>
                                          <div onClick={()=> setOpenAddressModal(true)}>
                                            <Image src={addSVG} alt='' />
                                          </div>
                                          <div className={styles.profileDownToggleParent}>
                                          <div onClick={handleContractToggle}>
                                              <Image src={dropSVG} alt='' />
                                          </div>
                                          <div className={styles.contractDropOverlay}>
                                            {
                                              contractMenu && (
                                                <div className={styles.priceModalTopOptionDrop}>
                                                  <div className={styles.priceModalTopOptionDropToggle}>
                                                    
                                                    {ERC20List?.map((erc20Contract: string) => (
                                                      <ERC20Contract 
                                                      erc20Contract={erc20Contract}
                                                      selectERC20 = {handleContractSelect}
                                                      />
                                                    ))}
                                                  </div>
                                                </div>
                                              )
                                            }
                                          </div>
                                          <div onClick={handleToggle} className={styles.profileDownToggle}>
                                              {
                                                  showUSD 
                                                  ?(
                                                      <>
                                                          <div className={styles.profileDownToggleETH}>
                                                              <span>{selectedContract === '' ? 'ERC20' : tokenSymbol}</span>
                                                          </div>
                                                          <div className={styles.profileDownToggleSelectUSD}>
                                                              <span>USD</span>
                                                          </div>
                                                      </>
                                                  )
                                                  :(
                                                      <>
                                                          <div className={styles.profileDownToggleSelectETH}><span>{selectedContract === '' ? 'ERC20' : tokenSymbol}</span></div>
                                                          <div className={styles.profileDownToggleUSD}><span>USD</span></div>
                                                      </>
                                                  )
                                              }
                                          </div>
                                        </div>
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
                                                <div className={styles.profileDownFees}><span>One Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{0} USD</span></div>
                                            </div>
                                        )
                                        :(
                                            <div className={styles.profileDownFeeChild}>
                                                <div className={styles.profileDownFees}><span>One Number Fee</span><span>{prices.oneNumberFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{prices.twoNumberFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{prices.threeNumberFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{prices.fourNumberFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{prices.fiveUpNumberFee} {tokenSymbol}</span></div>
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
                                                <div className={styles.profileDownFees}><span>Three- Letter Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Four/Five Letter Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Six+ Letter Fee</span><span>{0} USD</span></div>
                                                
                                            </div>
                                        )
                                        :(
                                            <div className={styles.profileDownFeeChild}>
                                                <div className={styles.profileDownFees}><span>Three- Letter Fee</span><span>{prices.threeUpLetterFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Four/Five Letter Fee</span><span>{prices.fourFiveLetterFee} {tokenSymbol}</span></div>
                                                <div className={styles.profileDownFees}><span>Six+ Letter Fee</span><span>{prices.sixDownLetterFee} {tokenSymbol}</span></div>
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
              : (
                <div className={styles.profileDown}>
                    <div className={styles.profileDownChild}>
                      <div className={styles.profileDownInfo}>
                        <p>Complete the following steps to enable fully enable Dashboard</p>
                      </div>
                      <div className={styles.profileDownSteps}>
                        <div className={styles.profileDownStep}>  
                          <div className={approved ? styles.profileDownStepLeft : styles.profileDownStepLeftInactive}><span>1</span></div>
                          <div className={styles.profileDownStepMid}><p>Approve ENS</p><span>Please approve to enable domain mangement dashboard</span></div>
                          <div className={styles.profileDownStepRight}>
                            {
                              approved
                              ?(
                                <div><Image src={toggle_onSVG} alt='' /></div>
                              )
                              : (
                                <div 
                                  className={styles.profileDownStepRightToggleInactive} 
                                  onClick={handleApproval}
                                  onMouseEnter={() => handleHover(1)}
                                  onMouseLeave={() => handleMouseLeave(1)}
                                >
                                  {hovered.toggleID == 1 && hovered.isHovered ? <Image src={toggle_onSVG} alt='' /> :<Image src={toggle_offSVG} alt='' /> }
                                </div>
                              )
                            }
                          </div>                               
                        </div>
                        <div className={styles.profileDownStep}> 
                          <div className={wrapped ? styles.profileDownStepLeft : styles.profileDownStepLeftInactive}><span>2</span></div>
                          <div className={styles.profileDownStepMid}><p>Wrap ENS domain</p><span>Please wrapped your domain to enable domain mangement dashboard</span></div>
                          <div className={styles.profileDownStepRight}>
                            {
                              wrapped
                              ?(
                                <div><Image src={toggle_onSVG} alt='' /></div>
                              )
                              : (
                                <div 
                                  className={styles.profileDownStepRightToggleInactive} 
                                  onClick={handleWrap}
                                  onMouseEnter={() => handleHover(2)}
                                  onMouseLeave={() => handleMouseLeave(2)}
                                >
                                  {hovered.toggleID == 2 && hovered.isHovered  ? <Image src={toggle_onSVG} alt='' /> :<Image src={toggle_offSVG} alt='' /> }
                                </div>
                              )
                            }
                          </div>                                      
                        </div>
                        <div className={styles.profileDownStep}>
                          <div className={cantUnwrap ? styles.profileDownStepLeft : styles.profileDownStepLeftInactive}><span>3</span></div>
                          <div className={styles.profileDownStepMid}><p>Burn Cannot Unwrap Fuse</p><span>In order to rent out subnames you must permanently wrap your domain!</span></div>
                          <div className={styles.profileDownStepRight}>
                            {
                              cantUnwrap
                              ?(
                                <div><Image src={toggle_onSVG} alt='' /></div>
                              )
                              : (
                                <div  
                                  className={styles.profileDownStepRightToggleInactive} 
                                  onClick={handleCantUnwrap} 
                                  onMouseEnter={() => handleHover(3)}
                                  onMouseLeave={() => handleMouseLeave(3)}
                                >
                                  {hovered.toggleID == 3 && hovered.isHovered  ? <Image src={toggle_onSVG} alt='' /> :<Image src={toggle_offSVG} alt='' /> }
                                  
                                </div>
                              )
                            }
                          </div>                                
                        </div>
                        <div className={styles.profileDownStep}>   
                          <div className={activeNode ? styles.profileDownStepLeft : styles.profileDownStepLeftInactive}><span>4</span></div>
                          <div className={styles.profileDownStepMid}><p>Initilaze ENS</p><span>Parent Node is not set! Dont worry click below to init</span></div>
                          <div className={styles.profileDownStepRight}>
                            {
                              activeNode
                              ?(
                                <div><Image src={toggle_onSVG} alt='' /></div>
                              )
                              : (
                                <div 
                                  className={styles.profileDownStepRightToggleInactive} 
                                  onClick={handleSetParentNode}
                                  onMouseEnter={() => handleHover(4)}
                                  onMouseLeave={() => handleMouseLeave(4)}
                                >
                                    {hovered.toggleID == 4 && hovered.isHovered  ? <Image src={toggle_onSVG} alt='' /> :<Image src={toggle_offSVG} alt='' /> }
                                </div>
                              )
                            }
                          </div>                            
                        </div>
                      </div>
                    </div>
                  </div>
              )
            }              
            </div>
        </div>
        </>
    )
}
