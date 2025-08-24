import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HERO_IMAGE from "../../assets/Hero.avif";
import axios from "axios";


function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/login`,
        { username, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/admin/courses");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 bg-cover bg-fixed flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none z-0" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm bg-white rounded-2xl border border-blue-200 shadow-xl p-8 space-y-6"
        aria-label="Admin login form"
      >
        <h2 className="text-2xl font-extrabold text-blue-900 text-center">
          Admin Login
        </h2>
        {error && (
          <p className="text-red-600 text-sm text-center font-semibold">
            {error}
          </p>
        )}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full border border-blue-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full border border-blue-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95 transition"
          aria-label="Login"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
