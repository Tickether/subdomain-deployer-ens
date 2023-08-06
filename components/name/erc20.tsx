import styles from '@/styles/Home.module.css'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import editSVG from '@/public/assets/icons/edit.svg'
import Image from 'next/image'
import { useState } from 'react'


export default function Erc20({ENS} : any) {

    const [showUSD, setShowUSD] = useState<boolean>(false)
    const [priceMenu, setPriceMenu] = useState<boolean>(false)


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
                  <div>
                    <p>Ethereum</p>
                    <span></span>
                  </div>
                  <div>
                    <p>USD</p>
                    <span></span>
                  </div>
                </div>
                <div className={styles.profileDownSubFee}>
                            <div className={styles.profileDownSub}>
                                <div className={styles.profileDownSubChild}>
                                        <div className={styles.profileDownSubChildTitle}>
                                            <div className={styles.profileDownSubChildFee}>
                                              <p>Subname Prices</p>
                                              <Image src={editSVG} alt='' />
                                            </div>
                                            <div className={styles.profileDownSubChildOption}>
                                              <p>Numbers Only</p>
                                              <Image src={drop_blueSVG} alt='' />
                                            </div>
                                            {/**
                                            <div onClick={handlePriceToggle} className={styles.profileDownSubChildOptionToggle}>
                                              <span>Letters & Numbers</span>
                                              <span>Numbers Only</span>
                                            </div>
                                            */}
                                            
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
                        </div>
              </div>
            </div>
                </div>
            </div>
        </>
    )
}
