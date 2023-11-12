import { Users, Jobs, Companies } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const AcceptJob = async (req, res) => {
    const { JobId, token } = req.body;

    const userId = await decodeTokenAndGetId(token);

    try {
        const jobSnapshot = await Jobs.where("JobId", "==", JobId).get();

        if (jobSnapshot.empty) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const userSnapshot = await Users.doc(userId).get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userSnapshot.data();

        if (!userData.AcceptedJobs) {
            userData.AcceptedJobs = [];
        }

        if (!userData.AcceptedJobs.some(job => job.JobId === JobId)) {
            // Push an object with JobId and Role to the AcceptedJobs array
            const role = "admin"; // You may need to define the role based on your application logic
            userData.AcceptedJobs.push({ JobId, Role: role });

            await Users.doc(userId).update({ AcceptedJobs: userData.AcceptedJobs });

            // Remove the job with the specified JobId from the mappedJobs array
            userData.mappedJobs = userData.mappedJobs.filter(job => job.JobId !== JobId);
            await Users.doc(userId).update({ mappedJobs: userData.mappedJobs });

            const jobData = jobSnapshot.docs[0].data();

            // Check if adminGroups is an object
            if (typeof jobData.adminGroups === 'object') {
                const existingAdminGroup = jobData.adminGroups[userId];

                if (!existingAdminGroup) {
                    // Add the user to the adminGroups object with the specified Role
                    jobData.adminGroups[userId] = { Role: role };

                    await Jobs.doc(jobSnapshot.docs[0].id).update({ adminGroups: jobData.adminGroups });

                    return res.status(200).json({
                        message: 'Job accepted successfully',
                        acceptedJob: {
                            JobId: parseInt(JobId),
                            Role: role,
                            userId: userId
                        }
                    });
                } else {
                    return res.status(400).json({ error: 'User already has a Role in adminGroups for this job' });
                }
            } else {
                return res.status(500).json({ error: 'adminGroups is not an object' });
            }
        } else {
            return res.status(400).json({ error: 'Job already accepted by the user' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
