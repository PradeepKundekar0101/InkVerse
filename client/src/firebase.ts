
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import {firebaseConfigObject} from "./conf/conf"
const {apiKey,appId,authDomain,projectId,storageBucket,measurementId,messagingSenderId} = firebaseConfigObject

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const storage = getStorage(app);
export {auth,provider,storage};