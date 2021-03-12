import {  auth ,firestore } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';



export function useUserData() {
  // the goal : get the current logged in user and the username
  // with useAuthState() we can hook to which current user is signed in
  // also, listening to firestore doc. BUT: we need to have user object, before we can make the reference to firestore doc.
  // 1. fetch user doc from firestore using useAuthState
  // 2. set username, 
  // useeffect is listening, if any changes to user object
  // when user object changes, get the ref to that doc . with the ref we can GET the uid of the user,,
  // if we want listen to the update realtime, instead of GET, we use snapshot to the ref, we made. It returns a call back function, 
  //    1. define variable unsubscribe, to turn off subscription
  //    2. define realtime subscription as unsubscribe variable. (Firebase will return, when it returned = unsubscribed to that data )

  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    // return unsub, no longer needed
    return unsubscribe;
  }, [user])
  

  return { user, username };
}