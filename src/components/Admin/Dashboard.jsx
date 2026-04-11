"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut, User, LayoutDashboard, Users, FileText,
  BarChart3, TrendingUp, Shield
} from "lucide-react";
import Counselor from "./Counselor";
import Students from "./Students";
import Assessments from "./Assessments";

export default function Dashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) {
      router.push("/admin-login");
    } else {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Students", icon: <Users size={20} /> },
    { name: "Assessments", icon: <FileText size={20} /> },
    { name: "Counselors", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .nav-link { transition: background 0.15s, color 0.15s; }
      `}</style>

      {/* NAVBAR */}
      <nav className="w-full h-16 bg-[#3E5B3F] text-[#E6DEB5] flex items-center justify-between px-6 shadow-md z-20 relative">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-[#E6DEB5] opacity-80" />
          <h1 className="text-base font-semibold tracking-wide">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#c8dbc8] hidden sm:block">{admin?.email}</span>
          <div className="w-9 h-9 rounded-full bg-[#E6DEB5] text-[#3E5B3F] flex items-center justify-center font-bold text-sm">
            {admin?.name ? admin.name[0].toUpperCase() : <User size={16} />}
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-56 bg-[#3E5B3F] min-h-[calc(100vh-64px)] p-4 flex flex-col shadow-lg">
          <ul className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActive(item.name)}
                  className={`nav-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    ${active === item.name
                      ? "bg-white text-[#3E5B3F] shadow-sm"
                      : "text-[#E6DEB5] hover:bg-[#2f4a30]"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2.5 rounded-xl text-white text-sm font-medium transition mt-4"
          >
            <LogOut size={16} /> Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {active === "Dashboard" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-[#3E5B3F] rounded-2xl p-8 text-[#E6DEB5] shadow">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp size={22} />
                  <h2 className="text-xl font-semibold">
                    Welcome back, {admin?.name || admin?.email || "Admin"}
                  </h2>
                </div>
                <p className="text-sm text-[#c8dbc8]">
                  Use the sidebar to manage students, assessments, and counselors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Manage Students", desc: "View and manage all students", icon: <Users size={20} />, tab: "Students" },
                  { label: "Assessments", desc: "Track all assessments", icon: <FileText size={20} />, tab: "Assessments" },
                  { label: "Counselors", desc: "Create and manage counselors", icon: <BarChart3 size={20} />, tab: "Counselors" },
                ].map((c) => (
                  <button
                    key={c.tab}
                    onClick={() => setActive(c.tab)}
                    className="bg-white rounded-2xl border border-[#d6e4d6] p-5 text-left hover:shadow-md transition hover:border-[#3E5B3F] group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#eaf2ea] text-[#3E5B3F] flex items-center justify-center mb-3 group-hover:bg-[#3E5B3F] group-hover:text-[#E6DEB5] transition">
                      {c.icon}
                    </div>
                    <p className="font-semibold text-[#3E5B3F] text-sm">{c.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === "Students" && <Students />}
          {active === "Assessments" && <Assessments />}
          {active === "Counselors" && <Counselor />}
        </main>
      </div>
    </div>
  );
}