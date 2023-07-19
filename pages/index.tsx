import styles from '@/styles/Home.module.css'
import Search from '@/components/searches/search'


export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.search}>
            <h1>Your .eth Subdomain Identity</h1>
            <span>Subscribe to your favorite ENS domains, becoming a part of a larger community.</span>
            <Search />
          </div>
        </div>
      </div>

    </>
  )
}
