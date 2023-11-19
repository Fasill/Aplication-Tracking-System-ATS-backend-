import { Jobs, Users } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';

export const deleteAJob = async (req, res) => {
    const { token, JobId } = req.query;
    const parsedJobId = parseInt(JobId);

    const userId = decodeTokenAndGetId(token);
    const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();

    // Check if the job exists
    if (!jobSnapshot.empty) {
        const jobData = jobSnapshot.docs[0].data();

        // Check if the user is an admin
        if (
            jobData.adminGroups &&
            jobData.adminGroups[userId] &&
            jobData.adminGroups[userId].Role === 'Admin'
        ) {
            // User is admin, delete the document
            await Jobs.doc(jobSnapshot.docs[0].id).delete();
            return res.status(200).json({ message: 'Job deleted successfully' });
        } else {
            // User doesn't have the required role
            return res.status(403).json({ message: 'Permission denied' });
        }
    } else {
        // Job not found
        return res.status(404).json({ message: 'Job not found' });
    }
};


export const EditJob = async (req, res) => {
    const {
        JobId,
        JobName,
        openings,
        clientName,
        status,
        salaryTo,
        salaryFrom,
        salaryRemark,
        mandatorySkills,
        optionalSkills,
        remarks,
        jobDescription
    } = req.body;

    try {
        // Get the job document from Firestore
        const jobSnapshot = await Jobs.where('JobId', '==', JobId).get();

        // Check if the job exists
        if (jobSnapshot.empty) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Get the first document (assuming JobId is unique)
        const jobDoc = jobSnapshot.docs[0];

        // Update the document with non-null values from the request body
        if (JobName !== null) jobDoc.ref.update({ JobName });
        if (openings !== null) jobDoc.ref.update({ openings });
        if (clientName !== null) jobDoc.ref.update({ clientName });
        if (status !== null) jobDoc.ref.update({ status });
        if (salaryTo !== null) jobDoc.ref.update({ salaryTo });
        if (salaryFrom !== null) jobDoc.ref.update({ salaryFrom });
        if (salaryRemark !== null) jobDoc.ref.update({ salaryRemark });
        if (mandatorySkills !== null) jobDoc.ref.update({ mandatorySkills });
        if (optionalSkills !== null) jobDoc.ref.update({ optionalSkills });
        if (remarks !== null) jobDoc.ref.update({ remarks });
        if (jobDescription !== null) jobDoc.ref.update({ jobDescription });

        // Respond with success message
        return res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error editing job:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
