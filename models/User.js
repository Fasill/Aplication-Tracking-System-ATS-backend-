import { getStorage, ref, uploadBytesResumable, getDownloadURL,deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { giveCurrentDateTime } from '../utils/DateAndTime.js';

import admin from "firebase-admin";
import serviceAccount from "../credentials/serviceAccountKey.json"  assert { type: "json" };
import { decodeTokenAndGetId } from '../utils/decodeTokenAndGetId.js';

const firebaseConfig = {
  apiKey: "AIzaSyBcuAGCyGIzzP0Fv39ezoFZx1d-Vk3SHts",
  authDomain: "seventh-vigil-390113.firebaseapp.com",
  projectId: "seventh-vigil-390113",
  storageBucket: "seventh-vigil-390113.appspot.com",
  messagingSenderId: "93104458846",
  appId: "1:93104458846:web:8d1f80d813f017ed9bb8cf",
  measurementId: "G-RYFZMQHPBE",
  credential: admin.credential.cert(serviceAccount),
};

// Initialize admin
admin.initializeApp(firebaseConfig);

// Initialize the regular Firebase app for storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const db = admin.firestore();

export const otpRef  = db.collection("otp");
export const Users = db.collection('User');
export const Candidates = db.collection('Candidates');
export const Companies = db.collection('Companies');
export const Jobs = db.collection('Jobs');
export const Comments = db.collection('Comments');

// Add the uploadresume function
export const uploadresume = async (req) => {
  try {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `Resume/${dateTime}`);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (e) {
    console.error(e);
    throw new Error('Internal server error');
  }
};


export const DeleteCandidate = async (req, res) => {
  const { EmailId, token } = req.query;
  const userId = decodeTokenAndGetId(token);

  try {
    const userSnapshot = await Users.doc(userId).get();
    const userData = userSnapshot.exists ? userSnapshot.data() : null;

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    const candidateSnapshot = await Candidates.where('EmailID', '==', EmailId).get();
    const candidateData = candidateSnapshot.size > 0 ? candidateSnapshot.docs[0].data() : null;

    if (!candidateData) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (candidateData.addedBy !== userId) {
      return res.status(403).json({ error: 'You are not eligible for this action' });
    }

    // Delete the resume from Firestore Storage
    const storageRef = ref(storage, candidateData.resumeUrl);

    // Delete the resume from Firestore Storage
    await deleteObject(storageRef);
    
    // Delete the candidate from Firestore
    await Candidates.doc(candidateSnapshot.docs[0].id).delete();

    res.status(200).json({ success: 'Candidate and associated resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
