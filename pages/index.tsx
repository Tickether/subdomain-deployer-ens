import styles from '@/styles/Home.module.css'
import Navbar from '@/components/navbar';
import Search from '@/components/searches/search';


export default function Home() {
  return (
    <>
      <Navbar/>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p>Your .eth Subdomain Identity</p>
          <Search />
        </div>
      </div>

    </>
  )
}
