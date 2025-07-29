import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpenIcon,
  PlusCircleIcon,
  ArrowLeftIcon,
  FileTextIcon,
  Link2Icon,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function TopicContentPage() {
  const { courseId, topicId } = useParams();
  const [topic, setTopic] = useState({});
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const t = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/topics/topic/${topicId}`
      );
      const c = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/approved/${topicId}`
      );
      setTopic(t.data);
      setContents(c.data);
    })();
  }, [topicId]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed relative"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for soft glass effect */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />
      <div className="relative z-10 max-w-3xl mx-auto py-10 px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 bg-white/60 hover:bg-yellow-100 text-blue-800 px-4 py-2 rounded-full shadow transition active:scale-95"
          >
            <ArrowLeftIcon size={18} />
            Back
          </button>

          {/* Title and Description */}
          <div className="flex-1 sm:ml-4">
            <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow flex items-center gap-2">
              <BookOpenIcon className="text-yellow-600" size={33} />
              {topic.title || "Loading..."}
            </h1>
            <p className="text-blue-700 mt-1">{topic.description}</p>
          </div>

          {/* Add Content Button */}
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
                  className="relative rounded-xl border border-blue-100 bg-white/90 shadow hover:shadow-yellow-200 hover:border-yellow-300 hover:bg-yellow-50/60 transition group p-6"
                >
                  {/* Icon at top-right */}
                  <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-80 transition">
                    <FileTextIcon className="text-blue-400" size={20} />
                  </div>
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
                        <Link2Icon className="inline text-blue-600" size={17} />
                      </a>
                    )}
                  </h3>
                  <div className="mt-3 text-blue-800/90 whitespace-pre-wrap">
                    {item.content ? (
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
