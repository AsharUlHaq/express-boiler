import prisma from "../../utils/db.util";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { SendOtpInput, VerifyOtpInput } from "./otp.schema";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpService({ email }: SendOtpInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await prisma.oTPLog.create({
    data: {
      id: uuidv4(),
      userId: user.id,
      otp,
      expiresAt,
      verified: false,
    },
  });

  await transporter.sendMail({
    from: `"EmergenCare" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return true;
}

export async function verifyOtpService({ email, otp }: VerifyOtpInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const latestOtp = await prisma.oTPLog.findFirst({
    where: { userId: user.id, otp },
    orderBy: { createdAt: "desc" },
  });

  if (!latestOtp) throw new Error("Invalid OTP");
  if (latestOtp.verified) throw new Error("OTP already used");
  if (new Date() > latestOtp.expiresAt) throw new Error("OTP expired");

await prisma.oTPLog.update({
  where: { id: latestOtp.id },
  data: { verified: true },
});

// ✅ Also mark user as verified
await prisma.user.update({
  where: { id: user.id },
  data: { isVerified: true },
});

  return true;
}
export async function sendOtpToEmail(email: string) {
  return sendOtpService({ email });
}
