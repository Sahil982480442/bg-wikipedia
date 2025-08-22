import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import UserCourses from "./pages/user/UserCourses";
import AdminCourses from "./pages/admin/AdminCourses";
import UserTopics from "./pages/user/UserTopics";
import AdminTopics from "./pages/admin/AdminTopics";
import UserContentPage from "./pages/user/UserContentPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AddContentPage from "./pages/AddContentPage";
import AdminPendingPage from "./pages/admin/AdminPendingPage";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<PrivateRoute />}>
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/courses/:courseId/topics" element={<AdminTopics />} />
        <Route path="/admin/courses/:courseId/topics/:topicId" element={<AdminContentPage />} />
        <Route path="/admin/pending" element={<AdminPendingPage />} />
      </Route>

      <Route path="/user/courses" element={<UserCourses />} />      
      <Route path="/user/courses/:courseId/topics" element={<UserTopics />} />      
      <Route path="/user/courses/:courseId/topics/:topicId" element={<UserContentPage />} />      
      <Route path="/submit/:courseId/:topicId" element={<AddContentPage />} />
      

      
    </Routes>
  );
}

export default App;
