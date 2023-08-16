import styles from '@/styles/ProfileOptions.module.css'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import editSVG from '@/public/assets/icons/edit.svg'
import Image from 'next/image'
import { useState } from 'react'
import PriceModal from '../pricemodal/priceModal'
import withdrawSVG from '@/public/assets/icons/withdraw.svg'
import { Prices } from './ether'


export default function EtherWL({ENS} : any) {

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
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [priceMenu, setPriceMenu] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedPrice, setSelectedPrice] = useState<string>('numbers');
    const [activeParentNode, setActiveParentNode] = useState<boolean>(false)


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
    return (
        <>
        <div className={styles.container}>
            <div className={styles.wrapper}>
            <div className={styles.profileDown}>
              <div className={styles.profileDownChild}>
                <div className={styles.profileDownPay}>
                  <div className={styles.profileDownPayLeft}>
                    <p>Ethereum + Allowlist</p>
                    {
                      activeParentNode 
                      ? <span className={styles.profileDownPayLeftActive}>Active</span>
                      : <span className={styles.profileDownPayLeftInactive}>Inactive</span>
                    }
                  </div>
                  <div className={styles.profileDownPayRight}>
                    <div className={styles.profileDownPayRightBalance}>
                      <p>ETH</p>
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
                                            {openModal && <PriceModal ENS ={ENS} setOpenModal ={setOpenModal} prices ={prices} />}
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
                                                <div className={styles.profileDownFees}><span>One Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{0} USD</span></div>
                                            </div>
                                        )
                                        :(
                                            <div className={styles.profileDownFeeChild}>
                                                <div className={styles.profileDownFees}><span>One Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Two Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Three Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Four Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Five+ Number Fee</span><span>{0} ETH</span></div>
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
                                                <div className={styles.profileDownFees}><span>Three- Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Four/Five Number Fee</span><span>{0} USD</span></div>
                                                <div className={styles.profileDownFees}><span>Six+ Number Fee</span><span>{0} USD</span></div>
                                                
                                            </div>
                                        )
                                        :(
                                            <div className={styles.profileDownFeeChild}>
                                                <div className={styles.profileDownFees}><span>Three- Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Four/Five Number Fee</span><span>{0} ETH</span></div>
                                                <div className={styles.profileDownFees}><span>Six+ Number Fee</span><span>{0} ETH</span></div>
                                            </div>   
                                        )
                                    }
                                </div>
                              )
                            }
                        </div>
              </div>
            </div>
            </div>
        </div>
        </>
    )
}
