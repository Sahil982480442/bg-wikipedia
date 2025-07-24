import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminLogin from "./pages/AdminLogin";
import UserCourses from "./pages/UserCourses";
import AdminCourses from "./pages/AdminCourses";
import UserTopics from "./pages/UserTopics";
import AdminTopics from "./pages/AdminTopics";
import UserContentPage from "./pages/UserContentPage";
import AdminContentPage from "./pages/AdminContentPage";
import AddContentPage from "./pages/AddContentPage";
import AdminPendingPage from "./pages/AdminPendingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/courses" element={<UserCourses />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/user/courses/:courseId/topics" element={<UserTopics />} />
      <Route path="/admin/courses/:courseId/topics" element={<AdminTopics />} />
      <Route path="/user/courses/:courseId/topics/:topicId" element={<UserContentPage />} />
      <Route path="/admin/courses/:courseId/topics/:topicId" element={<AdminContentPage />} />
      <Route path="/submit/:courseId/:topicId" element={<AddContentPage />} />
      <Route path="/admin/pending" element={<AdminPendingPage />} />

      
    </Routes>
  );
}

export default App;
