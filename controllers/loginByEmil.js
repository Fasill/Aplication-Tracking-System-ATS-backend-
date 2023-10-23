import { Users } from '../models/User.js';
import { generateToken, generateTokenforOtpVerificationpage } from '../utils/tokenGenerator.js';
import { otpRef } from '../models/User.js';
import nodemailer from 'nodemailer';

// Function to add a new member to a company (This function is currently missing)

// Function to send an OTP email
const sendOtpEmail = async (email, token) => {
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
      subject: 'Secure Login Link:',
      html: `
        <p>Click here to login.</p>
        <p>http://localhost:3000/verifyuser?&token=${token}</p>
        <p>We can't wait to welcome you!</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully', info.response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to send an OTP and handle the response
const sendOtp = async (email, token, res, compId) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated OTP:', otp);
    await otpRef.doc(email).set({ otp });

    const emailSent = await sendOtpEmail(email, token);

    if (emailSent) {
      res.send({ message: 'Email sent' });
    } else {
      res.status(500).send('Error sending email');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
};

export const loginByEmail = async (req, res) => {
  const { email } = req.body;
  const userSnapshot = await Users.where('email', '==', email).get();

  if (userSnapshot.empty) {
    res.send("No users found with the provided email.");
  } else {
    const userId = userSnapshot.docs[0].id;
    const token = generateToken(userId);
    sendOtp(email, token, res);
  }
};

export const verifyTokenLink = async (req, res) => {
    res.send({"message":"all good"})
}
