import bcrypt from 'bcrypt';
import { Users } from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { otpRef } from '../models/User.js';
import nodemailer from 'nodemailer';
import { decodeTokenAndGetId } from '../utils/decodeTokenAndGetId.js';

// Function to send an OTP email
async function sendOtpEmail(email, otp) {
  try {
    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
        user: 'fasilhawultie19@gmail.com',
        pass: 'lmfu kqzm fpob zqjt',
      },
    });

    // Prepare the email options
    const mailOptions = {
      from: 'fasilhawultie19@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for verification is: ${otp}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully', info.response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const send_otp = async (req, res) => {
  const { token } = req.body;
  const userId = decodeTokenAndGetId(token);

  try {
    const userDoc = await Users.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const email = userDoc.data().email; // Retrieve the user's email from the user document
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp)
    await otpRef.doc(email).set({ otp });

    const emailSent = await sendOtpEmail(email, otp);

    if (emailSent) {
      res.send('Email sent');
    } else {
      res.status(500).send('Error sending email');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
};

export const verify_otp = async (req, res) => {
  const { token, otp } = req.body;
  const userId = decodeTokenAndGetId(token);

  try {
    const userDoc = await Users.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found');
    }

    const email = userDoc.data().email;

    // Retrieve the stored OTP from Firestore
    const otpDoc = await otpRef.doc(email).get();

    if (!otpDoc.exists) {
      res.status(404).send('OTP not found');
    } else {
      const storedOTP = otpDoc.data().otp;

      if (otp === storedOTP) {
        // OTP is valid, you can perform further actions here
        // For example, mark the user as verified
        userDoc.ref.update({ verified: true });
        res.send('OTP verified successfully');
      } else {
        res.status(401).send('Invalid OTP');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
