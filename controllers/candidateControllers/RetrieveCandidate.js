import { Users, Jobs, Candidates } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId';

export const RetrieveCandidate = async (req, res) => {
    try {
        // Destructuring the values from req.query
        const { token, jobId } = req.query;

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

        // Continue with the rest of your code...

        // Sending a successful response with the retrieved candidates
        res.status(200).send({ message: "Candidates retrieved successfully", candidates: candidatesData });

    } catch (error) {
        // Handling any errors that occurred during the process
        console.error("Error retrieving candidate:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};