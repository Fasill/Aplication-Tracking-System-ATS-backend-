import bcrypt from 'bcrypt';
import admin from "firebase-admin"
import { Users } from '../models/User.js';
import { Companies } from "../models/User.js"
import { generateToken, generateTokenforOtpVerificationpage } from '../utils/tokenGenerator.js';
import { otpRef } from '../models/User.js';
import nodemailer from 'nodemailer';
import { decodeTokenAndGetId } from '../utils/decodeTokenAndGetId.js';

// Function to add a new member to a company
export const addMember = async (req, res) => {
  const { email, token } = req.body;
  const compId = decodeTokenAndGetId(token);
  console.log("Company ID:", compId);
  const userSnapshot = await Users.where("email", "==", email).get();

  if (userSnapshot.docs.length > 0) {
    res.status(400).json({ message: 'User already registered.' });
    return;
  }

  const companyRef = Companies.doc(compId);
  const updateData = {
    user: admin.firestore.FieldValue.arrayUnion(email)
  };

  // Update the Firestore document
  await companyRef.update(updateData);

  const userDoc = await Users.add({
    email,
    role:"Recruiter",
    verified: false,
    
  });

  sendOtp(email, res, compId);
}

// Function to send an OTP email
const sendOtpEmail = async (email, otp, compId) => {
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
      subject: 'Join Today!',
      html: `
        <p>You're invited to join our community, where opportunity awaits.</p>
        <p>http://localhost:8080/verifyuser?key=${otp}&compId=${compId}&email=${email}</p>
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
}

// Function to send an OTP and handle the response
const sendOtp = async (email, res, compId) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);
    await otpRef.doc(email).set({ otp });

    const emailSent = await sendOtpEmail(email, otp, compId);

    if (emailSent) {
      res.send({ message: 'Email sent' });
    } else {
      res.status(500).send('Error sending email');
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
}

// Function to verify OTP link
export const verifyOtpLink = async (req, res) => {
  var otp = req.query.key;
  otp = parseInt(otp, 10);
  console.log("Received OTP:", otp);
  const compId = req.query.compId;
  console.log("Company ID:", compId);
  const email = req.query.email;

  const token = generateToken(compId);
  console.log("Generated Token:", token);

  try {
    const userDoc = await Companies.doc(compId).get();
    if (!userDoc.exists) {
      return res.status(404).send('Company not found');
    }

    const otpDoc = await otpRef.doc(email).get();

    if (!otpDoc.exists) {
      res.status(404).send('OTP not found');
    } else {
      const storedOTP = otpDoc.data().otp;

      const userSnapshot = Users.where("email", "==", email)
      userSnapshot.get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("No users found with the provided email.");
          } else {
            if (otp === storedOTP) {
              const userV = querySnapshot.docs[0];
              userV.ref.update({ verified: true });
              res.send('OTP verified successfully');
            } else {
              res.status(401).send('Invalid OTP');
            }
          }
        })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
