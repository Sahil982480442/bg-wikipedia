// AdminTopics.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpenIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
  ArrowLeftIcon,
  SearchIcon,
  FolderKanbanIcon,
  XIcon,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function AdminTopics() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`);
      setTopics(res.data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };
  
  // const fetchCourseDetails = async () => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}`);
  //     setCourseTitle(res.data.title);
  //   } catch (error) {
  //     console.error("Failed to fetch course details", error);
  //   }
  // };

  useEffect(() => {
    fetchTopics();
    // fetchCourseDetails();
  }, [courseId]);


  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/topics`, {
        courseId,
        title: newTitle,
        description: newDesc,
      });
      setNewTitle("");
      setNewDesc("");
      fetchTopics();
    } catch (error) {
      console.error("Failed to add topic:", error);
    }
  };

  const openEditModal = (topic) => {
    setCurrentTopic(topic);
    setEditTitle(topic.title);
    setEditDesc(topic.description || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateTopic = async () => {
    if (!currentTopic || !editTitle.trim()) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${currentTopic.id}`, {
        title: editTitle,
        description: editDesc,
      });
      setIsEditModalOpen(false);
      setCurrentTopic(null);
      fetchTopics();
    } catch (error) {
      console.error("Failed to update topic:", error);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this topic? All its content will be lost forever."
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/topics`, {
          data: { ids: [topicId] },
        });
        fetchTopics();
      } catch (error) {
        console.error("Failed to delete topic:", error);
      }
    }
  };
  
  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-100/80 via-white to-blue-300/70 bg-no-repeat bg-cover relative"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-blue-200/70 z-0" />

        {/* --- CORRECTED: Page width changed from max-w-6xl to max-w-7xl for consistency --- */}
        <div className="relative z-10 max-w-7xl mx-auto py-10 px-4 sm:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 bg-white/90 hover:bg-yellow-200 text-blue-800 px-4 py-2 rounded-full shadow transition active:scale-95"
            >
              <ArrowLeftIcon size={18} /> Back to Courses
            </button>
            <div className="flex flex-col items-center text-center md:items-start md:text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900 flex items-center gap-3">
                <FolderKanbanIcon className="text-yellow-600" size={32} />
                Manage Topics
              </h1>
              {courseTitle && (
                <span className="text-blue-700/80 font-medium text-lg mt-1">
                  for course: <span className="font-bold">{courseTitle}</span>
                </span>
              )}
            </div>
          </div>

          <section className="bg-white/95 rounded-2xl border border-blue-100 shadow-lg p-7 mb-10">
            <form
              onSubmit={handleAddTopic}
              className="flex flex-col md:flex-row gap-4 md:items-end"
            >
              <div className="w-full md:w-2/5">
                <label htmlFor="title" className="block mb-1 font-semibold text-blue-800">
                  New Topic Title
                </label>
                <input
                  id="title" type="text" placeholder="e.g., The Nature of the Soul"
                  value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  required
                />
              </div>
              <div className="w-full md:w-2/5">
                <label htmlFor="description" className="block mb-1 font-semibold text-blue-800">
                  Description
                </label>
                <input
                  id="description" type="text" placeholder="A brief summary of the topic"
                  value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
              <div className="w-full md:w-auto mt-2 md:mt-0">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                >
                  <PlusIcon size={18} /> Add Topic
                </button>
              </div>
            </form>

            <div className="my-7 flex justify-center">
              <div className="relative w-full md:w-3/5">
                <input
                  type="text" placeholder="Search topics..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 focus:outline-none transition"
                  aria-label="Search topics"
                />
                <SearchIcon size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTopics.length === 0 && (
              <div className="col-span-full text-center text-blue-700 text-lg py-10 opacity-70">
                No topics found. Add your first lecture or section!
                <BookOpenIcon className="inline ml-2" />
              </div>
            )}
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="group relative p-7 bg-white/80 rounded-2xl border drop-shadow-md shadow-xl
                transition duration-300 hover:scale-[1.03] hover:border-blue-400 hover:shadow-blue-300
                hover:bg-blue-50/80 border-blue-100 flex flex-col justify-between"
                style={{ minHeight: 180 }}
              >
                <div>
                  <h2 className="font-extrabold text-2xl text-blue-900 mb-1 group-hover:text-yellow-700 transition">
                    {topic.title}
                  </h2>
                  <p className="text-blue-700/90 mt-1 mb-4 line-clamp-3">
                    {topic.description || <span className="text-gray-400">(No description)</span>}
                  </p>
                </div>

                <div className="flex gap-2 items-center mt-auto pt-4">
                  <button
                    onClick={() => openEditModal(topic)}
                    className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow transition"
                  >
                    <EditIcon size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow transition"
                  >
                    <Trash2Icon size={16} /> Delete
                  </button>
                   <button
                    onClick={() => navigate(`/admin/courses/${courseId}/topics/${topic.id}`)}
                    className="ml-auto text-xs uppercase text-yellow-800/80 font-bold tracking-wide flex items-center gap-1"
                  >
                    <BookOpenIcon size={16} /> Manage Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Topic Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all animate-in fade-in-0 zoom-in-95">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Edit Topic</h2>
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XIcon size={24} />
            </button>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-blue-800">Title</label>
                <input
                  type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-blue-200 transition"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-blue-800">Description</label>
                <input
                  type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring focus:ring-blue-200 transition"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button
                onClick={handleUpdateTopic}
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

export default AdminTopics;