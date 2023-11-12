import { Users, Jobs, Companies } from '../../models/User.js';

export const MapUser = async (req, res) => {
    try {
        const { JobId, email, Role } = req.body;
        const parsedJobId = parseInt(JobId);

        // Check if the user with the given email exists
        const userSnapshot = await Users.where('email', '==', email).get();

        if (userSnapshot.empty) {
            // User does not exist
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the job with the given JobId exists
        const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();
        if (jobSnapshot.empty) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Assuming there is only one user with the given email (unique constraint)
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Check if the user is already mapped to the specified job
        const isAlreadyMapped = userData.mappedJobs && userData.mappedJobs.some(mapping => mapping.JobId === parsedJobId);

        if (isAlreadyMapped) {
            return res.status(400).json({ message: 'User is already mapped to this job' });
        }

        // Check if the user has a mappedJobs array
        if (!userData.mappedJobs) {
            // If not, create a new array
            userData.mappedJobs = [];
        }

        // Add the new object to the mappedJobs array
        userData.mappedJobs.push({
            JobId: parsedJobId,
            Role: Role,
            // You can add other properties as needed
        });

        // Update the user document in Firestore
        await userDoc.ref.update(userData);

        return res.status(200).json({ message: 'User mapped successfully' });
    } catch (error) {
        console.error('Error mapping user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const UnmapUser = async (req, res) => {
    try {
        const { JobId, email } = req.query; // Extract parameters from query

        // Parse JobId as an integer
        const parsedJobId = parseInt(JobId);

        if (isNaN(parsedJobId)) {
            
            return res.status(400).json({ message: 'Invalid JobId. Must be an integer.' });
        }

        // Check if the user with the given email exists
        const userSnapshot = await Users.where('email', '==', email).get();

        if (userSnapshot.empty) {
            // User does not exist
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming there is only one user with the given email (unique constraint)
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Check if the user has a mappedJobs array
        if (!userData.mappedJobs) {
            return res.status(404).json({ message: 'User is not mapped to any jobs' });
        }

        // Find the index of the mapping with the specified JobId
        const mappingIndex = userData.mappedJobs.findIndex(mapping => mapping.JobId === parsedJobId);

        if (mappingIndex === -1) {
            return res.status(404).json({ message: 'User is not mapped to the specified job' });
        }

        // Remove the mapping from the mappedJobs array
        userData.mappedJobs.splice(mappingIndex, 1);

        // Update the user document in Firestore
        await userDoc.ref.update(userData);

        return res.status(200).json({ message: 'User unmapped successfully' });
    } catch (error) {
        console.error('Error unmapping user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};