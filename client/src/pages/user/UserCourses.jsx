import { useEffect, useState } from "react";
import axios from "axios";
import HERO_IMAGE from "../../assets/Hero.avif";
import logo from "../../assets/image.png";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";

function UserCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 6000));
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/courses`
      );
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };



  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
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
      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto py-5 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Sanjivani Logo"
              className="w-14 h-14 rounded-full shadow-md bg-white object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-900">
                Sanjivani Encyclopedia
              </h1>
              <div className="text-lg text-blue-700/80 font-medium">
                Spreading Drops of Nectar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Courses */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-lg mx-auto mb-10 relative">
          <input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white border border-blue-100 rounded-lg shadow-inner focus:outline-none focus:ring-1 transition"
            aria-label="Search courses"
          />
          <SearchIcon
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none"
                />
        </div>

        {/* ✅ Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-blue-700 text-lg opacity-70 mt-20">
            No courses found. Please check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {filtered.map((course) => (
              <div
                key={course.id}
                onClick={() =>
                  navigate(`/user/courses/${course.id}/topics`)
                }
                className="bg-white rounded-2xl p-6 shadow-md cursor-pointer hover:shadow-blue-300 transition group"
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    navigate(`/user/courses/${course.id}/topics`);
                }}
                aria-label={`View topics for course ${course.title}`}
              >
                <h2 className="text-xl font-extrabold text-blue-900 mb-2 group-hover:text-yellow-700 transition">
                  {course.title}
                </h2>
                <p className="text-blue-700 text-sm line-clamp-4 min-h-[4.5rem]">
                  {course.description || (
                    <span className="text-gray-400">(No description)</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-blue-800 text-sm font-medium">
          If you have any queries, contact{" "}
          <span className="font-semibold">Sujay Nimai Das</span> 📞 77768 07563
        </div>
      </div>
    </div>
  );
}

export default UserCourses;
