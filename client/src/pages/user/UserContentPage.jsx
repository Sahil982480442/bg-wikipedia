import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HERO_IMAGE from "../../assets/Hero.avif";
import { Copy, Check, ArrowLeftIcon, PlusCircleIcon, BookOpenIcon, FileTextIcon } from "lucide-react";


export default function TopicContentPage() {
  const { courseId, topicId } = useParams();
  const [topic, setTopic] = useState({});
  const [contents, setContents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
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

  const handleCopy = (id, title, content) => {
    const textToCopy = `${title}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1000);
    });
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />
      <div className="relative z-10  mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
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
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-xl transition focus:outline-none active:scale-95"
          >
            <PlusCircleIcon size={20} />
            Add Content
          </button>
        </div>

        {/* Approved Resources */}
        <section className="bg-white/80 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-800 drop-shadow">
            <FileTextIcon className="text-yellow-600" />
            Resources
          </h2>
          <div className="space-y-2 min-h-[100px]">
            {contents.length === 0 ? (
              <p className="text-blue-700/80 text-center text-lg opacity-70">
                No approved content yet.
              </p>
            ) : (
              contents.map((item) => (
                <article
                  key={item.id}
                  className="relative rounded-xl border border-blue-100 bg-white/90 shadow  transition group p-6"
                >
                  {/* Copy Icon Button */}
                  <button
                    onClick={() =>
                      handleCopy(item.id, item.title, item.content)
                    }
                    className="absolute top-3 right-3 p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    title="Copy"
                  >
                    {copiedId === item.id ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-blue-600" />
                    )}
                  </button>

                  <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2 group-hover:text-yellow-800 transition">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-blue-800 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
        <div className="mt-12 text-center text-blue-800 text-sm font-medium">
          If you have any queries, contact <span className="font-semibold">Sujay Nimai Das</span> 📞 77768 07563
        </div>
      </div>
    </div>
  );
}
