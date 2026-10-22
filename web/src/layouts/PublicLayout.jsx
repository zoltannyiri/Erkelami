import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Topbar from "../components/Topbar";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f1e8]">
      <Topbar />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
