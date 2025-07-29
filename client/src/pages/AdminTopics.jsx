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
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function AdminTopics() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`
    );
    setTopics(res.data);
  };

  useEffect(() => {
    if (selected.length === 1) {
      const selectedTopic = topics.find((t) => t.id === selected[0]);
      if (selectedTopic) {
        setTitle(selectedTopic.title);
        setDesc(selectedTopic.description);
        setEditMode(true);
      }
    } else {
      setTitle("");
      setDesc("");
      setEditMode(false);
    }
  }, [selected]);

  const handleAdd = async () => {
    if (!title) return;
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/topics`, {
      courseId,
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
    fetchTopics();
  };

  const handleEdit = async () => {
    if (selected.length !== 1 || !title) return;
    const id = selected[0];
    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${id}`, {
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
    setSelected([]);
    setEditMode(false);
    fetchTopics();
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/topics`, {
      data: { ids: selected },
    });
    setSelected([]);
    fetchTopics();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100/80 via-white to-blue-300/70 bg-no-repeat bg-cover relative"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-blue-200/70 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto py-10 px-4 sm:px-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 bg-white/90 hover:bg-yellow-200 text-blue-800 px-4 py-2 rounded-full shadow transition active:scale-95"
          >
            <ArrowLeftIcon size={18} /> Back
          </button>
          <div className="flex flex-col items-center md:items-start flex-grow">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900 flex items-center gap-3">
              <FolderKanbanIcon className="text-yellow-600" size={32} />
              Manage Topics
            </h1>
            <span className="text-blue-700/80 font-medium text-lg flex items-center gap-2 mt-1">
              Organize all lectures and wisdom in one place
            </span>
          </div>
        </div>

        {/* Controls */}
        <section className="bg-white rounded-2xl border border-blue-100 shadow-lg p-7 mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editMode) handleEdit();
              else handleAdd();
            }}
            className="flex flex-col md:flex-row gap-4 md:items-end"
          >
            <div className="w-full md:w-1/3">
              <label
                htmlFor="title"
                className="block mb-1 font-semibold text-blue-800"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Topic title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            <div className="w-full md:w-1/3">
              <label
                htmlFor="description"
                className="block mb-1 font-semibold text-blue-800"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 mt-2 md:mt-0 w-full md:w-auto flex-wrap justify-end md:justify-start">
              {editMode ? (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                >
                  <EditIcon size={18} />
                  Edit
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
                >
                  <PlusIcon size={18} />
                  Add
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={selected.length === 0}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none active:scale-95"
              >
                <Trash2Icon size={17} />
                Delete
              </button>
            </div>
          </form>

          {/* Search */}
          <div className="mt-7 flex justify-center">
            <div className="relative w-full md:w-2/4">
              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 focus:outline-none transition"
                aria-label="Search topics"
              />
              <SearchIcon
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
              />
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-blue-700 text-lg py-10 opacity-70">
              No topics found. Add a spiritual lecture or section!{" "}
              <BookOpenIcon className="inline ml-1" />
            </div>
          )}

          {filtered.map((topic) => (
            <div
              key={topic.id}
              onClick={() =>
                navigate(`/admin/courses/${courseId}/topics/${topic.id}`)
              }
              className={`group relative p-7 bg-white/90 rounded-2xl border border-blue-100 drop-shadow-md shadow-xl cursor-pointer transition duration-300 hover:scale-[1.03] hover:border-blue-400 hover:bg-blue-50/80 hover:shadow-blue-300 ${
                selected.includes(topic.id)
                  ? "border-blue-500 ring-2 ring-offset-2 ring-blue-300"
                  : ""
              }`}
              style={{ minHeight: 150 }}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/admin/courses/${courseId}/topics/${topic.id}`);
                }
              }}
              aria-selected={selected.includes(topic.id)}
            >
              {/* Checkbox */}
              <div className="absolute top-2 right-4 z-10 rounded-full drop-shadow transition">
                <input
                  type="checkbox"
                  checked={selected.includes(topic.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(topic.id)}
                  className="scale-125 accent-blue-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={`Select topic: ${topic.title}`}
                />
              </div>
              <h2 className="font-extrabold text-xl text-blue-900 drop-shadow mb-1 group-hover:text-yellow-700 transition">
                {topic.title}
              </h2>
              <p className="text-blue-700/90 mt-1 mb-2 line-clamp-3">
                {topic.description || (
                  <span className="text-gray-400">(No description)</span>
                )}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase text-yellow-800/80 font-bold tracking-wide">
                <BookOpenIcon className="inline" size={16} /> Click to manage content
              </div>
              <div className="absolute -inset-px rounded-2xl pointer-events-none group-hover:shadow-[0_0_16px_5px_rgba(253,224,71,0.27)] transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminTopics;
