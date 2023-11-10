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
}


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