import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const verifyEmail = async (body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.AU_EMAIL,
        pass: process.env.AU_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // const OTP = Math.floor(Math.random()*10000)

    const mailOptions = {
      from: process.env.AU_EMAIL,
      to: body.email,
      subject: "Welcome to SkillSail",
      html: `<p>Hello <strong>${body.name}</strong>, The otp is <strong>${body.OTP}</strong>. If this is not done by you, you can safely ignore this email.Happy Learning!!!`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return "success";
  } catch (error) {
    console.log(error);
  }
};

const sendMail = async (option) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.AU_EMAIL,
        pass: process.env.AU_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const info = await transporter.sendMail(option);
  } catch (error) {
    console.log(error);
  }
};

export { verifyEmail, sendMail };
