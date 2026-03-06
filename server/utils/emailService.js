const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send a 6-digit OTP verification email to the given address.
 * @param {string} toEmail  - recipient email
 * @param {string} otp      - plain 6-digit code
 * @param {string} name     - recipient's name for personalisation
 */
const sendOtpEmail = async (toEmail, otp, name = 'there') => {
    const mailOptions = {
        from: `"MOVEXA" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your MOVEXA Verification Code',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #3d0000;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7f0000,#3d0000);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:-1px;">🕺 MOVEXA</h1>
              <p style="margin:8px 0 0;color:#f87171;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Email Verification</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#d1d5db;font-size:16px;margin:0 0 8px;">Hi <strong style="color:#fff;">${name}</strong>,</p>
              <p style="color:#9ca3af;font-size:14px;margin:0 0 28px;line-height:1.6;">
                Use the code below to verify your email and complete your MOVEXA registration. This code expires in <strong style="color:#fff;">10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:#1a1a1a;border:2px solid #7f0000;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Verification Code</p>
                <p style="margin:0;font-size:48px;font-weight:700;letter-spacing:10px;color:#fff;">${otp}</p>
              </div>
              <p style="color:#6b7280;font-size:12px;margin:0;line-height:1.6;">
                If you didn't request this, you can safely ignore this email. Do not share this code with anyone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:20px 40px;border-top:1px solid #1f1f1f;text-align:center;">
              <p style="margin:0;color:#4b5563;font-size:12px;">© ${new Date().getFullYear()} MOVEXA · Dance Workshop Platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
