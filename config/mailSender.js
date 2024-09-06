import nodemailer from "nodemailer";
import { mailBody } from "./mailBody.js";

export const mailSender = async (email) => {
  const MAIL_PASS = "gistlmapjckiokvo";
  const MAIL_USER = "sayanmodak242001@gmail.com";
  const MAIL_HOST = "smtp.gmail.com";
  try {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // send mail
    const info = await transporter.sendMail({
      from: "From sourin",
      to: email,
      subject: "Joining link to consult with doctor",
      html: mailBody,
    });
    console.log('mail sent successfully', info);
    return info;
  } catch (error) {
    console.error(error.message);
  }
};

// module.exports = mailSender;
