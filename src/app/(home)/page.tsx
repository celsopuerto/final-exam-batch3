"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuth from "../hook/useAuth";

export default function Home() {
  useAuth();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  useEffect(() => {
    // Function to listen for authentication state changes
    // attendance 1, 2, 3
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFullName(user.displayName || "No name available"); // Set displayName or fallback
        setEmail(user.email || "No email available");
      } else {
        setFullName(""); // Reset if no user is logged in
        setEmail("");
        router.push("/login");
      }
    });

    // Cleanup function to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, [router]);

  const handleRedirect = () => {
    router.push("/attendance");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <button
            className="text-gray-50 border-gray-950 rounded-full bg-black py-1 px-3"
            onClick={handleRedirect}
          >
            Attendance
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome, {fullName ? fullName : "Guest"}!
          </h1>
          {email && <p className="text-gray-600 mb-6">Email: {email}</p>}
        </div>

        {/* Action Button Section... */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
