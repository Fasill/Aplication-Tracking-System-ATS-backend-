import { Users, Jobs, Candidates } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const AllCandidates = async (req, res) => {
  try {
    const { token, Name } = req.query;
    const userId = decodeTokenAndGetId(token);

    // Get all jobs where the user has an admin role
    const jobsSnapshot = await Jobs
    .where(`adminGroups.${userId}.Role`, "==", 'Admin')
    .get();
  
    const jobsData = jobsSnapshot.docs.map(doc => doc.data());

    if (jobsData.length === 0) {
      res.status(403).send({ message: "Unauthorized access. User is not an admin for any jobs." });
      return;
    }

    // Filter jobs with the desired adminGroups structure
    const validJobsData = jobsData.filter(job => {
      const adminGroups = job.adminGroups;

      if (adminGroups && typeof adminGroups === 'object') {
        const keys = Object.keys(adminGroups);
        return keys.some(key => adminGroups[key].Role === 'Admin');
      }

      return false;
    });

    if (validJobsData.length === 0) {
      res.status(403).send({ message: "Unauthorized access. User is not an admin for any jobs with the desired adminGroups structure." });
      return;
    }

    // Fetch candidates for each valid job
    const candidatesPromises = validJobsData.map(async job => {
      const jobId = job.id;
      const candidatesIds = job.candidates || [];

      const candidatesPromises = candidatesIds.map(async candidateId => {
        try {
          const candidateDoc = await Candidates.doc(candidateId).get();

          if (candidateDoc.exists) {
            const candidateData = candidateDoc.data();
            
            // Check if Name parameter is provided for filtering
            if (!Name || candidateData.Name.toLowerCase().includes(Name.toLowerCase())) {
              // Add any additional filtering based on the candidate data if needed
              return { candidateId, candidate: candidateData };
            } else {
              return null; // Skip if the name does not match the filter
            }
          } else {
            return null;
          }
        } catch (error) {
          console.error(`Error fetching candidate ${candidateId}:`, error);
          return null;
        }
      });

      const candidatesResults = await Promise.all(candidatesPromises);
      const validCandidatesResults = candidatesResults.filter(result => result !== null);

      return { jobId, [`${job.JobId}`]: validCandidatesResults };
    });

    const results = await Promise.all(candidatesPromises);
    const validResults = results.filter(result => result !== null);

    res.status(200).send({ message: "Candidates retrieved successfully", data: validResults });
  } catch (error) {
    console.error("Error retrieving candidates:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

