import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Manage Topics</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Topic title"
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
        placeholder="Search topics..."
        className="w-full p-2 border rounded-lg mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            onClick={() =>
              navigate(`/user/courses/${courseId}/topics/${topic.id}`)
            }
            className={`p-6 bg-white rounded-xl shadow relative cursor-pointer border ${
              selected.includes(topic.id) ? "border-blue-500" : ""
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {topic.title}
            </h2>
            <p className="text-gray-600 mt-2">{topic.description}</p>

            <div className="absolute top-3 right-3">
              <input
                type="checkbox"
                checked={selected.includes(topic.id)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelect(topic.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTopics;
