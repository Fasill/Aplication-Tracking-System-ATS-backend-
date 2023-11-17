import { Comments } from '../../models/User.js';
import { decodeTokenAndGetId } from "../../utils/decodeTokenAndGetId.js";

const addComment = (req, res) => {
    try {
        const { JobId, text, token } = req.body;
        const userId = decodeTokenAndGetId(token);
        const currentTime = new Date();

        // Format timestamp to include seconds
        const formattedTimestamp = currentTime.toISOString().slice(0, 19).replace("T", " ");

        const allInfo = {
            JobId,
            text,
            userId,
            timeStamp: formattedTimestamp,
        };

        Comments.add(allInfo);

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            data: allInfo,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export default addComment;
