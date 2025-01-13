import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API); // Use a server-side variable

export async function POST(req: Request) {
  try {
    const { email, generatedOtp } = await req.json();

    console.log(`CELSOGOD: ${email} ${generatedOtp}`);

    if (!email || !generatedOtp) {
      return NextResponse.json({
        success: false,
        error: "Missing email or OTP.",
      });
    }

    const data = await resend.emails.send({
      from: "MERN <onboarding@resend.dev>",
      to: [email],
      subject: "OTP Code",
      html: `<h1>Your OTP Code: ${generatedOtp}</h1>`,
    });

    return NextResponse.json({ success: true, otp: generatedOtp, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
