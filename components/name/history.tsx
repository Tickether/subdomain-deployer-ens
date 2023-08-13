import { ENS } from '@/pages/[ensName]'
import styles from '@/styles/History.module.css'

interface ENSprop {
  ENS: ENS,
}
export default function History({ENS} : ENSprop) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.search}>

          </div>
        </div>
      </div>

    </>
  )
}