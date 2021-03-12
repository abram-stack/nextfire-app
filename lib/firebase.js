import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLVNp4z3HIu5MhcTFNNoS_0jlgp4XQUvw",
  authDomain: "nextfire-7ab83.firebaseapp.com",
  projectId: "nextfire-7ab83",
  storageBucket: "nextfire-7ab83.appspot.com",
  messagingSenderId: "119881968779",
  appId: "1:119881968779:web:47c3b9959b88a58bbf388e",
  measurementId: "G-3YLHX2S8PN"
};

// init app, which connects our app to the cloud
// only if the app is 0, next will try to run more than once in dev (sometime)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// export the actual sdk, we want to work with
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();


export const firestore = firebase.firestore();
export const storage = firebase.storage();