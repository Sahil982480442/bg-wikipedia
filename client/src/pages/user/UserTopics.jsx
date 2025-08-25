import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  FolderKanbanIcon,
  SearchIcon,
} from "lucide-react";
import HERO_IMAGE from "../../assets/Hero.avif";
import axios from "axios";

function UserTopics() {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 6000));
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`
      );
      setTopics(res.data);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (topicId) => {
    navigate(`/user/courses/${courseId}/topics/${topicId}`);
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed p-8 relative"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 bg-white/90 hover:bg-yellow-200 text-blue-800 px-4 py-2 rounded-full shadow transition active:scale-95"
        >
          <ArrowLeftIcon size={18} /> Back
        </button>

        <h1 className="flex justify-center items-center gap-2 text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 drop-shadow text-center">
          <FolderKanbanIcon className="text-yellow-600" size={32} />
          Topics
        </h1>

        {/* Search box */}
        <div className="max-w-lg mx-auto mb-10 relative">
          <input
            type="search"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring-1 transition"
            aria-label="Search topics"
          />
          <SearchIcon
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
          />
        </div>

        {/* Loader just below search */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <p className="text-center text-blue-700 opacity-70 mt-20">
            No topics found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                tabIndex={0}
                role="button"
                onClick={() => handleTopicClick(topic.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTopicClick(topic.id);
                }}
                className="cursor-pointer rounded-2xl bg-white p-6 shadow-md transition hover:shadow-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
                aria-label={`View content for topic ${topic.title}`}
              >
                <h2 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-yellow-700 transition">
                  {topic.title}
                </h2>
                <p className="text-blue-700 text-sm line-clamp-4 min-h-[4.5rem]">
                  {topic.description || (
                    <span className="text-gray-400">(No description)</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-blue-800 text-sm font-medium">
          If you have any queries, contact{" "}
          <span className="font-semibold">Sujay Nimai Das</span> 📞 77768 07563
        </div>
      </div>
    </div>
  );
}

export default UserTopics;
