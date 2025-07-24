// client/src/pages/AddContentPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function AddContentPage() {
  const { courseId, topicId } = useParams();
  const [form, setForm] = useState({ name: "", mobile: "", title: "", content: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content`, {
      courseId, topicId, ...form
    });
    alert("Submitted for admin approval");
    navigate(-1);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Submit New Content</h2>
        {["name","mobile","title","content"].map((field) => (
          field !== "content" ? (
            <input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          ) : (
            <textarea
              key={field}
              name={field}
              placeholder="Details / Link / Video URL"
              value={form.content}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              rows={4}
            />
          )
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
