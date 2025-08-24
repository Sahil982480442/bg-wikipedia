import { useNavigate } from "react-router-dom";
import HERO_IMAGE from "../assets/Hero.avif";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />

      <div className="relative z-10 bg-white rounded-2xl border border-blue-200 shadow-xl p-12 max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
          Welcome
        </h1>
        <p className="text-blue-700 text-lg">Please select a role</p>

        <div className="flex justify-center gap-8">
          <button
            onClick={() => navigate("/user/courses")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
            aria-label="Navigate to User Courses"
          >
            User
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
            aria-label="Navigate to Admin Login"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
