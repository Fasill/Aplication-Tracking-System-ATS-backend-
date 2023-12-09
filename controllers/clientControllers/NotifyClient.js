import json2xls from 'json2xls';
import nodemailer from 'nodemailer';
import fsPromises from 'fs/promises';

import { Users, Jobs, Candidates } from '../../models/User.js';
import {getFilteredCandidatesData} from '../../utils/getCandidates.js';

const EMAIL_CONFIG = {
  service: 'Gmail',
  secure: true,
  auth: {
    user: 'fasilhawultie19@gmail.com',
    pass: 'lmfu kqzm fpob zqjt',
  },
};

const FILENAME_PREFIX = 'output';

export const NotifyClient = async (req, res) => {
  const { JobId, text, subject, status, sendCandidateStatus } = req.body;
  const parsedJobId = parseInt(JobId);

  try {
    const jobData = await getJobData(parsedJobId);
    if (!jobData) {
      return res.status(404).send({ message: 'Job Not Found' });
    }

    const filteredCandidatesData = await getFilteredCandidatesData(jobData.candidates, status);

    await sendEmail(filteredCandidatesData, jobData.clientEmail, subject, text, sendCandidateStatus);


    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).send({ error: error.message || 'Internal Server Error' });
  }
};

const getJobData = async (parsedJobId) => {
  const jobSnapshot = await Jobs.where('JobId', '==', parsedJobId).get();
  return jobSnapshot.empty ? null : jobSnapshot.docs[0].data();
};



const convertJsonToExcel = async (jsonArray) => {
  try {
    const xls = json2xls(jsonArray);
    const fileName = `${FILENAME_PREFIX}_${Date.now()}.xlsx`;
    await fsPromises.writeFile(fileName, xls, 'binary');
    return fileName;
  } catch (error) {
    throw new Error(`Error converting JSON to Excel: ${error.message}`);
  }
};

const sendEmail = async (jsonData, email, subject, text, sendCandidateStatus) => {
  try {
    let fileName = null;
    if (sendCandidateStatus) {
      fileName = await convertJsonToExcel(jsonData);
    }

    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: subject,
      text: text,
    };

    if (fileName) {
      mailOptions.attachments = [{ filename: 'output.xlsx', path: fileName }];
    }

    const info = await transporter.sendMail(mailOptions);

    if (fileName) {
      await fsPromises.unlink(fileName);
    }

    console.log('Email sent:', info.response);
    return info.response;
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};