import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});
export async function sendVerificationEmail(email, fullName, verifyCode) {
  try {
    await transporter.sendMail({
      from: '"SkillPay" <moodyadi30@gmail.com>',
      to: email,
      subject: "SkillPay | Verification Code",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Verification Code</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
          body {
            font-family: 'Roboto', Verdana, sans-serif;
          }
        </style>
      </head>
      <body>
        <div>
          <h2>Hello ${fullName},</h2>
          <p>
            Thank you for registering. Please use the following verification code to complete your registration:
          </p>
          <p style="font-size: 20px; font-weight: bold;">${verifyCode}</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      </body>
      </html>
      `,
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
