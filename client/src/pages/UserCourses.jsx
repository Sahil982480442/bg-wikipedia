import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function UserCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/courses`);
    setCourses(res.data);
  };

  const filtered = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      <input
        type="text"
        placeholder="Search courses..."
        className="w-full p-2 border rounded-lg mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/user/courses/${course.id}/topics`)} 
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"            
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {course.title}
            </h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserCourses;
