// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import conf from "../conf/conf";

const firebaseConfig = {
  apiKey: conf.apiKey,
  authDomain: conf.authDomain,
  projectId: conf.projectId,
  storageBucket: conf.storageBucket,
  messagingSenderId: conf.messagingSenderId,
  appId: conf.appId,
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()





// apiKey: "AIzaSyC6a_h50SvyOzcLaEZ0-HQci3ciJ_Aivko",
// authDomain: "reactchat-818b8.firebaseapp.com",
// projectId: "reactchat-818b8",
// storageBucket: "reactchat-818b8.appspot.com",
// messagingSenderId: "610253219706",
// appId: "1:610253219706:web:d0ae48ee8fa9f036bf18c3"