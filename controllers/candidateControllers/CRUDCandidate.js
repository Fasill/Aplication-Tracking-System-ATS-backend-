import { ref, uploadBytesResumable, getDownloadURL ,deleteObject} from 'firebase/storage';
import { giveCurrentDateTime } from '../../utils/DateAndTime.js';

import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';
import { Users, Candidates, Companies, Jobs,storage } from '../../models/User.js';




export const addClient = async (req, res) => {
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
  const token = req.query.token;
  console.log(req.body)
  try {
    const userId = decodeTokenAndGetId(token);
    const userSnapshot = await Users.doc(userId).get();
    const parsedJobId = parseInt(jobId);
    console.log(parsedJobId)
    const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();

    if (!jobSnapshot.docs.length) {
      res.status(405).send({ message: 'Job not Found' });
      return;
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
        JobId: parsedJobId,
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
        JobId: parsedJobId,
        addedBy: userId,
      };

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
