// @desc reusable top Navbar component
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { auth } from '../lib/firebase';



export default function Navbar() {
  // state(consume the context
  const { user, username } = useContext(UserContext);
  
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href='/'>
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
         
        {/* user is signed in and has username, then render signOut button, write post button, and userprofile button*/}
        {username && (
          <>  
            <li className="push-left">
              <button onClick={() => auth.signOut()}>Sign Out</button>
            </li>
            <li >
              <Link href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoUrl || `/hacker.png`}/>
              </Link>
            </li>
          </>
        )}



        {/* user is not signed in OR has not created username */}
        {!username && (
          <>
            <li>
              <Link href="/enter">
                <button className="btn-blue">LogIn</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}