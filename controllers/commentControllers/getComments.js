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

        // Map comment data from snapshot with user data
        const comments = await Promise.all(commentSnapshot.docs.map(async doc => {
            const commentData = doc.data();

            try {
                const userSnapshot = await Users.doc(commentData.userId).get();
                const userData = userSnapshot.data();


                // Modify this part based on your companies data retrieval logic
                const compSnapshot = await Companies.doc(commentData.userId).get();
                const companiesData = compSnapshot.data();

                return {
                    commentId: doc.id,
                    ...commentData,
                    userName: userData && userData.name || (companiesData && companiesData.name) || null,
                    // Add other user information as needed
                };
            } catch (error) {
                console.error("Error fetching user data:", error);
                return {
                    commentId: doc.id,
                    ...commentData,
                    userName: null,
                    // Add other default user information as needed
                };
            }
        }));

        // Order comments by timeStamp in descending order
        const sortedComments = comments.sort((b,a) => {
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
