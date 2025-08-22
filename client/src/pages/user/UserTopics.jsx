import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function UserTopics() {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line
  }, []);

  const fetchTopics = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`
    );
    setTopics(res.data);
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
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 drop-shadow text-center">
          Topics
        </h1>

        {/* Search box */}
        <div className="max-w-lg mx-auto mb-10 relative">
          <input
            type="search"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-blue-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
            aria-label="Search topics"
          />
        </div>

        {filteredTopics.length === 0 ? (
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
                className="cursor-pointer rounded-2xl bg-white p-6 shadow-md transition hover:shadow-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label={`View content for topic ${topic.title}`}
              >
                <h2 className="text-xl font-bold text-blue-900 mb-2">
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
          If you have any queries, contact <span className="font-semibold">Sujay Nimai Das</span> 📞 77768 07563
        </div>
      </div>
    </div>
  );
}

export default UserTopics;
