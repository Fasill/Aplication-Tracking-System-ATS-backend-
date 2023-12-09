import {getEmailFromToken} from '../../utils/decodeTokenAndGetId.js';
import {Jobs,Users,Companies,Candidates} from '../../models/User.js';
import {getFilteredCandidatesData} from '../../utils/getCandidates.js';

export const retrieveCandidates = async (req, res) => {
    const token  = req.query.token;

    try {
        
        console.log(token)
        const clientEmail = getEmailFromToken(token);
        const jobSnapshot = await Jobs.where("clientEmail", "==", clientEmail).get();

        if (jobSnapshot.empty) {
            return res.status(404).send({ message: 'Job not found' });
        }

        const jobData = jobSnapshot.docs[0].data(); // Use "docs" instead of "doc"
        const candidates = await getFilteredCandidatesData(jobData.candidates, "All");

        return res.status(200).send({ candidates });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
};
