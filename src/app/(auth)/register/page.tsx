"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import useAuth from "@/app/hook/useAuth";

export default function RegisterPage() {
  useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const generatedOtpRef = useRef("");
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

  const handleOtpSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);

    console.log(`${email} ${generatedOtp}`);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, generatedOtp }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(data);
        setGeneratedOtp(data.otp); // Update OTP state with the one from the API response
        generatedOtpRef.current = data.otp; // Store in ref for verification
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        console.log(data.error);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setGeneratedOtp(otpCode);

    console.log(`${email} ${generatedOtp}`);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, generatedOtp }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(data);
        setGeneratedOtp(data.otp); // Update OTP state with the one from the API response
        generatedOtpRef.current = data.otp; // Store in ref for verification
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        console.log(data.error);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log(`${otp} ${generatedOtp} ${generatedOtpRef.current}`);

    try {
      if (otp !== generatedOtpRef.current) {
        toast.error("OTP is incorrect.");
        return;
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: fullName });

      // Save user data to Firestore
      const userDocRef = doc(db, "users", user.uid);
      const store = {
        fullName,
        email,
        password,
        timestamp: new Date().toISOString(),
      };
      await setDoc(userDocRef, store);
      toast.success("Registration successful!");

      console.log("User registered and profile updated:", user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already in use. Please try another.");
          router.push("/register");
        } else {
          toast.error("Failed to register. Please try again.");
          console.error("Error during registration:", error);
        }
      } else {
        toast.error("An unknown error occurred. Please try again.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800">
      {!otpSent ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl mb-6">Register</h1>
          <form onSubmit={handleOtpSend}>
            <input
              type="text"
              placeholder="Full Name"
              className="block w-96 p-2 border border-gray-300 rounded-md mb-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="block w-96 p-2 border border-gray-300 rounded-md mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-96 p-2 border border-gray-300 rounded-md mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="block w-96 p-2 bg-blue-500 text-white rounded-md"
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          <p className="mt-4">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl mb-6">Register</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="OTP"
              className="block w-96 p-2 border border-gray-300 rounded-md mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              className="block w-96 p-2 bg-blue-500 text-white rounded-md"
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          <p className="mt-4">
            Didn{"'"}t receive an email?{" "}
            <button onClick={handleResend}>Resend</button>
          </p>
        </div>
      )}
    </div>
  );
}
