import { Users, Companies} from '../../models/User.js';
import { generateToken } from '../../utils/tokenGenerator.js';
import { otpRef } from '../../models/User.js';
import nodemailer from 'nodemailer';

const sendOtpEmail = async (email, token,Agency) => {
  try {
    // Create a transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'fasilhawultie19@gmail.com',
        pass: 'lmfu kqzm fpob zqjt',
      },
    });

    // Prepare the email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Secure Login Link',
      html: `
        <p>Click here to login:</p>
        ${!Agency ?
          `<a href="https://talent-tracker-ats-dszgwhplxa-el.a.run.app/verifySupplier?&token=${token}" style="display: inline-block; background-color: #0074b7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>` :
          `<a href="https://talent-tracker-ats-dszgwhplxa-el.a.run.app/verifySupplier?&token=${token}" style="display: inline-block; background-color: #0074b7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>`
        }
        <p>We can't wait to welcome you!</p>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);


    // Send the email
    return true;
  } catch (error) {
    
    console.error('Error sending email:', error);
  }
};

// Function to send an OTP and handle the response
const sendOtp = async (email, token, res,Agency) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log('Generated OTP:', otp);
    await otpRef.doc(email).set({ otp });

    const emailSent = await sendOtpEmail(email, token,Agency);

    if (emailSent) {
      res.send({ message: 'Email sent' });
    } else {
      res.status(500).send('Error sending email');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(400).json({ error: error });
  }
};
export const loginByEmailMember = async (req, res) => {
    const { email, role } = req.body;
    const userSnapshot = await Users.where('email', '==', email).get();
    const Agency = false
    if (userSnapshot.empty) {
      res.status(401).send("No users found with the provided email.");
    } else {
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      
      if (userData.role === role) { // Check if the user's role matches the provided role
        const userId = userDoc.id;
        const token = generateToken(userId);
        sendOtp(email, token, res,Agency);
      } else {
        res.status(401).send("User role does not match the provided role.");
      }
    }
  };
  

export const loginByEmailRecuireteragency = async (req, res) => {
  const { email } = req.body;
  const CompaniesSnapshot = await Companies.where('email', '==', email).get();
  const Agency = true
  if (CompaniesSnapshot.empty) {
    res.status(401).send("No users found with the provided email.");
  } else {
    const CompaniesDoc = CompaniesSnapshot.docs[0];
    
      const CompaniesId = CompaniesDoc.id;
      const token = generateToken(CompaniesId);
      sendOtp(email, token, res,Agency);
    
  }
};
export const verifyTokenLink = async (req, res) => {
  res.send({"message":"all good"})
}
