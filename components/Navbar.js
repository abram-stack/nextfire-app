// @desc reusable top Navbar component
import Link from 'next/link'

export default function Navbar() {
  // state(will update)
  const user = null;
  const username = null;
  
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href='/'>
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
         
        {/* user is signed in and has username, then render write post, and userprofile*/}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoUrl}/>
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