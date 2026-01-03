// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config()


// // 🔍 Debug (remove later)
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // must be false for 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendEmail = async ({ to, subject, text }) => {
//   try {
//     await transporter.sendMail({
//       from: `"My App" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });

//     console.log("✅ Email sent successfully");
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//     throw error;
//   }
// };









const test = async () => {
  await sendEmail({
    to: "kaustubhhiwanj182@gmail.com",
    subject: "Gmail Nodemailer Test",
    text: "If you received this, Gmail SMTP works 🎉",
  });
};

test();


