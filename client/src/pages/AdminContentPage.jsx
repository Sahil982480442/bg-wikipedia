import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TopicContentPage() {
  const { courseId, topicId } = useParams();
  const [topic, setTopic] = useState({});
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const t = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topics/topic/${topicId}`);
      const c = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topic-content/approved/${topicId}`);
      setTopic(t.data);
      setContents(c.data);
    })();
  }, [topicId]);

  return (
    <div className="min-h-screen p-8 bg-gray-50 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
        <button
          onClick={() => navigate(`/submit/${courseId}/${topicId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Content
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Resources</h2>
      <div className="space-y-4">
        {contents.length === 0 && (
          <p className="text-gray-500">No content yet.</p>
        )}
        {contents.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-2 text-gray-700">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
