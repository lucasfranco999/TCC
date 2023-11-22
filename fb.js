import Constants from 'expo-constants';
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import 'firebase/auth';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'


const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId ,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);

export { 
  auth, 
  database,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
};



