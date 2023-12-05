import { giveCurrentDateTime } from '../../utils/DateAndTime.js';

import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';
import { Users, Candidates, Companies, Jobs } from '../../models/User.js';




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


