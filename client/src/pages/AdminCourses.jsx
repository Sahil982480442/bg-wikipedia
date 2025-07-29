// AdminCourses.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BellIcon, BookOpenIcon, PlusIcon, EditIcon, Trash2Icon, SearchIcon } from "lucide-react";

// Example ISKCON relevant image (Unsplash)
// You can change this to any Krishna gif/bg/artwork you like
const HERO_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // beautiful river
const DEFAULT_AVATAR = "https://avatars.githubusercontent.com/u/29354907?s=200&v=4"; // ISKCON logo

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
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100/80 via-white to-blue-300/70
            bg-no-repeat bg-cover relative"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay - glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-blue-200/70 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={DEFAULT_AVATAR}
              alt="ISKCON Logo"
              className="w-14 h-14 rounded-full shadow-md border-4 border-yellow-300 bg-white object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-900">
                Course Management
              </h1>
              <div className="text-lg text-blue-700/80 font-medium">
                Bring every lecture and wisdom to one place
              </div>
            </div>
          </div>
          {/* Notification Bell */}
          <button
            onClick={() => navigate("/admin/pending")}
            className="relative group"
            aria-label="Pending Approvals"
          >
            <BellIcon size={30} className="text-yellow-600 drop-shadow group-hover:animate-ring" />
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full border-2 border-white
                  bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg
                  animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Glassy panel */}
        <div className="backdrop-blur-xl bg-white/80 border border-blue-100 shadow-2xl rounded-2xl mb-10 p-7">
          {/* Add/Edit/Delete Controls */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
            {/* Course Title */}
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold text-blue-800">Title</label>
              <input
                type="text"
                placeholder="Course title"
                className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-blue-200 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {/* Description */}
            <div className="w-full md:w-1/3">
              <label className="block mb-1 font-semibold text-blue-800">Description</label>
              <input
                type="text"
                placeholder="Description"
                className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring transition"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            {/* Buttons */}
            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
              {editMode ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                >
                  <EditIcon size={18} /> Edit
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                >
                  <PlusIcon size={18} /> Add
                </button>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
              >
                <Trash2Icon size={18} /> Delete
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="my-7 flex justify-center">
            <div className="relative w-full md:w-2/4">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow focus:outline-none focus:ring-2 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-blue-700 text-lg py-10 opacity-70">
              No courses found. Add your first spiritual course! <BookOpenIcon className="inline ml-2" />
            </div>
          )}
          {filtered.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/admin/courses/${course.id}/topics`)}
              className={`
              group relative p-7 bg-white/80 rounded-2xl border drop-shadow-md shadow-xl cursor-pointer
              transition duration-300 hover:scale-[1.03] hover:border-blue-400 hover:shadow-blue-300
              hover:bg-blue-50/80
              ${selected.includes(course.id)
                ? "border-blue-500 ring-2 ring-offset-2 ring-blue-300"
                : "border-blue-100"}
            `}
              style={{ minHeight: 160 }}
            >
              {/* Select Box absolute */}
              <div className="absolute top-2 right-4 z-10 rounded-full transition drop-shadow">
                <input
                  type="checkbox"
                  checked={selected.includes(course.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(course.id)}
                  className="scale-125 accent-blue-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={`Select course: ${course.title}`}
                />
              </div>
              <h2 className="font-extrabold text-2xl text-blue-900 drop-shadow mb-1 group-hover:text-yellow-700 transition">
                {course.title}
              </h2>
              <p className="text-blue-700/90 mt-1 mb-2 line-clamp-3">
                {course.description || <span className="text-gray-400">(No description)</span>}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase text-yellow-800/80 font-bold tracking-wide">
                <BookOpenIcon className="inline" size={18} /> Click to manage topics
              </div>
              {/* Divine border animation */}
              <div className="absolute -inset-px rounded-2xl pointer-events-none group-hover:shadow-[0_0_20px_4px_rgba(252,211,77,0.3)] transition-all" />
            </div>
          ))}
        </div>
      </div>
      {/* Subtle bottom Krishna swirl or artistic element (optional) */}
      {/* <img src="https://...." alt="Divine Swirl" className="fixed bottom-0 left-0 w-60 opacity-20 pointer-events-none z-0" /> */}
    </div>
  );
}

export default AdminCourses;
