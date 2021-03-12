import Head from 'next/head'
import Loader from '../components/loader'
import styles from '../styles/Home.module.css'
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('hello from toast!')}>
        TOAAAST ME
     </button>
    </div>
  )
}
