import styles from '@/styles/PriceModal.module.css'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { namehash } from 'viem'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'



export default function PriceModal({ENS, setOpenModal} : any) {
    const dec8 = 100000000

    const [newPrices, setNewPrices] = useState<number[]>([0,0,0])
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    //const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedPrice, setSelectedPrice] = useState<string>('numbers');
    



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

      const handlePriceToggle =  () => {
        setPriceMenu(!priceMenu)
      }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div onClick={() => setOpenModal(false)} className={styles.close}>
            <Image src={closeSVG} alt='' />
          </div>
          <div className={styles.priceModal}>
            <div className={styles.priceModalTop}>
              <div>
                <h1>Set Subname Prices</h1>
              </div>
              <div onClick={handlePriceToggle} className={styles.priceModalTopOption}>
                { selectedPrice === 'numbers' && <p>Numbers Only</p>}
                { selectedPrice === 'letters' && <p>Letters & Numbers</p>}
                <Image src={drop_blueSVG} alt='' />
              </div>
              <div className={styles.dropOverlay}>
                {
                  priceMenu && (
                    <div className={styles.profileDownSubChildOption}>
                      <div className={styles.profileDownSubChildOptionToggle}>
                        <span
                          onClick={()=> {
                            setSelectedPrice('letters'); 
                            setPriceMenu(false);
                          }}
                        >
                          Letters & Numbers
                        </span>
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
                  )
                }
              </div>
            </div>
            <div className={styles.priceModalMid}>
              {
                selectedPrice === 'letters' && (
                  <div className={styles.priceModalMidChild}>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='three'>Three Letter & below</label>
                      <NumericFormat 
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='three' 
                        name='three'
                        placeholder={`$${(Number(newPrices[0])/dec8).toFixed(2)}`}
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
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='fourfive'>Four & Five Letter </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='fourfive' 
                        name='fourfive' 
                        placeholder={`$${(Number(newPrices[1])/dec8).toFixed(2)}`}
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
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='six'>Six Letter Up </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='six' 
                        name='six' 
                        placeholder={`$${(Number(newPrices[2])/dec8).toFixed(2)}`}
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
                  </div>
                )
              }
              {
                selectedPrice === 'numbers' && (
                  <div className={styles.priceModalMidChild}>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='three'>Three Letter & below</label>
                      <NumericFormat 
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='three' 
                        name='three'
                        placeholder={`$${(Number(newPrices[0])/dec8).toFixed(2)}`}
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
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='fourfive'>Four & Five Letter </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='fourfive' 
                        name='fourfive' 
                        placeholder={`$${(Number(newPrices[1])/dec8).toFixed(2)}`}
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
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='six'>Six Letter Up </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='six' 
                        name='six' 
                        placeholder={`$${(Number(newPrices[2])/dec8).toFixed(2)}`}
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
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='six'>Six Letter Up </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='six' 
                        name='six' 
                        placeholder={`$${(Number(newPrices[2])/dec8).toFixed(2)}`}
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
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='six'>Six Letter Up </label>
                      <NumericFormat
                        className={styles.priceModalMidChildInput}
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='six' 
                        name='six' 
                        placeholder={`$${(Number(newPrices[2])/dec8).toFixed(2)}`}
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
                  </div>
                )
              }
            </div>
            <div className={styles.priceModalDown}>
              <div>
                <button onClick={handleSetParentNodeFee}> Confirm </button>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </>
  )
}
