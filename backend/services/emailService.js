import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationOTP(email, otp) {
  await transporter.sendMail({
    from: `"Peerly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Peerly Email Verification OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #05050b;
        color: white;
        border-radius: 16px;
      ">
        <h1 style="color: #a78bfa;">
          Verify your Peerly account
        </h1>

        <p style="color: #cbd5e1;">
          Use the following OTP to verify your email address:
        </p>

        <div style="
          margin: 25px 0;
          padding: 18px;
          text-align: center;
          background: #11111c;
          border-radius: 12px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #67e8f9;
        ">
          ${otp}
        </div>

        <p style="color: #94a3b8;">
          This OTP is valid for 5 minutes.
        </p>

        <p style="color: #64748b;">
          If you did not request this verification, you can safely ignore
          this email.
        </p>
      </div>
    `,
  });
}