import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/fasil/Desktop/srivango_project/test-back-end/credentials/ats-project-298816-252a51d60736.json";

const uploadResume = async (bucketName, file, fileOutputName) => {
    try {
        const storage = new Storage({ projectId: '108124850031718802633' }); // Replace with your actual project ID
        const bucket = storage.bucket(bucketName);
        const res = await bucket.upload(file, {
            destination: fileOutputName
        });
        return res;
    } catch (e) {
        console.log('error', e);
    }
};

const userAuthRouter = express.Router();

userAuthRouter.post('/send', async (req, res) => {
    try {
        const { fileBase64, fileOutputName } = req.body;
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const file = "/home/fasil/Desktop/srivango_project/test-back-end/utils/testResume.txt"
        const bucketName = 'resume-uploading-bucket';

        const uploadResult = await uploadResume(bucketName, fileBuffer, fileOutputName);

        res.status(200).json({ message: 'Resume uploaded successfully', uploadResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default userAuthRouter;
