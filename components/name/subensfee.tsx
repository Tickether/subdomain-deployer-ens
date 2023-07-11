import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { namehash, formatGwei } from 'viem'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { NumericFormat } from 'react-number-format'

export default function SubEnsFee({setOpen, ENS} : any) {

    const dec8 = 100000000

    const [newPrices, setNewPrices] = useState<number[]>([0,0,0])
    const [prices, setPrices] = useState([BigInt(0), BigInt(0), BigInt(0)])
     
    console.log(prices)

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
        args: [(namehash(ENS))],
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
        args: [(namehash(ENS))],
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
        args: [(namehash(ENS))],
        chainId: 5,
        watch: true,
      })
      useEffect(() => {
        let prices_ : bigint[] = []
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
      console.log(newPrices[0], newPrices[1], newPrices[2])

    const prepareContractWriteParentNodeFee = usePrepareContractWrite({
        address: '0x229C0715e70741F854C299913C2446eb4400e76C',
        abi: [
          {
            name: 'setLetterFees',
            inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "uint256", name: "threeUpLetterFee_", type: "uint256"}, {internalType: "uint256", name: "fourFiveLetterFee_", type: "uint256"}, {internalType: "uint256", name: "sixDownLetterFee_", type: "uint256" } ],
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'setLetterFees',
        args: [ (namehash(ENS)), (BigInt(newPrices[0]*dec8)), (BigInt(newPrices[1]*dec8)), (BigInt(newPrices[2]*dec8)) ],
        value: BigInt(0),
        chainId: 5,
      })
      const contractWriteParentNodeFee = useContractWrite(prepareContractWriteParentNodeFee.config)
    
      const waitForSetParentNodeFee = useWaitForTransaction({
        hash: contractWriteParentNodeFee.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
      })
    
      const handleSetParentNodeFee = async () => {
        try {
            await contractWriteParentNodeFee.writeAsync?.()
        } catch (err) {
            console.log(err)
        }
      }
      
      
   
      const regex = /^\d*\.?\d{0,2}$/
    return (
        <>

            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.search}>
                    <p>Set Prices in Dollars for your Subdomain or leave as is for current Subdomains Fees</p>
                              <div className={styles.nameOwnerActiveParentNodeFeeSet}>
                                  <label htmlFor='three'>Three Letter & below</label>
                                  <NumericFormat 
                                    required
                                    thousandSeparator
                                    prefix={'$'}
                                    id='three' 
                                    name='three'
                                    placeholder={`$${(Number(prices[0])/dec8).toFixed(2)}`}
                                    value={(newPrices[0])}
                                    isAllowed={({value}) =>{
                                      return regex.test(value)
                                    }}
                                    onValueChange={(e) => {
                                      const updatedPrices = [...newPrices]
                                      updatedPrices[0] = Number(e.value)
                                      setNewPrices(updatedPrices)
                                    }}
                                    
                                  />
                                  <label htmlFor='fourfive'>Four & Five Letter </label>
                                  <NumericFormat
                                    required
                                    thousandSeparator
                                    prefix={'$'}
                                    id='fourfive' 
                                    name='fourfive' 
                                    placeholder={`$${(Number(prices[1])/dec8).toFixed(2)}`}
                                    value={(newPrices[1])}
                                    isAllowed={({value}) =>{
                                      return regex.test(value)
                                    }}
                                    onValueChange={(e) => {
                                      const updatedPrices = [...newPrices]
                                      updatedPrices[1] = Number(e.value)
                                      setNewPrices(updatedPrices)
                                    }}
      
                                  />
                                  <label htmlFor='six'>Six Letter Up </label>
                                  <NumericFormat
                                    required
                                    thousandSeparator
                                    prefix={'$'}
                                    id='six' 
                                    name='six' 
                                    placeholder={`$${(Number(prices[2])/dec8).toFixed(2)}`}
                                    value={(newPrices[2])}
                                    isAllowed={({value}) =>{
                                      return regex.test(value)
                                    }}
                                    onValueChange={(e) => {
                                      const updatedPrices = [...newPrices]
                                      updatedPrices[2] = Number(e.value)
                                      setNewPrices(updatedPrices)
                                    }}
                                    
                                  />
                              </div>
                              <button onClick={() => setOpen(false)}>cancel</button>
                              <button onClick={handleSetParentNodeFee}> Set Fees </button>
                              
                    </div>
                </div>
            </div>

        </>
    )
}
