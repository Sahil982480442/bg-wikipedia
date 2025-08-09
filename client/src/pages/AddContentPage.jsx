import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function AddContentPage() {
  const { courseId, topicId } = useParams();
  const [form, setForm] = useState({ name: "", mobile: "", title: "", content: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content`, {
      courseId,
      topicId,
      ...form,
    });
    alert("Submitted for admin approval");
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-blue-200 shadow-xl p-7 space-y-6"
        aria-label="Submit new content form"
      >
        <h2 className="text-2xl font-extrabold text-blue-900 text-center">
          Submit New Content
        </h2>
        {["name", "mobile", "title"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "mobile" ? "tel" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required
            className="w-full border border-blue-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            autoComplete="off"
          />
        ))}

        <textarea
          name="content"
          placeholder="Details / Link / Video URL"
          value={form.content}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border border-blue-300 rounded-md p-3 text-lg resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
