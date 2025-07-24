import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-600">Please select a role</p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/user/courses")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg transition duration-300"
          >
            User
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg transition duration-300"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
