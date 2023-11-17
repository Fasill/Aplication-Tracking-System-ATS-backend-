import { Comments, Jobs, Users, Companies } from '../../models/User.js';

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
        const comments = commentSnapshot.docs.map(doc => {
            const commentData = doc.data();
            const userData = {}; // You can modify this part based on your user data retrieval logic

            return {
                commentId: doc.id,
                ...commentData,
                userName: userData.name || null,
                // Add other user information as needed
            };
        });

        // Order comments by timeStamp in descending order
        const sortedComments = comments.sort((a, b) => {
            return new Date(b.timeStamp) - new Date(a.timeStamp);
        });

        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: sortedComments,
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
