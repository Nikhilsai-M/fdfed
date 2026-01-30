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
      html: html || text, // Use html if provided, otherwise use text
    });

    console.log(`📧 Mail sent to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Mail Error:", error);
    throw new Error("Failed to send email");
  }
};

// New function specifically for OTP emails
export const sendOTPEmail = async (email, otp, purpose = "verification") => {
  const subject = purpose === "verification" 
    ? "SmartExchange - Verify Your Email" 
    : "SmartExchange - Password Reset OTP";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .expiry { color: #e74c3c; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SmartExchange</h1>
        </div>
        <div class="content">
          <h2>Your Verification Code</h2>
          <p>Use the following OTP to ${purpose === "verification" ? "complete your registration" : "reset your password"}:</p>
          
          <div class="otp-box">${otp}</div>
          
          <p>This OTP is valid for <span class="expiry">5 minutes</span>.</p>
          
          <p>If you didn't request this, please ignore this email.</p>
          
          <p>Best regards,<br>The SmartExchange Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SmartExchange. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Your SmartExchange OTP is: ${otp}. This code expires in 5 minutes.`;

  return sendMail({
    to: email,
    subject,
    text,
    html,
  });
};