"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, User, Menu, LayoutDashboard, Users, FileText,
  BarChart3, Settings, GraduationCap, ClipboardCheck, Clock,
  LayoutGrid, Table2, ChevronLeft, ChevronRight, Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import Students from "../Counseler/Students";
import Assessments from "../Counseler/Assessments";
import Reports from "../Counseler/Reports";

const CARDS_PER_PAGE = 4;
const ITEMS_PER_PAGE = 4;

export default function CounselorDashboard() {
  const router = useRouter();
  const [counselor, setCounselor] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Card / Table toggle + pagination
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"
  const [currentPage, setCurrentPage] = useState(1);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={25} /> },
    { name: "Students", icon: <Users size={25} /> },
    { name: "Assessments", icon: <FileText size={25} /> },
    { name: "Reports", icon: <BarChart3 size={25} /> },
    { name: "Settings", icon: <Settings size={25} /> },
  ];

  /* ───── AUTH GUARD ───── */
  useEffect(() => {
    const stored = localStorage.getItem("counselor");
    if (!stored) {
      router.replace("/counselor/login");
      return;
    }
    const user = JSON.parse(stored);
    setCounselor(user);
    setAuthChecked(true);
    fetchDashboard();
    if (user.isFirstLogin) {
      setShowChangePassword(true);
    } else if (!user.isProfileComplete) {
      setShowProfileModal(true);
    }
  }, []);

  // Polling dashboard every 3 s
  useEffect(() => {
    if (!authChecked) return;
    const interval = setInterval(fetchDashboard, 3000);
    return () => clearInterval(interval);
  }, [authChecked]);

  /* ───── HANDLERS ───── */
  const handleLogout = () => {
    localStorage.removeItem("counselor");
    router.push("/counselor/login");
  };

  const handleChangePassword = async () => {
    const c = JSON.parse(localStorage.getItem("counselor"));
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    if (!passwordData.currentPassword || !passwordData.newPassword) { toast.error("Please fill all fields"); return; }
    if (passwordData.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      const res = await fetch(`${API}/counselor/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c._id, currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully");
        c.isFirstLogin = false;
        localStorage.setItem("counselor", JSON.stringify(c));
        setShowChangePassword(false);
        if (!c.isProfileComplete) setShowProfileModal(true);
        setPasswordData({ currentPassword: "", newPassword: "" });
      } else { toast.error(data.message); }
    } catch { toast.error("Server error"); }
  };

  const handleProfileChange = (e) => {
    if (e.target.name === "logo") {
      setProfileData({ ...profileData, logo: e.target.files[0] });
    } else {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ organizationName: "", organizationType: "", logo: null });

  const handleProfileSubmit = async () => {
    const c = JSON.parse(localStorage.getItem("counselor"));
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    if (!profileData.organizationName || !profileData.organizationType) { toast.error("All fields are required"); return; }
    const formData = new FormData();
    formData.append("id", c._id);
    formData.append("organizationName", profileData.organizationName);
    formData.append("organizationType", profileData.organizationType);
    if (profileData.logo) formData.append("logo", profileData.logo);
    try {
      const res = await fetch(`${API}/counselor/setup-profile`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile setup complete");
        c.isProfileComplete = true;
        localStorage.setItem("counselor", JSON.stringify(c));
        setShowProfileModal(false);
      } else { toast.error(data.message); }
    } catch { toast.error("Server error"); }
  };

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0, assessmentSentCount: 0, pendingStudentsCount: 0,
    pendingAssessments: [], recentActivity: [],
  });

  const fetchDashboard = async () => {
    const c = JSON.parse(localStorage.getItem("counselor"));
    if (!c) return;
    try {
      const res = await fetch(`http://localhost:5000/api/assessment/summary/${c._id}`);
      const data = await res.json();
      setDashboardData(data);
    } catch {}
  };

  // Pagination helpers
  const pendingList = dashboardData?.pendingAssessments || [];
const totalPages = Math.max(1, Math.ceil(pendingList.length / ITEMS_PER_PAGE));

const pagedItems1 = pendingList.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);
  const pagedItems = pendingList.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

  const statCards = [
    { label: "Total Students", value: dashboardData?.totalStudents || 0, icon: <GraduationCap size={22} />, color: "bg-[#3E5B3F] text-[#E6DEB5]", border: "border-[#E6DEB5]" },
    { label: "Assessments Sent", value: dashboardData?.assessmentSentCount || 0, icon: <ClipboardCheck size={22} />, color: "bg-[#3E5B3F] text-[#E6DEB5]", border: "border-[#E6DEB5]" },
    { label: "Pending Students", value: dashboardData?.pendingStudentsCount || 0, icon: <Clock size={22} />, color: "bg-[#3E5B3F] text-[#E6DEB5]", border: "border-[#E6DEB5]" },
  ];

  if (!authChecked) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .stat-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
        .card-item { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .card-item:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
        .toggle-btn { transition: background 0.15s, color 0.15s; }
        .sidebar-link { transition: background 0.15s, color 0.15s; }
        .page-btn { transition: background 0.15s; }
      `}</style>

      <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#f4f6f9]">

        {/* ── NAVBAR ── */}
        <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-[#3E5B3F] text-white flex items-center justify-between px-4 md:px-6 shadow-md">
          
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1 rounded hover:bg-[#155835]" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <span className="text-base font-semibold text-[#E6DEB5] tracking-wide">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm text-[#E6DEB5] truncate max-w-[140px] md:max-w-none font-medium">
              {counselor?.email}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#E6DEB5] text-[#3E5B3F] flex items-center justify-center shadow-inner">
              <User size={18} />
            </div>
          </div>
        </nav>

        {/* ── BODY ── */}
        <div className="flex flex-1 relative">

          {/* Mobile overlay */}
          {mobileOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          )}

          {/* ── SIDEBAR ── */}
         <aside className={`
  fixed top-16 left-0 z-40
  h-[calc(100vh-64px)]
  bg-[#3E5B3F] p-4 flex flex-col
  transition-all duration-300 shadow-xl
  ${mobileOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
  ${open ? "md:w-60" : "md:w-16"}
`}>
            <button className="md:hidden text-[#E6DEB5] mb-5 self-end" onClick={() => setMobileOpen(false)}>✕</button>
            <button onClick={() => setOpen(!open)} className="mb-6 text-[#E6DEB5] hidden md:flex items-center justify-center w-8 h-8 rounded hover:bg-[#155835]">
              <Menu size={20} />
            </button>

            <ul className="space-y-1 flex-1">
              {menuItems.map((item) => (
                <li key={item.name} className="relative group">
                  <button
                    onClick={() => { setActive(item.name); setMobileOpen(false); }}
                    className={`sidebar-link w-full flex items-center
                      ${open ? "gap-3 px-3 justify-start" : "justify-center"}
                      py-2.5 rounded-xl
                      ${active === item.name
                        ? "bg-white text-[#1a6e42] font-semibold shadow"
                        : "text-[#E6DEB5] hover:bg-[#155835] hover:text-white"
                      }`}
                  >
                    <span className={open ? "" : "flex justify-center w-full"}>{item.icon}</span>
                    {open && <span className="text-sm">{item.name}</span>}
                  </button>
                  {!open && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#3E5B3F] text-[#E6DEB5] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
                      {item.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {open && (
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-2.5 rounded-xl text-[#E6DEB5] text-sm font-medium transition">
                <LogOut size={17} /> Logout
              </button>
            )}
          </aside>

          {/* ── MAIN ── */}
          <main
            className={`flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden transition-all
            ${open ? "md:ml-56" : "md:ml-16"} mt-16`}
          >

            {active === "Dashboard" && (
              <div className="space-y-6 max-w-6xl mx-auto">

                {/* Welcome */}
                <div>
                  <h2 className="text-xl font-bold text-[#3E5B3F]">Overview</h2>
                  <p className="text-sm text-[#3E5B3F] mt-0.5">Here's what's happening today.</p>
                </div>

                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {statCards.map((c) => (
                    <div key={c.label} className={`stat-card bg-white rounded-2xl border ${c.border} p-5 flex items-center gap-4 shadow-sm`}>
                      <div className={`${c.color} rounded-xl p-3 flex-shrink-0`}>{c.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-none mb-1">{c.label}</p>
                        <p className="text-3xl font-bold text-gray-800 leading-none">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── PENDING ASSESSMENTS ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                  {/* Header row */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-[#3E5B3F]">Pending Assessments</h2>
                    {/* Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                      <button
                        onClick={() => { setViewMode("card"); setCurrentPage(1); }}
                        className={`toggle-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                          ${viewMode === "card" ? "bg-white text-[#3E5B3F] shadow" : "text-[#3E5B3F] hover:text-gray-700"}`}
                      >
                        <LayoutGrid size={14} /> Cards
                      </button>
                      <button
                        onClick={() => { setViewMode("table"); setCurrentPage(1); }}
                        className={`toggle-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                          ${viewMode === "table" ? "bg-white text-[#3E5B3F] shadow" : "text-[#3E5B3F] hover:text-gray-700"}`}
                      >
                        <Table2 size={14} /> Table
                      </button>
                    </div>
                  </div>

                  {/* ── CARD VIEW ── */}
                  {viewMode === "card" && (
                    <div className="p-5">
                      {pendingList.length === 0 ? (
                        <div className="text-center py-10 text-[#3E5B3F] text-sm">No pending assessments</div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {pagedItems.map((s) => (
                              <div key={s._id} className="card-item bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <User size={16} className="text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                                  <p className="text-xs text-gray-400 truncate">{s.email}</p>
                                </div>
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3E5B3F] border border-[#3E5B3F] px-2.5 py-1 rounded-full">
                                  In Progress
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                              <span className="text-xs text-gray-400">
                                Page {currentPage} of {totalPages} &nbsp;·&nbsp; {pendingList.length} total
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                  disabled={currentPage === 1}
                                  className="page-btn w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft size={15} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                                  <button
                                    key={pg}
                                    onClick={() => setCurrentPage(pg)}
                                    className={`page-btn w-8 h-8 rounded-lg text-xs font-semibold border
                                      ${pg === currentPage
                                        ? "bg-[#3E5B3F] text-[#E6DEB5] border-[#1a6e42]"
                                        : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                                  >
                                    {pg}
                                  </button>
                                ))}
                                <button
                                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                  disabled={currentPage === totalPages}
                                  className="page-btn w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ChevronRight size={15} />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* ── TABLE VIEW ── */}
                 {viewMode === "table" && (
                    <div className="overflow-x-auto">
                      <table className="min-w-[520px] w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#3E5B3F] uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#3E5B3F] uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-[#3E5B3F] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {pendingList.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center py-10 text-[#3E5B3F] text-sm">
                                No pending assessments
                              </td>
                            </tr>
                          ) : (
                            pagedItems1.map((s) => (   // ✅ IMPORTANT CHANGE
                              <tr key={s._id} className="hover:bg-gray-50 transition">
                                <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                                  {s.name}
                                </td>
                                <td className="px-5 py-3 text-gray-500 truncate max-w-[200px]">
                                  {s.email}
                                </td>
                                <td className="px-5 py-3">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3E5B3F] border border-[#3E5B3F] px-2.5 py-1 rounded-full">
                                    In Progress
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>

                      {/* 🔥 PAGINATION */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 border-t bg-white">
                          <span className="text-xs text-gray-400">
                            Page {currentPage} of {totalPages}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="w-8 h-8 border rounded flex items-center justify-center"
                            >
                              ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                              <button
                                key={pg}
                                onClick={() => setCurrentPage(pg)}
                                className={`w-8 h-8 rounded ${
                                  pg === currentPage
                                    ? "bg-[#3E5B3F] text-white"
                                    : "border"
                                }`}
                              >
                                {pg}
                              </button>
                            ))}

                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={currentPage === totalPages}
                              className="w-8 h-8 border rounded flex items-center justify-center"
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── RECENT ACTIVITY ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-[#3E5B3F]" />
                    <h2 className="text-base font-semibold text-[#3E5B3F]">Recent Activity</h2>
                  </div>
                  {dashboardData?.recentActivity?.length > 0 ? (
                    <ul className="space-y-2">
                      {dashboardData.recentActivity.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#3E5B3F]">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#3E5B3F] flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#3E5B3F] text-center py-6">No recent activity</p>
                  )}
                </div>

              </div>
            )}

            {active === "Students" && <Students />}
            {active === "Assessments" && <Assessments />}
            {active === "Reports" && <Reports />}
          </main>
        </div>
      </div>

      {/* ── CHANGE PASSWORD MODAL ── */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-7 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-1 text-center text-[#3E5B3F]">Change Password</h3>
            <p className="text-sm text-[#3E5B3F] mb-5 text-center">You must change your password before continuing</p>
            <input type="password" placeholder="Current Password text-[#3E5B3F]" value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border border-[#3E5B3F] p-3 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6e42]" />
            <input type="password" placeholder="New Password" value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border border-[#3E5B3F] p-3 rounded-xl mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6e42]" />
            <button onClick={handleChangePassword} className="w-full bg-[#3E5B3F] hover:bg-[#7a0008] text-[#E6DEB5] p-3 rounded-xl font-semibold transition">
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* ── SETUP PROFILE MODAL ── */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-7 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-5 text-center text-[#3E5B3F]">Setup Profile</h3>
            <input type="text" name="organizationName" placeholder="Organization Name" onChange={handleProfileChange}
              className="w-full border border-[3E5B3F] p-3 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6e42]" />
            <select name="organizationType" onChange={handleProfileChange}
              className="w-full border border-[#3E5B3F] p-3 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6e42] text-gray-600">
              <option value="">Select Organization Type</option>
              <option value="school">School</option>
              <option value="coaching">Coaching Class</option>
              <option value="counseling">Counseling Group</option>
              <option value="freelancer">Freelancer</option>
            </select>
            <input type="file" name="logo" accept="image/*" onChange={handleProfileChange}
              className="w-full mb-5 text-sm text-[#E6DEB5] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3E5B3F] file:text-white hover:file:bg-[#155835]" />
            <button onClick={handleProfileSubmit} className="w-full bg-[#3E5B3F] text-[#E6DEB5] hover:bg-[#7a0008] text-white p-3 rounded-xl font-semibold transition">
              Save Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}