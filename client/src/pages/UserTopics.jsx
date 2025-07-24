import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UserTopics() {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${courseId}`);
    setTopics(res.data);
  };

  const handleTopicClick = (topicId) => {
    navigate(`/user/courses/${courseId}/topics/${topicId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Topics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => handleTopicClick(topic.id)}
          >
            <h2 className="text-xl font-semibold">{topic.title}</h2>
            <p className="text-gray-600 mt-2">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTopics;
