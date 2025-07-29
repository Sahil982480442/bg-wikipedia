import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed relative p-8"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow">
              {topic.title || "Loading..."}
            </h1>
            <p className="text-blue-700 mt-1">{topic.description}</p>
          </div>
          <button
            onClick={() => navigate(`/submit/${courseId}/${topicId}`)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
          >
            Add Content
          </button>
        </div>

        {/* Approved Resources */}
        <section className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 drop-shadow">
            Approved Resources
          </h2>
          <div className="space-y-6 min-h-[100px]">
            {contents.length === 0 ? (
              <p className="text-blue-700/80 text-center text-lg opacity-70">
                No approved content yet.
              </p>
            ) : (
              contents.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-blue-200 bg-white shadow-sm p-5 transition hover:shadow-yellow-200 hover:border-yellow-300 hover:bg-yellow-50"
                >
                  <h3 className="text-xl font-semibold text-blue-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-blue-800 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
