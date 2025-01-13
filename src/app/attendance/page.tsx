"use client";
import { useState, useEffect } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "@/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../hook/useAuth";

type Log = {
  id: string; // Use timestamp as the unique ID
  type: "IN" | "OUT";
  timestamp: string;
};

export default function Attendance() {
  useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [user, setUser] = useState<User | null>(null); // Use Firebase's User type
  const router = useRouter();

  // Fetch logs from Firestore when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the authenticated user
        await fetchLogs(currentUser.uid); // Fetch logs for the authenticated user
      } else {
        setUser(null); // Clear user state when not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Fetch logs for the authenticated user
  const fetchLogs = async (userId: string) => {
    try {
      console.log(`Fetching logs for user: ${userId}`);
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const attendanceLogs = docSnap.data()?.attendance || [];
        setLogs(attendanceLogs); // Update the logs state
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
  };

  const handleLog = async (type: "IN" | "OUT") => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const newLog: Log = {
      id: new Date().toISOString(),
      type,
      timestamp: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]); // Optimistically update the logs

    try {
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, {
        attendance: arrayUnion(newLog),
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleRedirect = () => {
    router.push("/");
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <button
        className="text-gray-50 border-gray-950 rounded-full bg-black py-1 px-3"
        onClick={handleRedirect}
      >
        Home
      </button>
      <h1 className="text-3xl font-bold mb-6">Time-In Time-Out</h1>

      <div className="mb-6">
        <button
          onClick={() => handleLog("IN")}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
        >
          Time-In
        </button>
        <button
          onClick={() => handleLog("OUT")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Time-Out
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Log History</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs available</p>
      ) : (
        <ul className="list-none p-0">
          {logs.map((log) => (
            <li key={log.id} className="border-b border-gray-300 py-2">
              <strong className="text-gray-700">{log.type}</strong> at{" "}
              {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
