import { ENS } from '@/pages/[ensName]'
import styles from '@/styles/AllowlistModal.module.css'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'

interface AllowlistModalProps{
    ENS: ENS
    setOpenAllowlistModal: (openAllowlistModal : boolean) => void

  }

export default function AllowlistModal({ENS, setOpenAllowlistModal} : AllowlistModalProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
            <div onClick={() => setOpenAllowlistModal(false)} className={styles.close}>
                <Image src={closeSVG} alt='' />
            </div>
            <div className={styles.allowlistModal}>
            
            </div>
        </div>
      </div>

    </>
  )
}
