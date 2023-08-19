import { ENS } from '@/pages/[ensName]'
import styles from '@/styles/AddressModal.module.css'
import closeSVG from '@/public/assets/icons/close.svg'
import Image from 'next/image'

interface AddressModalProps{
    ENS: ENS
    setOpenAddressModal: (openAddressModal : boolean) => void

  }

export default function AddressModal({ENS, setOpenAddressModal} : AddressModalProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
            <div onClick={() => setOpenAddressModal(false)} className={styles.close}>
                <Image src={closeSVG} alt='' />
            </div>
            <div className={styles.addressModal}>
            
            </div>
        </div>
      </div>

    </>
  )
}
