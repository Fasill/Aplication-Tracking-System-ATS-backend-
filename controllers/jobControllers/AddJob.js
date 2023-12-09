import { Jobs, Users, Companies } from '../../models/User.js';
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';
import {GenerateJobID} from '../../utils/idGenerator.js'

export const AddJob = (req, res) => {
  const {
    jobName,
    jobDescription,
    salaryFrom,
    salaryTo,
    salaryRemark,
    mandatorySkills,
    optionalSkills,
    clientName,
    clientEmail,
    openings,
    remarks,
    token,
  } = req.body;

  const id = decodeTokenAndGetId(token);
  let JobId;

  const checkAndGenerateJobId = async () => {
    JobId = GenerateJobID();

    // Check if the generated JobId already exists
    const jobWithSameId = await Jobs.where('JobId', '==', JobId).get();

    if (!jobWithSameId.empty) {
      // If a job with the same JobId exists, generate a new one
      return checkAndGenerateJobId();
    }

    return JobId;
  };

  checkAndGenerateJobId()
    .then((generatedJobId) => {
      // Create a job object with the request data
      const job = {
        jobName,
        jobDescription,
        salaryFrom,
        salaryTo,
        salaryRemark,
        mandatorySkills,
        optionalSkills,
        clientName,
        clientEmail,
        openings,
        remarks, 
        adminGroups: { [id]: { Role: "Admin" } }, 
        candidates:[],
        addedBy: id,
        JobId: generatedJobId,
        status:"Active"
      };

      // Add the job to the Firestore Jobs collection
      return Jobs.add(job);
    })
    .then((docRef) => {
      res.status(201).json({ message: 'Job added successfully' });
    })
    .catch((error) => {
      console.error('Error adding job: ', error);
      res.status(500).json({ error: 'Failed to add job' });
    });
};
