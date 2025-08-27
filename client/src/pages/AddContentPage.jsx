import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import HERO_IMAGE from "../assets/Hero.avif";

export default function AddContentPage() {
  const { courseId, topicId } = useParams();
  const [form, setForm] = useState({ name: "", mobile: "", title: "", content: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile must be exactly 10 digits.";
    }
    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!form.content.trim() || form.content.length < 5) {
      newErrors.content = "Content must be at least 5 characters.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content`, {
        courseId,
        topicId,
        ...form,
      });
      alert("Submitted for admin approval");
      navigate(-1);
    } catch (err) {
      alert("Error submitting content");
    }
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
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-blue-200 shadow-xl p-7 space-y-4"
        aria-label="Submit new content form"
      >
        <h2 className="text-2xl font-extrabold text-blue-900 text-center">
          Submit New Content
        </h2>

        {/* Name */}
        <div>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded-md p-3 text-lg focus:outline-none focus:ring-1 transition"
            autoComplete="off"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Mobile */}
        <div>
          <input
            name="mobile"
            type="tel"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded-md p-3 text-lg focus:outline-none focus:ring-1 transition"
            autoComplete="off"
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>

        {/* Title */}
        <div>
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-blue-200 rounded-md p-3 text-lg focus:outline-none focus:ring-1 transition"
            autoComplete="off"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Content */}
        <div>
          <textarea
            name="content"
            placeholder="Details / Link / Video URL"
            value={form.content}
            onChange={handleChange}
            rows={6}
            className="w-full border border-blue-200 rounded-md p-3 text-lg resize-y focus:outline-none focus:ring-1 transition"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
        >
          Submit
        </button>
        <div className="mt-12 text-center text-blue-800 text-sm font-medium">
          If you have any queries, contact <span className="font-semibold">Sujay Nimai Das</span> 📞 77768 07563
        </div>
      </form>
      
    </div>
  );
}
