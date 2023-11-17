import { Comments, Jobs, Users, Companies} from '../../models/User.js';

const getJobComments = async (req, res) => {
    const { JobId } = req.query;
    const parsedJobId = parseInt(JobId);

    try {
        const jobSnapshot = await Jobs.where("JobId", "==", parsedJobId).get();

        if (jobSnapshot.empty) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const commentSnapshot = await Comments.where("JobId", "==", parsedJobId).get();

        if (commentSnapshot.empty) {
            return res.status(200).json({ message: 'No comments found for the job' });
        }

        // Map comment data from snapshot
        const comments = await Promise.all(commentSnapshot.docs.map(async (doc) => {
            const commentData = doc.data();

            // Retrieve user information for the current comment
            const userSnapshot = await Users.doc(commentData.userId).get();
            const companySnapshot = await Companies.doc(commentData.userId).get();
            
            
            if(userSnapshot.exists){
                var userData = userSnapshot.data();
            }
            else if (companySnapshot.exists){
                var userData = companySnapshot.data(); 
            }
            else{
            return res.status(404).json({ message: 'user not found' });

            }
            return {
                commentId: doc.id,
                ...commentData,
                userName: userData ? userData.name : null,
                // Add other user information as needed
            };
        }));

        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: comments,
        });
    } catch (error) {
        console.error("Error getting job comments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export default getJobComments;
