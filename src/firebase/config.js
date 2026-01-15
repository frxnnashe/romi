import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCv4E7vr_hOKbBgTBS-z2oGo7i6T9ggJvE",
  authDomain: "romi-7ccf5.firebaseapp.com",
  projectId: "romi-7ccf5",
  storageBucket: "romi-7ccf5.firebasestorage.app",
  messagingSenderId: "966417260748",
  appId: "1:966417260748:web:bbc41ca574ec8002b2e269"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
