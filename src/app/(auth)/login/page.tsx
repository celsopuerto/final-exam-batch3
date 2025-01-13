"use client";

import useAuth from "@/app/hook/useAuth";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      const user = data.user;

      if (user) {
        toast.success("Signed in successfully");
        router.push("/");
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-xl mb-6">Login</h1>
        <form onSubmit={handleLogin}>
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
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="mt-4">
          Don{"'"}t have account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
