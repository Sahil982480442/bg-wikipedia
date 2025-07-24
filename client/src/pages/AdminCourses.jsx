import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BellIcon } from "lucide-react";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchPending();
  }, []);

  useEffect(() => {
    if (selected.length === 1) {
      const selectedCourse = courses.find((c) => c.id === selected[0]);
      if (selectedCourse) {
        setTitle(selectedCourse.title);
        setDesc(selectedCourse.description);
        setEditMode(true);
      }
    } else {
      setTitle("");
      setDesc("");
      setEditMode(false);
    }
  }, [selected]);

  const fetchCourses = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
    setCourses(res.data);
  };

  const fetchPending = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/pending`);
    setPendingCount(res.data.length);
  };

  const handleAdd = async () => {
    if (!title) return;
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/courses`, {
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
    setSelected([]);
    fetchCourses();
  };

  const handleEdit = async () => {
    if (selected.length !== 1 || !title) return;
    const id = selected[0];
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${id}`, {
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
    setSelected([]);
    setEditMode(false);
    fetchCourses();
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/courses`, {
      data: { ids: selected },
    });
    setSelected([]);
    fetchCourses();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Courses</h1>
        <button onClick={() => navigate("/admin/pending")} className="relative">
          <BellIcon size={24} />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-ping">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Course title"
          className="p-2 border rounded w-full md:w-1/3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded w-full md:w-1/3"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {editMode ? (
          <button
            onClick={handleEdit}
            className="bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </button>
      </div>

      <input
        type="text"
        placeholder="Search courses..."
        className="w-full p-2 border rounded-lg mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/admin/courses/${course.id}/topics`)}
            className={`p-6 bg-white rounded-xl shadow relative cursor-pointer border ${
              selected.includes(course.id) ? "border-blue-500" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <div className="absolute top-3 right-3">
              <input
                type="checkbox"
                checked={selected.includes(course.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(course.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCourses;
