import styles from '@/styles/Profile.module.css'
import { useState } from 'react'
import editSVG from '@/public/assets/icons/edit.svg'
import linkSVG from '@/public/assets/icons/link.svg'
import drop_blueSVG from '@/public/assets/icons/drop-blue.svg'
import drop_whiteSVG from '@/public/assets/icons/drop-white.svg'
import Image from 'next/image'
import Ether from '../profile/ether'
import EtherWL from '../profile/etherWL'
import Erc20 from '../profile/erc20'
import Erc20WL from '../profile/erc20WL'



export default function Profile({ENS} : any) {

  const [showUSD, setShowUSD] = useState<boolean>(false)
  const [payMenu, setPayMenu] = useState<boolean>(false)
  const [selectedPayment, setSelectedPayment] = useState<string>('ether');

  const handleToggle =  () => {
    if(showUSD){
        setShowUSD(false)
    } else {
        setShowUSD(true)
    }
    
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
                  <div onClick={handlePayToggle} className={styles.profileMidChildRightDrop}>
                    { selectedPayment == 'ether' &&  <p>Ethereum</p>}
                    { selectedPayment == 'erc20' &&  <p>ERC20</p>}
                    { selectedPayment == 'etherWL' &&  <p>ETH + WL</p>}
                    { selectedPayment == 'erc20WL' &&  <p>ERC20 + WL</p>}
                    <Image src={drop_whiteSVG} alt='' />
                  </div>
                  <div className={styles.dropOverlay} >
              { payMenu &&  (
                <div className={styles.profileMidSubChildOption}>
                  <div className={styles.profileMidSubChildOptionToggle}>
                    <div className={styles.profileMidSubChildOptionToggleSpan}>
                      <span 
                        onClick={()=> {
                          setSelectedPayment('ether'); 
                          setPayMenu(false);
                        }}
                      >
                        Ethereum
                      </span>
                    </div>
                    <div className={styles.profileMidSubChildOptionToggleSpan}>
                      <span 
                        onClick={()=> {
                          setSelectedPayment('erc20'); 
                          setPayMenu(false);
                        }}
                      >
                        ERC20
                      </span>
                    </div>
                    <div className={styles.profileMidSubChildOptionToggleSpan}>
                      <span 
                        onClick={()=> {
                          setSelectedPayment('etherWL'); 
                          setPayMenu(false);
                        }}
                      >
                        ETH + Allowlist
                      </span>
                    </div>
                    <div className={styles.profileMidSubChildOptionToggleSpan}>
                      <span 
                        onClick={()=> {
                          setSelectedPayment('erc20WL'); 
                          setPayMenu(false);
                        }}
                      >
                        ERC20 + Allowlist
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
                </div>
              </div>
            </div>
            <div className={styles.profileDown}>
                {selectedPayment == 'ether' && (
                  <Ether
                      ENS={ENS}
                  />
                )}
                {selectedPayment == 'erc20' && (
                  <Erc20
                      ENS={ENS}
                  />
                )}
                {selectedPayment == 'etherWL' && (
                  <EtherWL
                      ENS={ENS}
                  />
                )}
                {selectedPayment == 'erc20WL' && (
                  <Erc20WL
                      ENS={ENS}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
