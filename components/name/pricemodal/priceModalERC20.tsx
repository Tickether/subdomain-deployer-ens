import styles from '@/styles/PriceModal.module.css'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { namehash } from 'viem'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'
import { ENS } from '@/pages/[ensName]'
import { Prices } from '../profile/ether'
import ERC20Contract from '../profile/erc20Contract'
import dropSVG from '@/public/assets/icons/drop.svg'

interface PriceModelProps{
  ENS: ENS
  setOpenModal: (openModal : boolean) => void
  prices: Prices
  ERC20List: string[] | null
  contract : string
}

export default function PriceModalERC20({ENS, setOpenModal, prices, ERC20List, contract} : PriceModelProps) {
    const dec8 = 100000000

    const [newLetterPrices, setNewLetterPrices] = useState<number[]>([0,0,0])
    const [newNumberPrices, setNewNumberPrices] = useState<number[]>([0,0,0,0,0])
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    const [selectedPrice, setSelectedPrice] = useState<string>('numbers')
    const [contractMenu, setContractMenu] = useState<boolean>(false)
    const [selectedContract, setSelectedContract] = useState<string>('')
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
    



    const prepareContractWriteParentNodeLetterFee = usePrepareContractWrite({
        address: `0x${contract.slice(2)}`,
        abi: [
          {
            name: 'setLetterFeesERC20',
            inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "address", name: "erc20Contract", type: "address"}, {internalType: "uint256", name: "threeUpLetterFee_", type: "uint256"}, {internalType: "uint256", name: "fourFiveLetterFee_", type: "uint256"}, {internalType: "uint256", name: "sixDownLetterFee_", type: "uint256" } ],
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'setLetterFeesERC20',
        args: [ (namehash(ENS.name)), (selectedContract), (BigInt(newLetterPrices[0])), (BigInt(newLetterPrices[1])), (BigInt(newLetterPrices[2])) ],
        value: BigInt(0),
        chainId: 5,
      })
      const contractWriteParentNodeLetterFee = useContractWrite(prepareContractWriteParentNodeLetterFee.config)
    /*
      const waitForSetParentNodeLetterFee = useWaitForTransaction({
        hash: contractWriteParentNodeLetterFee.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
      })
    */
      const handleSetParentNodeLetterFee = async () => {
        try {
            contractWriteParentNodeLetterFee.write?.()
        } catch (err) {
            console.log(err)
        }
      }

      const prepareContractWriteParentNodeNumberFee = usePrepareContractWrite({
        address: `0x${contract.slice(2)}`,
        abi: [
          {
            name: 'setNumberFeesERC20',
            inputs: [ {internalType: "bytes32", name: "node", type: "bytes32"}, {internalType: "address", name: "erc20Contract", type: "address"}, {internalType: "uint256", name: "oneNumberFee_", type: "uint256"}, {internalType: "uint256", name: "twoNumberFee_", type: "uint256"}, {internalType: "uint256", name: "threeNumberFee_", type: "uint256" }, {internalType: "uint256", name: "fourNumberFee_", type: "uint256" }, {internalType: "uint256", name: "fiveUpNumberFee_", type: "uint256" } ],
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'setNumberFeesERC20',
        args: [ (namehash(ENS.name)), (selectedContract), (BigInt(newNumberPrices[0])), (BigInt(newNumberPrices[1])), (BigInt(newNumberPrices[2])), (BigInt(newNumberPrices[3])), (BigInt(newNumberPrices[4])) ],
        value: BigInt(0),
        chainId: 5,
      })
      const contractWriteParentNodeNumberFee = useContractWrite(prepareContractWriteParentNodeNumberFee.config)
      /*
      const waitForSetParentNodeNumberFee = useWaitForTransaction({
        hash: contractWriteParentNodeNumberFee.data?.hash,
        confirmations: 2,
        onSuccess() {
        },
      })
      */
    
      const handleSetParentNodeNumberFee = async () => {
        try {
            contractWriteParentNodeNumberFee.write?.()
        } catch (err) {
            console.log(err)
        }
      }
      const regex = /^\d*\.?\d{0,2}$/

      const handlePriceToggle =  () => {
        setPriceMenu(!priceMenu)
      }

      const handleContractToggle =  () => {
        setContractMenu(!contractMenu)
      }

      const handleContractSelect =(ERC20Contract: string, ERC20Symbol: string)=>{
        setSelectedContract(ERC20Contract); 
        setTokenSymbol(ERC20Symbol)
        setContractMenu(false); 
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
                    <div className={styles.priceModalTopOptionDrop}>
                      <div className={styles.priceModalTopOptionDropToggle}>
                        <div
                          onClick={()=> {
                            setSelectedPrice('letters'); 
                            setPriceMenu(false);
                          }}
                          className={styles.priceModalTopOptionDropToggleSpan}
                        >
                          <span>Letters & Numbers</span>
                        </div>
                        
                        <div 
                          onClick={()=> {
                            setSelectedPrice('numbers'); 
                            setPriceMenu(false);
                          }}
                          className={styles.priceModalTopOptionDropToggleSpan}
                        >
                          <span>Numbers Only</span>
                        </div>
                        
                      </div>
                    </div>
                  )
                }
              </div>
              <div onClick={handleContractToggle}>
                <span>Select an ERC20 Token: {selectedContract =='' ? 'ERC20' : tokenSymbol}</span><Image src={dropSVG} alt='' />
              </div>
              <div className={styles.dropOverlay}>
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
            </div>
            <div className={styles.priceModalMid}>
              {
                selectedPrice === 'letters' && (
                  <div className={styles.priceModalMidChild}>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='threedown'>Three Letters & below</label>
                      <NumericFormat 
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='threedown' 
                        name='threedown'
                        placeholder={`$${prices.threeUpLetterFee}`}
                        value={`$${prices.threeUpLetterFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newLetterPrices]
                          updatedPrices[0] = Number(e.value)
                          setNewLetterPrices(updatedPrices)
                        }}
                        
                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='fourfive'>Four & Five Letters </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='fourfive' 
                        name='fourfive' 
                        placeholder={`$${prices.fourFiveLetterFee}`}
                        value={`$${prices.fourFiveLetterFee}`}//{`$${(Number(prices[0])/dec8).toFixed(2)}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newLetterPrices]
                          updatedPrices[1] = Number(e.value)
                          setNewLetterPrices(updatedPrices)
                        }}

                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='sixup'>Six Letters Up </label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='sixup' 
                        name='sixup' 
                        placeholder={`$${prices.sixDownLetterFee}`}
                        value={`$${prices.sixDownLetterFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newLetterPrices]
                          updatedPrices[2] = Number(e.value)
                          setNewLetterPrices(updatedPrices)
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
                      <label htmlFor='one'>One Number</label>
                      <NumericFormat 
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='one' 
                        name='one'
                        placeholder={`$${prices.oneNumberFee}`}
                        value={`$${prices.oneNumberFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newNumberPrices]
                          updatedPrices[0] = Number(e.value)
                          setNewNumberPrices(updatedPrices)
                        }}
                        
                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='two'>Two Number</label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='two' 
                        name='two' 
                        placeholder={`$${prices.twoNumberFee}`}
                        value={`$${prices.twoNumberFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newNumberPrices]
                          updatedPrices[1] = Number(e.value)
                          setNewNumberPrices(updatedPrices)
                        }}

                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='three'>Three Number</label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='three' 
                        name='three' 
                        placeholder={`$${prices.threeNumberFee}`}
                        value={`$${prices.threeNumberFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newNumberPrices]
                          updatedPrices[2] = Number(e.value)
                          setNewNumberPrices(updatedPrices)
                        }}
                        
                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='four'>Four Number</label>
                      <NumericFormat
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='four' 
                        name='four' 
                        placeholder={`$${prices.fourNumberFee}`}
                        value={`$${prices.fourNumberFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newNumberPrices]
                          updatedPrices[3] = Number(e.value)
                          setNewNumberPrices(updatedPrices)
                        }}
                        
                      />
                    </div>
                    <div className={styles.priceModalMidChildInput}>
                      <label htmlFor='five'>Five Number Up </label>
                      <NumericFormat
                        className={styles.priceModalMidChildInput}
                        required
                        thousandSeparator
                        prefix={'$'}
                        id='five' 
                        name='five' 
                        placeholder={`$${prices.fiveUpNumberFee}`}
                        value={`$${prices.fiveUpNumberFee}`}
                        isAllowed={({value}) =>{
                          return regex.test(value)
                        }}
                        onValueChange={(e) => {
                          const updatedPrices = [...newNumberPrices]
                          updatedPrices[4] = Number(e.value)
                          setNewNumberPrices(updatedPrices)
                        }}
                        
                      />
                    </div>
                  </div>
                )
              }
            </div>
            <div className={styles.priceModalDown}>
              <div>
                { selectedPrice === 'numbers' && <button disabled={selectedContract==''} onClick={handleSetParentNodeNumberFee}> Confirm </button>}
                { selectedPrice === 'letters' && <button disabled={selectedContract==''} onClick={handleSetParentNodeLetterFee}> Confirm </button>}
              </div>
            </div> 
          </div>
        </div>
      </div>
    </>
  )
}
