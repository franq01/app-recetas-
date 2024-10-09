import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABlrCzlRM80Fc-8cahsjT2b47e556GlDg",
  authDomain: "recetas-app-8fa74.firebaseapp.com",
  projectId: "recetas-app-8fa74",
  storageBucket: "recetas-app-8fa74.appspot.com",
  messagingSenderId: "657956845706",
  appId: "1:657956845706:web:e2181e9b2006335548d573",
  measurementId: "G-JGPVLSNJ71"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  export { db, auth };