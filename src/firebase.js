import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCANIk55JW8Fyfk8a9TSU8_4UK02I4hAfE",
    authDomain: "ai-interviewer-86ae7.firebaseapp.com",
    projectId: "ai-interviewer-86ae7",
    storageBucket: "ai-interviewer-86ae7.firebasestorage.app",
    messagingSenderId: "573697342943",
    appId: "1:573697342943:web:58df0e300677267859d86a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
