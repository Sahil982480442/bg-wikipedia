import { useEffect, useState } from "react";
import axios from "axios";
import HERO_IMAGE from "../../assets/Hero.avif";

export default function AdminPendingPage() {
  const [requests, setRequests] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [topicsMap, setTopicsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
    const map = {};
    res.data.forEach((course) => {
      map[course.id] = course.title;
    });
    setCoursesMap(map);
  };

  const fetchTopicsForCourses = async (courseIds) => {
    const map = {};
    await Promise.all(
      courseIds.map(async (cid) => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/topics/${cid}`);
          res.data.forEach((topic) => {
            map[topic.id] = topic.title;
          });
        } catch {

        }
      })
    );
    setTopicsMap(map);
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/pending`
      );
      setRequests(res.data);

      const courseIds = [...new Set(res.data.map((r) => r.course_id))];
      fetchTopicsForCourses(courseIds);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchRequests();
  }, []);

  const act = async (id, approve) => {
    if (approve) {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/approve/${id}`
      );
    } else {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/topic-content/reject/${id}`
      );
    }
    fetchRequests();
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

      <div className="relative z-10">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
          Pending Requests
        </h1>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No pending requests */}
        {!loading && requests.length === 0 && (
          <p className="text-blue-700 text-center text-lg opacity-70">
            No pending requests.
          </p>
        )}

        {/* Requests list */}
        {!loading && (
          <ul className="space-y-6">
            {requests.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-2xl border border-blue-200 shadow-lg p-6 flex flex-col sm:flex-row justify-between gap-6"
              >
                <div className="flex-1">
                  <p className="text-blue-800 font-semibold">
                    <span className="text-yellow-600">Course:</span>{" "}
                    {coursesMap[r.course_id] || r.course_id}
                  </p>
                  <p className="text-blue-800 font-semibold">
                    <span className="text-yellow-600">Topic:</span>{" "}
                    {topicsMap[r.topic_id] || r.topic_id}
                  </p>
                  <p className="text-blue-800 font-semibold">
                    <span className="text-yellow-600">By:</span> {r.name} / {r.mobile}
                  </p>
                  <p className="mt-2 text-blue-900 font-bold text-lg">{r.title}</p>
                  <p className="mt-1 text-blue-700 whitespace-pre-wrap">{r.content}</p>
                </div>
                <div className="flex flex-col space-y-3 sm:space-y-4 sm:w-32">
                  <button
                    onClick={() => act(r.id, true)}
                    className="rounded-xl bg-green-600 text-white py-2 font-semibold shadow hover:bg-green-700 transition focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
                    aria-label={`Approve content request titled ${r.title}`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act(r.id, false)}
                    className="rounded-xl bg-red-600 text-white py-2 font-semibold shadow hover:bg-red-700 transition focus:outline-none focus:ring-4 focus:ring-red-300 active:scale-95"
                    aria-label={`Reject content request titled ${r.title}`}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
