import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpenIcon,
  PlusCircleIcon,
  ArrowLeftIcon,
  FileTextIcon,
  Link2Icon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon
} from "lucide-react";
import HERO_IMAGE from "../../assets/Hero.avif";


export default function TopicContentPage() {
  const { courseId, topicId } = useParams();
  const [topic, setTopic] = useState({});
  const [contents, setContents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const fetchData = async () => {
    const t = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/topics/topic/${topicId}`
    );
    const c = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/approved/${topicId}`
    );
    setTopic(t.data);
    setContents(c.data);
  };

  useEffect(() => {
    fetchData();
  }, [topicId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/${id}`
    );
    fetchData();
  };

  const handleEditStart = (item) => {
    setEditId(item.id);
    setEditForm({ title: item.title, content: item.content || "" });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ title: "", content: "" });
  };

  const handleEditSave = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/${editId}`,
      editForm
    );
    setEditId(null);
    fetchData();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed relative p-8"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />
      <div className="relative z-10  mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 bg-white/60 hover:bg-yellow-100 text-blue-800 px-4 py-2 rounded-full shadow transition active:scale-95"
          >
            <ArrowLeftIcon size={18} />
            Back
          </button>

          <div className="flex-1 sm:ml-4">
            <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow flex items-center gap-2">
              <BookOpenIcon className="text-yellow-600" size={33} />
              {topic.title || "Loading..."}
            </h1>
            <p className="text-blue-700 mt-1">{topic.description}</p>
          </div>

          <button
            onClick={() => navigate(`/submit/${courseId}/${topicId}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition active:scale-95"
          >
            <PlusCircleIcon size={20} />
            Add Content
          </button>
        </div>

        {/* Content Resources Section */}
        <section className="backdrop-blur-lg bg-white/80 border border-blue-100 rounded-2xl shadow-2xl px-6 py-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800 drop-shadow">
            <FileTextIcon className="text-yellow-600" />
            Resources
          </h2>
          <div className="space-y-7">
            {contents.length === 0 ? (
              <div className="text-blue-700/70 px-3 py-6 flex flex-col items-center gap-2 text-center">
                <span>No content yet.</span>
                <BookOpenIcon className="text-yellow-500" size={36} />
                <span className="text-xs text-blue-800/70">
                  Add the first lecture note, video, document, or other resource!
                </span>
              </div>
            ) : (
              contents.map((item) => (
                <article
                  key={item.id}
                  className="relative rounded-xl border border-blue-100 bg-white/90 shadow  transition group p-6"
                >
                  {/* Edit/Delete buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-50 group-hover:opacity-90 transition">
                    {editId === item.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="text-green-600 hover:scale-110 transition"
                        >
                          <CheckIcon size={18} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-red-600 hover:scale-110 transition"
                        >
                          <XIcon size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(item)}
                          className="text-blue-500 hover:scale-110 transition"
                        >
                          <PencilIcon size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:scale-110 transition"
                        >
                          <Trash2Icon size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  {editId === item.id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full border border-blue-200 rounded p-2 mb-2"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 group-hover:text-yellow-800 transition">
                      {item.title}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open link"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-2 group-hover:scale-105 transition"
                        >
                          <Link2Icon
                            className="inline text-blue-600"
                            size={17}
                          />
                        </a>
                      )}
                    </h3>
                  )}

                  {/* Content */}
                  <div className="mt-3 text-blue-800/90 whitespace-pre-wrap">
                    {editId === item.id ? (
                      <textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        className="w-full border border-blue-200 rounded p-2"
                        rows={3}
                      />
                    ) : item.content ? (
                      <span>{item.content}</span>
                    ) : item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline"
                      >
                        {item.link}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
