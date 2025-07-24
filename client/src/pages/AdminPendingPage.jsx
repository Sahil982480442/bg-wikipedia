// client/src/pages/AdminPendingPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPendingPage() {
  const [requests, setRequests] = useState([]);

  const fetch = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/pending`);
    setRequests(res.data);
  };

  useEffect(() => { fetch(); }, []);

  const act = async (id, approve) => {
    if (approve) {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/approve/${id}`);
    } else {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/reject/${id}`);
    }
    fetch();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pending Content Requests</h1>
      {requests.length === 0 && <p className="text-gray-500">No pending requests.</p>}
      <ul className="space-y-4">
        {requests.map((r) => (
          <li key={r.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-start">
            <div>
              <p><strong>Course:</strong> {r.course_id}</p>
              <p><strong>Topic:</strong> {r.topic_id}</p>
              <p><strong>By:</strong> {r.name} / {r.mobile}</p>
              <p><strong>Title:</strong> {r.title}</p>
              <p className="mt-2 text-gray-700">{r.content}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => act(r.id, true)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Approve
              </button>
              <button
                onClick={() => act(r.id, false)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
