import nodemailer from "nodemailer";

// Create transporter with SMTP settings from environment
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not configured - emails will be logged to console");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  const transport = getTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@krpl.tech",
    to: email,
    subject: "Your Login Code - krpl.tech",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Login Code</h2>
        <p>Use the following code to log in to your krpl.tech account:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">krpl.tech - Software Development Company</p>
      </div>
    `,
  };

  if (!transport) {
    console.log("=== EMAIL (DEV MODE) ===");
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log("========================");
    return true;
  }

  try {
    await transport.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

export const sendContactConfirmation = async (email: string, name: string): Promise<boolean> => {
  const transport = getTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_FROM || "noreply@krpl.tech",
    to: email,
    subject: "We received your message - krpl.tech",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for reaching out, ${name}!</h2>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to explore our portfolio at <a href="https://krpl.tech">krpl.tech</a>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">krpl.tech - Software Development Company</p>
      </div>
    `,
  };

  if (!transport) {
    console.log("=== CONTACT CONFIRMATION EMAIL (DEV MODE) ===");
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log("=============================================");
    return true;
  }

  try {
    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
};
