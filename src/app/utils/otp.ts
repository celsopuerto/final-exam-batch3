import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API);

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log("Resend API Key:", process.env.NEXT_PUBLIC_RESEND_API);

  console.log(`${email} ${otp}`);
  let data;
  try {
    data = await resend.emails.send({
      from: "MERN <onboarding@resend.dev>",
      to: [`${email}`],
      subject: "OTP Code",
      html: `<h1>Your OTP Code: ${otp} </h1>`,
    });
  } catch (error: unknown) {
    console.log(error);
  }

  return {
    data,
  };
};
