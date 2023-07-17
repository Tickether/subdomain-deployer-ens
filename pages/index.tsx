import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar';
import Search from '@/components/searches/search';


export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.search}>
            <h1>Your .eth Subdomain Identity</h1>
            <span>Your identity across web3, one name for all your crypto addresses, and your decentralised website.</span>
            <Search />
          </div>
        </div>
      </div>

    </>
  )
}
