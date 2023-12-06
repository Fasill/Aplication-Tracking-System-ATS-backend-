import { Users, Jobs, Candidates } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const RetrieveCandidate = async (req, res) => {
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

export const searchByEmail = async (req, res) => {
    try {
        // Destructure token and EmailID from the request query
        const { EmailID,token } = req.query;

        // Decode the token to get the userId
        const userId = decodeTokenAndGetId(token);

        // Retrieve user data from the Users collection using the userId
        const userSnapshot = await Users.doc(userId).get();

        // Check if the user exists
        if (!userSnapshot.exists) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

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