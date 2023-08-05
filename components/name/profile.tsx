import styles from '@/styles/Profile.module.css'


export default function Profile({ENS} : any) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.profile}>
            <div className={styles.profileTop}>
              <div className={styles.profileTopChild}>

              </div>
            </div>
            <div className={styles.profileMid}>
              <div className={styles.profileMidChild}>

              </div>
            </div>
            <div className={styles.profileDown}>
              <div className={styles.profileDownChild}>

              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
