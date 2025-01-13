"use client";
import { useState } from 'react';

type Log = {
  id: number;
  type: 'IN' | 'OUT';
  timestamp: string;
};

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);

  const handleLog = (type: 'IN' | 'OUT') => {
    const newLog: Log = {
      id: logs.length + 1,
      type,
      timestamp: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
  };

  return (
    <div className="font-sans p-6">
      <h1 className="text-2xl font-bold mb-6">Time-In Time-Out</h1>

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
              key={log.id} 
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
