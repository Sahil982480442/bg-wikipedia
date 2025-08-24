import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../../assets/image.png";
import HERO_IMAGE from "../../assets/Hero.avif";
import { useNavigate } from "react-router-dom";
import { BellIcon, BookOpenIcon, PlusIcon, EditIcon, Trash2Icon, SearchIcon, XIcon } from "lucide-react";


function AdminCourses() {
  // State for the main page
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  // State for the "Add Course" form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // --- NEW: State for the Edit Modal ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null); // Course being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchPending();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/pending`);
      setPendingCount(res.data.length);
    } catch (error) {
      console.error("Failed to fetch pending count:", error);
    }
  };

  // Handler for the "Add Course" form
  const handleAddCourse = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/courses`, {
        title: newTitle,
        description: newDesc,
      });
      setNewTitle("");
      setNewDesc("");
      fetchCourses();
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  // --- NEW: Handler to open and prepare the edit modal ---
  const openEditModal = (course) => {
    setCurrentCourse(course);
    setEditTitle(course.title);
    setEditDesc(course.description || "");
    setIsEditModalOpen(true);
  };

  // --- NEW: Handler to submit the edit form from the modal ---
  const handleUpdateCourse = async () => {
    if (!currentCourse || !editTitle.trim()) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${currentCourse.id}`, {
        title: editTitle,
        description: editDesc,
      });
      setIsEditModalOpen(false);
      setCurrentCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  // --- IMPROVED: Delete handler with confirmation ---
  const handleDeleteCourse = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/courses`, {
          data: { ids: [id] },
        });
        fetchCourses();
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-100/80 via-white to-blue-300/70
              bg-no-repeat bg-cover relative"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-blue-200/70 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto py-10 px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
             <div className="flex items-center gap-4">
                <img
                  src={logo}
                  alt="Sanjivani Logo"
                  className="w-14 h-14 rounded-full shadow-md bg-white object-contain"
                />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-900">
                    Sanjivani Encyclopedia
                  </h1>
                  <div className="text-lg text-blue-700/80 font-medium">
                    Spreading Drops of Nectar
                  </div>
                </div>
              </div>
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

          {/* "Add Course" Form */}
          <div className="backdrop-blur-xl bg-white/80 border border-blue-100 shadow-2xl rounded-2xl mb-10 p-7">
            <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
              <div className="w-full md:w-1/3">
                <label className="block mb-1 font-semibold text-blue-800">New Course Title</label>
                <input
                  type="text"
                  placeholder="e.g., Discover Yourself"
                  className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring-1 transition"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block mb-1 font-semibold text-blue-800">Description</label>
                <input
                  type="text"
                  placeholder="A brief summary"
                  className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring-1 transition"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                 <button
                    onClick={handleAddCourse}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                  >
                    <PlusIcon size={18} /> Add Course
                  </button>
              </div>
            </div>

            {/* Search */}
            <div className="my-7 flex justify-center">
              <div className="relative w-full md:w-2/4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow focus:outline-none focus:ring-1 transition"
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
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center text-blue-700 text-lg py-10 opacity-70">
                No courses found. Add your first spiritual course! <BookOpenIcon className="inline ml-2" />
              </div>
            )}
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group relative p-7 bg-white/80 rounded-2xl border drop-shadow-md shadow-xl
                transition duration-300 hover:border-blue-400 hover:shadow-blue-300
                hover:bg-blue-50/80 border-blue-100 flex flex-col justify-between"
                style={{ minHeight: 180 }}
              >
                <div>
                  <h2 className="font-extrabold text-2xl text-blue-900 mb-1 group-hover:text-yellow-700 transition">
                    {course.title}
                  </h2>
                  <p className="text-blue-700/90 mt-1 mb-4 line-clamp-3">
                    {course.description || <span className="text-gray-400">(No description)</span>}
                  </p>
                </div>
                <div className="flex gap-2 items-center mt-auto pt-4">
                  <button
                    onClick={() => openEditModal(course)}
                    className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow transition"
                  >
                    <EditIcon size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow transition"
                  >
                    <Trash2Icon size={16} /> Delete
                  </button>
                  <button
                    onClick={() => navigate(`/admin/courses/${course.id}/topics`)}
                    className="ml-auto text-xs uppercase text-yellow-800/80 font-bold tracking-wide flex items-center gap-1"
                  >
                    <BookOpenIcon size={16} /> Manage Topics
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW: Edit Course Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all animate-in fade-in-0 zoom-in-95">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Edit Course</h2>
            <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <XIcon size={24} />
            </button>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-blue-800">Title</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-blue-200 transition"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-blue-800">Description</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-blue-200 transition"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCourse}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
              >
                <EditIcon size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCourses;