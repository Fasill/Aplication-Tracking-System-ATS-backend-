import { Jobs } from '../../models/User.js'; // Import the Firestore Jobs collection reference

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
    openings,
    remarks,
    adminGroups,
  } = req.body;

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
    openings,
    remarks,
    adminGroups,
  };

  // Add the job to the Firestore Jobs collection
  Jobs.add(job)
    .then((docRef) => {
      console.log('Job added with ID: ', docRef.id);
      res.status(201).json({ message: 'Job added successfully' });
    })
    .catch((error) => {
      console.error('Error adding job: ', error);
      res.status(500).json({ error: 'Failed to add job' });
    });
};
