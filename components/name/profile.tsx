import styles from '@/styles/Profile.module.css'
import { useState } from 'react'
import editSVG from '@/public/assets/icons/edit.svg'
import linkSVG from '@/public/assets/icons/link.svg'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import drop_whiteSVG from '@/public/assets/icons/drop-white.svg'
import Image from 'next/image'



export default function Profile({ENS} : any) {

  const [showUSD, setShowUSD] = useState<boolean>(false)
  const [priceMenu, setPriceMenu] = useState<boolean>(false)
  const [payMenu, setPayMenu] = useState<boolean>(false)

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

  const handlePayToggle =  () => {
    setPayMenu(!payMenu)
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.profile}>
            <div className={styles.profileTop}>
              <div className={styles.profileTopChild}>
                <div className={styles.profileTopChildLeft}>
                  <p>Total Balance</p>
                </div>
                <div className={styles.profileTopChildRight}>
                  <p>ETH</p>
                  <p>USD</p>
                </div>
              </div>
            </div>
            <div className={styles.profileMid}>
              <div className={styles.profileMidChild}>
                <div className={styles.profileMidChildLeft}>
                  <div>
                    <p>Customize the payment options for subnames</p>
                  </div>
                  <div className={styles.profileMidChildLink}>
                    <p>Learn about subnames payment setup</p>
                    <Image src={linkSVG} alt='' />
                  </div>
                </div>
                <div className={styles.profileMidChildRight}>
                  <div className={styles.profileMidChildRightDrop}>
                    <p>Ethereum</p>
                    <Image src={drop_whiteSVG} alt='' />
                  </div>
                </div>
                {/**
                <div onClick={handlePayToggle} className={styles.profileDownSubChildOptionToggle}>
                  <span>Ethereum</span>
                  <span>ERC20</span>
                  <span>ETH + Allowlist</span>
                  <span>ERC20 + Allowlist</span>
                </div>
                 */}
              </div>
            </div>
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
      </div>

    </>
  )
}
