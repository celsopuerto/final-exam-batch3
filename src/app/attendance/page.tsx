"use client";
// pages/index.tsx
import { useState, useEffect } from 'react';
import { auth, db, doc, getDoc, updateDoc, arrayUnion } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

type Log = {
  id: string; // Changed id type to string (timestamp can be used as the id)
  type: 'IN' | 'OUT';
  timestamp: string;
};

export default function Attendance() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [user, setUser] = useState<any>(null); // User state to track the authenticated user

  // Fetch logs from Firestore when the component mounts
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user when logged in
        await fetchLogs(currentUser.uid); // Fetch the logs for the authenticated user
      } else {
        setUser(null); // Set user to null when not logged in
      }
    });
  }, []);

  // Fetch logs for the authenticated user
  const fetchLogs = async (userId: string) => {
    try {
      console.log(`Fetching logs for user: ${userId}`);
      
      const userDocRef = doc(db, 'users', userId); 
      const docSnap = await getDoc(userDocRef); 
      
      if (docSnap.exists()) {
        console.log("User document exists:", docSnap.data());
        
        const attendanceLogs = docSnap.data()?.attendance || []; // Get the attendance data from user document
        console.log('Fetched logs:', attendanceLogs);
        setLogs(attendanceLogs); // Set the logs from the user document's attendance field
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching logs: ", error);
    }
  };

  const handleLog = async (type: 'IN' | 'OUT') => {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }

    const newLog: Log = {
      id: new Date().toISOString(), // Generate a new ID based on timestamp
      type,
      timestamp: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]); // Update the logs state immediately with the new log

    try {
      const userDoc = doc(db, 'users', user.uid); // Use authenticated user's uid
      const updateField = {
        attendance: arrayUnion(newLog), // Use arrayUnion to append to the attendance array
      };

      await updateDoc(userDoc, updateField); // Update the user's document with new log
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Time-In Time-Out</h1>

      <div className="mb-6">
        <button 
          onClick={() => handleLog('IN')} 
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
        >
          Time-In
        </button>
        <button 
          onClick={() => handleLog('OUT')} 
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
            <li 
              key={log.id} // Use 'id' (timestamp in this case) as the unique key
              className="border-b border-gray-300 py-2"
            >
              <strong className="text-gray-700">{log.type}</strong> at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
