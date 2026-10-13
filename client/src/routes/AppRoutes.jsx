import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "../pages/Home/Events";
import EventDetail from "../pages/Home/EventDetail";
import Login from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";
import MyEvents from "../pages/profile/MyEvents";
import Profile from "../pages/profile/Profile";
import Navbar from "../components/layout/Navbar";

function AppRoutes() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
