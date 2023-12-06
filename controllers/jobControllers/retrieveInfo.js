import { Jobs, Users, Companies } from '../../models/User.js'; 
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const myJobs = async (req, res) => {
    const { token } = req.query;
    const id = decodeTokenAndGetId(token);
    console.log("id", id);

    try {
        const userSnapshot = await Jobs.where("addedBy", "==", id).get();

        const snapshotData = [];
        userSnapshot.forEach((doc) => {
            snapshotData.push(doc.data());
        });

        // Send the snapshot data as the response
        res.json(snapshotData);
    } catch (error) {
        console.error("Error fetching snapshots:", error);
        res.status(500).json({ error: "An error occurred while fetching snapshots" });
    }
};

export const detail = async (req, res) => {
    try {
        var { JobId } = req.query;
        var JobId = parseInt(JobId,10)
        const jobSnapshot = await Jobs.where('JobId', '==', JobId).get();

        // Check if the job exists
        if (jobSnapshot.empty) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Assuming there's only one job with a specific JobId
        const jobData = jobSnapshot.docs[0].data();

        // You can now use jobData to send the job details in the response
        return res.status(200).json({ job: jobData });
    } catch (error) {
        console.error('Error getting job details:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const MappedJobs = async (req, res) => {
    try {
      const { token } = req.query;
      const id = decodeTokenAndGetId(token);
  
      // Assuming 'Users' is the Firestore collection for users
      const userDoc = await Users.doc(id).get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userData = userDoc.data();
  
      // Extract JobIds from the mappedJobs array
      const jobIds = userData.mappedJobs.map((mappedJob) => mappedJob.JobId);
  
      // Assuming 'Jobs' is the Firestore collection for jobs
      const jobsQuerySnapshot = await Jobs.where('JobId', 'in', jobIds).get();
  
      const jobs = [];
      jobsQuerySnapshot.forEach((jobDoc) => {
        jobs.push(jobDoc.data());
      });
  
      return res.status(200).json(jobs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const AcceptedJobs = async(req,res)=>{
  try {
    const { token } = req.query;
    const id = decodeTokenAndGetId(token);

    // Assuming 'Users' is the Firestore collection for users
    const userDoc = await Users.doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();

    // Extract JobIds from the AcceptedJobs array
    const jobIds = userData.AcceptedJobs.map((AcceptedJobs) => AcceptedJobs.JobId);

    // Assuming 'Jobs' is the Firestore collection for jobs
    const jobsQuerySnapshot = await Jobs.where('JobId', 'in', jobIds).get();

    const jobs = [];
    jobsQuerySnapshot.forEach((jobDoc) => {
      jobs.push(jobDoc.data());
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const retrieveUserRole = async (req, res) => {
  try {
    // Extract token and JobId from the request query parameters
    const { token } = req.query;
    let { JobId } = req.query;

    // Convert JobId to an integer
    JobId = parseInt(JobId, 10);


    // Decode token to get userId
    const userId = decodeTokenAndGetId(token);

    // Query Firestore for job data with the specified JobId
    const jobSnapshot = await Jobs.where('JobId', '==', JobId).get();

    // Check if the job was not found
    if (jobSnapshot.empty) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Extract job data from the first document in the result set
    const jobData = jobSnapshot.docs[0].data();

    // Extract the user role from the adminGroups based on userId
    const userRole = jobData.adminGroups[userId]?.Role;

    // Check if the user has a role in the adminGroups
    if (!userRole) {
      return res.status(404).json({ message: 'User not found in adminGroups' });
    }

    // Return the user role in the response
    return res.status(200).json({ role: userRole });
  } catch (error) {
    // Handle internal server error
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
