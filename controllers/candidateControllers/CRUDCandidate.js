import { giveCurrentDateTime } from '../../utils/DateAndTime.js';

import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';
import { Users, Candidates, Companies, Jobs,uploadresume } from '../../models/User.js';




export const addCandidate = async (req, res) => {
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
        status:"New"
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
        status:"New"

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
export const editCandidate = async (req, res) => {
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
    status,
    jobId,
    token
  } = req.body;

  const { email } = req.query;

  try {
    // Parsing jobId to ensure it's an integer
    const parsedJobId = parseInt(jobId);

    // Decoding token to get userId
    const userId = decodeTokenAndGetId(token);

    // Retrieving user snapshot

    // Retrieving job snapshot based on jobId
    const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();

    // Check if job exists
    if (jobSnapshot.empty) {
      return res.status(404).send({ message: 'Job not found' });
    }

    // Extracting job data from the snapshot
    const jobData = jobSnapshot.docs[0].data();

    // Check if user is an admin for the specified job
    const isAdmin = jobData.adminGroups && userId in jobData.adminGroups;

    // If not an admin, send a forbidden response
    if (!isAdmin) {
      return res.status(403).send({ message: 'User is not authorized to retrieve this candidate' });
    }

    // Retrieving candidates based on userId and jobId
    const candidatesSnapshot = await Candidates.where('EmailID', '==', email)
      .where('JobId', '==', parsedJobId)
      .get();

    // Check if candidates exist
    if (candidatesSnapshot.empty) {
      return res.status(404).send({ message: 'Candidates not found for the specified criteria' });
    }

    // Assuming there's only one candidate for the specified criteria
    const candidateId = candidatesSnapshot.docs[0].id;

    // Create an object with only defined values
    const updatedCandidateData = {
      ...(Name && { Name }),
      ...(PhoneNumber && { PhoneNumber }),
      ...(EmailID && { EmailID }),
      ...(TotalExperience && { TotalExperience }),
      ...(Education && { Education }),
      ...(NoticePeriod && { NoticePeriod }),
      ...(CurrentLocation && { CurrentLocation }),
      ...(Skills && { Skills }),
      ...(CurrentCTC && { CurrentCTC }),
      ...(ExpectedCTC && { ExpectedCTC }),
      ...(Remarks && { Remarks }),
      ...(status && { status }),
    };

    // Update candidate data with only defined values
    await Candidates.doc(candidateId).update(updatedCandidateData);

    res.status(200).send({ message: 'Candidate information updated successfully' });
  } catch (error) {
    // Handling any errors that occurred during the process
    console.error('Error updating candidate:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
