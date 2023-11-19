import { Jobs, Users } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';



export const EditJob = async (req, res) => {
    const {
        JobId,
        inputs
    } = req.body;
    const parsedJobId = parseInt(JobId);
    console.log(req.body)


    try {
        // Get the job document from Firestore
        const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();

        // Check if the job exists
        if (jobSnapshot.empty) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Get the first document (assuming JobId is unique)
        const jobDoc = jobSnapshot.docs[0];

        // Update the document with non-null values from the request body
        if (inputs.JobName !== null) jobDoc.ref.update({ JobName: inputs.JobName });
        if (inputs.openings !== null) jobDoc.ref.update({ openings: inputs.openings });
        if (inputs.clientName !== null) jobDoc.ref.update({ clientName: inputs.clientName });
        if (inputs.status !== null) jobDoc.ref.update({ status: inputs.status });
        if (inputs.salaryTo !== null) jobDoc.ref.update({ salaryTo: inputs.salaryTo });
        if (inputs.salaryFrom !== null) jobDoc.ref.update({ salaryFrom: inputs.salaryFrom });
        if (inputs.salaryRemark !== null) jobDoc.ref.update({ salaryRemark: inputs.salaryRemark });
        if (inputs.mandatorySkills !== null) jobDoc.ref.update({ mandatorySkills: inputs.mandatorySkills });
        if (inputs.optionalSkills !== null) jobDoc.ref.update({ optionalSkills: inputs.optionalSkills });
        if (inputs.remarks !== null) jobDoc.ref.update({ remarks: inputs.remarks });
        if (inputs.jobDescription !== null) jobDoc.ref.update({ jobDescription: inputs.jobDescription });


        // Respond with success message
        return res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error editing job:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

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