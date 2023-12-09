import {Jobs,Users,Companies,Candidates} from '../models/User.js';

export const getFilteredCandidatesData = async (candidateIds, status) => {
    const candidatePromises = candidateIds.map(async (candidateId) => {
      const candidateSnapshot = await Candidates.doc(candidateId).get();
  
      if (candidateSnapshot.exists) {
        const candidateData = candidateSnapshot.data();
        if (!status || status === 'All' || candidateData.status === status) {
          const { JobId, CurrentLocation, addedBy, ...filteredCandidateData } = candidateData;
          return filteredCandidateData;
        }
      }
  
      return null;
    });
  
    const candidatesData = await Promise.all(candidatePromises);
    return candidatesData.filter((candidate) => candidate !== null);
  };