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
