import { Users, Jobs, Candidates } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const RetrieveCandidateUnderAJobForRecruiters = async (req, res) => {
    try {
        // Destructuring the values from req.query
        const { token, jobId } = req.query;
        const { Name } = req.query;

        // Parsing jobId to ensure it's an integer
        const parsedJobId = parseInt(jobId);

        // Decoding token to get userId
        const userId = decodeTokenAndGetId(token);

        // Retrieving user snapshot
        const userSnapshot = await Users.doc(userId).get();

        // Check if user exists
        if (!userSnapshot.exists) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        // Retrieving job snapshot based on jobId
        const jobSnapshot = await Jobs.where("JobId", "==", parsedJobId).get();

        // Check if job exists
        if (jobSnapshot.empty) {
            res.status(404).send({ message: "Job not found" });
            return;
        }

        // Extracting job data from the snapshot
        const jobData = jobSnapshot.docs[0].data();

        // Check if user is an admin for the specified job
        const isAdmin = jobData.adminGroups && userId in jobData.adminGroups;

        // If not an admin, send a forbidden response
        if (!isAdmin) {
            res.status(403).send({ message: "User is not authorized to retrieve this candidate" });
            return;
        }

        // Retrieving candidates based on userId and jobId
        const CandidatesSnapshot = await Candidates.where("addedBy", "==", userId)
            .where("JobId", "==", parsedJobId)
            .get();

        // Check if candidates exist
        if (CandidatesSnapshot.empty) {
            res.status(404).send({ message: "Candidates not found for the specified criteria" });
            return;
        }

        // Extracting candidate data from the snapshot
        const candidatesData = CandidatesSnapshot.docs.map(doc => doc.data());

        // Check if req.query.Name is empty
        if (Name === '') {
            // If empty, no filtering is required, return all candidates
            res.status(200).send({ message: "Candidates retrieved successfully", candidates: candidatesData });
            return;
        }

        // Filtering candidates based on the provided 'Name'
        const filteredCandidates = candidatesData.filter(candidate => {
            const candidateName = candidate.Name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            const providedName = Name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            return candidateName.startsWith(providedName) || candidateName === providedName;
        });

        // Sending a successful response with the filtered candidates
        res.status(200).send({ message: "Candidates retrieved successfully", candidates: filteredCandidates });

    } catch (error) {
        // Handling any errors that occurred during the process
        console.error("Error retrieving candidate:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const RetrieveCandidateForAdmins = async (req, res) => {
    try {
        // Destructuring the values from req.query
        const { token, jobId } = req.query;
        const { Name } = req.query;

        // Parsing jobId to ensure it's an integer
        const parsedJobId = parseInt(jobId);

        // Decoding token to get userId
        const userId = decodeTokenAndGetId(token);

     
        

        // Retrieving job snapshot based on jobId
        const jobSnapshot = await Jobs.where("JobId", "==", parsedJobId).get();

        // Check if job exists
        if (jobSnapshot.empty) {
            res.status(404).send({ message: "Job not found" });
            return;
        }

        // Extracting job data from the snapshot
        const jobData = jobSnapshot.docs[0].data();

        // Check if user is an admin for the specified job
        const isAdmin = jobData.adminGroups && userId in jobData.adminGroups;

        // If not an admin, send a forbidden response
        if (!isAdmin) {
            res.status(403).send({ message: "User is not authorized to retrieve this candidate" });
            return;
        }

        // Retrieving candidates based on userId and jobId
        const CandidatesSnapshot = await Candidates
            .where("addedBy","==",userId)
            .where("JobId", "==", parsedJobId)
            .get();

        // Check if candidates exist
        if (CandidatesSnapshot.empty) {
            res.status(404).send({ message: "Candidates not found for the specified criteria" });
            return;
        }

        // Extracting candidate data from the snapshot
        const candidatesData = CandidatesSnapshot.docs.map(doc => doc.data());

        // Check if req.query.Name is empty
        if (Name === '') {
            // If empty, no filtering is required, return all candidates
            res.status(200).send({ message: "Candidates retrieved successfully", candidates: candidatesData });
            return;
        }

        // Filtering candidates based on the provided 'Name'
        const filteredCandidates = candidatesData.filter(candidate => {
            const candidateName = candidate.Name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            const providedName = Name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
            return candidateName.startsWith(providedName) || candidateName === providedName;
        });

        // Sending a successful response with the filtered candidates
        res.status(200).send({ message: "Candidates retrieved successfully", candidates: filteredCandidates });

    } catch (error) {
        // Handling any errors that occurred during the process
        console.error("Error retrieving candidate:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const searchByEmail = async (req, res) => {
    try {
        // Destructure token and EmailID from the request query
        const { EmailID,token } = req.query;

        // Decode the token to get the userId
        const userId = decodeTokenAndGetId(token);

        // Retrieve user data from the Users collection using the userId
        // const userSnapshot = await Users.doc(userId).get();

        // // Check if the user exists
        // if (!userSnapshot.exists) {
        //     res.status(404).send({ message: 'User not found' });
        //     return;
        // }

        // Query the Candidates collection for candidates with the specified EmailID
        const candidatesSnapshot = await Candidates.where("EmailID", "==", EmailID).get();

        // Check if candidates were found for the specified criteria
        if (candidatesSnapshot.empty) {
            res.status(404).send({ message: "Candidates not found for the specified criteria" });
            return;
        }

        // Extract data from the Candidates snapshot
        const candidatesData = candidatesSnapshot.docs[0].data()

        // Return the candidatesData in the response with a 200 OK status
        return res.status(200).send({ candidatesData });

    } catch (error) {
        // Handle errors by logging and sending a generic error response
        console.error("Error retrieving candidate:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const RetrieveAllCandidatesForRecruiters = async (req, res) => {
    try {
        const { token, Name } = req.query;
        const userId = decodeTokenAndGetId(token);
        
        const CandidatesSnapshot = await Candidates.where("addedBy", "==", userId).get()

        if (CandidatesSnapshot.empty) {
            return res.status(404).send({ message: "Candidates not found for the specified criteria" });
        }

        const candidatesData = CandidatesSnapshot.docs.map(doc => doc.data());

        if (Name === '') {
            return res.status(200).send({ message: "Candidates retrieved successfully", candidates: candidatesData });
        }

        const filteredCandidates = candidatesData.filter(candidate => {
            const candidateName = candidate.Name.toLowerCase();
            const providedName = Name.toLowerCase();
            return candidateName.startsWith(providedName) || candidateName === providedName;
        });

        return res.status(200).send({ message: "Candidates retrieved successfully", candidates: filteredCandidates });

    } catch (error) {
        console.error("Error retrieving candidate:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
export const RetrieveCandidatesForAdminOrRecruiter = async (req, res) => {
    try {
      const { token, Name } = req.query;
      const userId = decodeTokenAndGetId(token);
  
      // Get all jobs where the user has an admin or recruiter role
      const jobsSnapshot = await Jobs
        .where(`adminGroups.${userId}.Role`, "in", ['Admin', 'Recruiter'])
        .get();
  
      const jobsData = jobsSnapshot.docs.map(doc => doc.data());
  
      if (jobsData.length === 0) {
        res.status(403).send({ message: "Unauthorized access. User is not an admin or recruiter for any jobs." });
        return;
      }
  
      // Common logic for both Admin and Recruiter
      const fetchCandidates = async (candidateIds) => {
        const candidatesPromises = candidateIds.map(async candidateId => {
          try {
            const candidateDoc = await Candidates.doc(candidateId).get();
            if (candidateDoc.exists) {
              const candidateData = candidateDoc.data();
              if (!Name || candidateData.Name.toLowerCase().includes(Name.toLowerCase())) {
                return { ...candidateData, id: candidateId }; // Flatten the structure
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
        return candidatesResults.filter(result => result !== null);
      };
  
      // Fetch candidates based on user role
      const candidatesPromises = jobsData.map(async job => {
        const jobId = job.id;
  
        if (job.adminGroups[userId].Role === 'Admin') {
          // User is an Admin, retrieve all candidates for the job
          const candidatesIds = job.candidates || [];
          const candidates = await fetchCandidates(candidatesIds);
          return candidates.map(candidate => ({ ...candidate, jobId }));
        } else if (job.adminGroups[userId].Role === 'Recruiter') {
          // User is a Recruiter, retrieve candidates added by the user
          const candidatesSnapshot = await Candidates.where("addedBy", "==", userId).get();
  
          if (candidatesSnapshot.empty) {
            return [];
          }
  
          const candidatesData = candidatesSnapshot.docs.map(doc => doc.data());
  
          if (Name === '') {
            return candidatesData.map(candidate => ({ ...candidate, jobId }));
          }
  
          const filteredCandidates = candidatesData.filter(candidate => {
            const candidateName = candidate.Name.toLowerCase();
            const providedName = Name.toLowerCase();
            return candidateName.startsWith(providedName) || candidateName === providedName;
          });
  
          return filteredCandidates.map(candidate => ({ ...candidate, jobId }));
        }
      });
  
      const results = await Promise.all(candidatesPromises);
      const flattenedResults = results.flat();
  
      res.status(200).send({ message: "Candidates retrieved successfully", data: { candidates: flattenedResults } });
    } catch (error) {
      console.error("Error retrieving candidates:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
  