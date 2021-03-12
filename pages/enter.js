import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';


export default function EnterPage({ props }) {
  const { user, username } = useContext(UserContext);
  // use case
  // 1. user signed out => render SignInButton
  // 2. user signed in, but missing username => render Username form
  // 3. user signed in, has username => render SignOutButton

  return (
    <main>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton/>
        : <SignInButton/>
    }
    </main>
  )
}


// Sign in with Google Button
function SignInButton() {
  // todo :trycatch 
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <>
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={`/google.png`} /> Sign in with Google
      </button>
      <button onClick={() => auth.signInAnonymously()}>
        Sign In Anonymously
      </button>
    </>
  )
}

// Sign out button
function SignOutButton() {
  return (
    <button onClick={ () => auth.signOut() } >Sign Out</button>
  )
}





// Goal : 1. we want to have the uniqueness of the data.( sol: using valid state.  reverse mapping)
// 2. reduce cost of read, everytime user type-in onChange(sol: debounce)
//  2.1. we want to pull the trigger, if the formValue, is set. (sol: onChange)
function UsernameForm() {
  const[formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  
  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/; //only valid character
    
    // only set form value if length is < 3 OR it passes regex,
    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsLoading(true);
      setIsValid(false);
    }
  }

  // use effect, and use the form value as the dependencies
  useEffect(() => {
      checkUsername(formValue);
  }, [formValue]);

  // hit the database for username match after each debounced change
  // useCallback is required for debounce to work, anytime react rerenders react create object(not debounced),
  const checkUsername = useCallback(
    debounce(async (username) => {
    if (username.length >= 3) {
      const ref = firestore.doc(`/usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed!');
      setIsValid(!exists);
      setIsLoading(false);
     }
    }, 500),
    []);

  const onSubmit = async(e) => {
    e.preventDefault();

    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // set them into db at the same time
    const batch = firestore.batch();
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  }
  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="username" value={formValue} onChange={onChange} />

          <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>

          <button type="submit" className="btn-green" disabled={!isValid}></button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available</p>
  } else if (username && !isValid) {
    return <p className="text-danger">{username} is taken</p>
  } else {
    return <p></p>
  }
}