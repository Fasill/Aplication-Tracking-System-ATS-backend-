import { giveCurrentDateTime } from '../../utils/DateAndTime.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../../models/User.js';
import { initializeApp } from 'firebase/app';
import { Users, Candidates, Companies,Jobs } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';
import { generateToken } from '../../utils/tokenGenerator.js';

// Initialize Firebase app with the provided config
initializeApp(firebaseConfig);

// Create a storage instance
const storage = getStorage();

const addClient = async (req, res) => {
  const {
    
    Name,
    PhoneNumber,
    EmailID,
    TotalExperience,
    Education,
    NoticePeriod,
    CurrentLocation,
    Skills,
    CurrentCTC,
    ExpectedCTC,
    Remarks,
    jobId,
    
  } = req.body;
  const token  = req.query.token

  try {

    const userId = decodeTokenAndGetId(token);
    const userSnapshot = await Users.doc(userId).get();
    const parsedJobId = parseInt(jobId);
    const jobSnapshot = await Jobs.where("JobId","==",parsedJobId).get()
    if (!jobSnapshot){
      res.status(405).send({message:'Job not Found'})
    }
    const jobData = jobSnapshot.docs[0].data();

    if (!userSnapshot.exists) {
      const compSnapshot = await Companies.doc(userId).get();
      
      if (!compSnapshot.exists) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      const resumeUrl = await uploadresume(req);
      const candidateInfo = {
        Name,
        PhoneNumber,
        EmailID,
        TotalExperience,
        Education,
        NoticePeriod,
        CurrentLocation,
        Skills,
        CurrentCTC,
        ExpectedCTC,
        Remarks,
        JobId:parsedJobId,
        resumeUrl: resumeUrl,
        addedBy: userId,
      };
      const candidateRef = await Candidates.add(candidateInfo);

      await Jobs.doc(jobSnapshot.docs[0].id).update({
        candidates: [...jobData.candidates, candidateRef.id],
      });
    } else {
      const userData = userSnapshot.data();

      if (userData.role !== 'Recruiter' && userData.role !== 'Admin') {
        res.status(403).send({ message: 'You are not able to upload candidates' });
        return;
      }

      const resumeUrl = await uploadresume(req);
      const candidateInfo = {
        Name,
        PhoneNumber,
        EmailID,
        TotalExperience,
        Education,
        NoticePeriod,
        CurrentLocation,
        Skills,
        CurrentCTC,
        ExpectedCTC,
        Remarks,
        resumeUrl: resumeUrl,
        JobId:parsedJobId,
        addedBy: userId,
      };

      await Candidates.add(candidateInfo);
      const candidateRef = await Candidates.add(candidateInfo);

      await Jobs.doc(jobSnapshot.docs[0].id).update({
        candidates: [...jobData.candidates, candidateRef.id],
      });
    }

    res.status(200).send({ message: 'Candidate added successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export default addClient;

const uploadresume = async (req) => {
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
