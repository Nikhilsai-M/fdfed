import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SmartExchange" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Mail sent to ${to}`);
  } catch (error) {
    console.error("❌ Mail Error:", error);
    throw new Error("Failed to send email");
  }
};
