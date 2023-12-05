import admin from "firebase-admin"

import serviceAccount from "../credentials/serviceAccountKey.json"  assert { type: "json" };
// import * as serviceAccountKey from './serviceAccountKey.json';

export const firebaseConfig = {
  apiKey: "AIzaSyBcuAGCyGIzzP0Fv39ezoFZx1d-Vk3SHts",
  authDomain: "seventh-vigil-390113.firebaseapp.com",
  projectId: "seventh-vigil-390113",
  storageBucket: "seventh-vigil-390113.appspot.com",
  messagingSenderId: "93104458846",
  appId: "1:93104458846:web:8d1f80d813f017ed9bb8cf",
  measurementId: "G-RYFZMQHPBE",
  credential: admin.credential.cert(serviceAccount)
};
admin.initializeApp(firebaseConfig);

const db = admin.firestore();




export const otpRef  = db.collection("otp");
export const Users = db.collection('User');
export const Candidates = db.collection('Candidates');

export const Companies = db.collection('Companies');
export const Jobs = db.collection('Jobs');
export const Comments = db.collection('Comments');
