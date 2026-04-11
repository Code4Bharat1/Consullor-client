"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, LayoutGrid, Table2, User, Mail, GraduationCap, UserCheck } from "lucide-react";

const CARDS_PER_PAGE = 6;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [page, setPage] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/student/all`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.std?.toLowerCase().includes(q) ||
      s.counselorName?.toLowerCase().includes(q) ||
      s.counselor?.name?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const paged = viewMode === "card"
    ? filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)
    : filtered;

  const getCounselorName = (s) =>
    s.counselorName || s.counselor?.name || s.counselor?.email || "—";

  return (
    <div className="space-y-5 max-w-6xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#3E5B3F]">Students</h2>
        <p className="text-sm text-gray-400 mt-0.5">{students.length} total students</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-[#d6e4d6] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-[#f4f6f4] rounded-xl px-3 py-2 border border-[#d6e4d6]">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, class, counselor…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStudents} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d6e4d6] text-[#3E5B3F] hover:bg-[#eaf2ea] transition" title="Refresh">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="flex items-center bg-[#f4f6f4] rounded-xl p-1 gap-1 border border-[#d6e4d6]">
            <button onClick={() => { setViewMode("table"); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === "table" ? "bg-[#3E5B3F] text-[#E6DEB5] shadow" : "text-gray-500 hover:text-gray-700"}`}>
              <Table2 size={13} /> Table
            </button>
            <button onClick={() => { setViewMode("card"); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === "card" ? "bg-[#3E5B3F] text-[#E6DEB5] shadow" : "text-gray-500 hover:text-gray-700"}`}>
              <LayoutGrid size={13} /> Cards
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#d6e4d6] p-12 text-center text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#d6e4d6] p-12 text-center text-gray-400 text-sm">
          {search ? "No students match your search." : "No students found."}
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-[#d6e4d6] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-[#3E5B3F]">
                <tr>
                  {["Student", "Email", "Class / Std", "Counselor", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#E6DEB5] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ee]">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-[#f9fbf9] transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#eaf2ea] text-[#3E5B3F] flex items-center justify-center font-semibold text-xs flex-shrink-0">
                          {s.name?.[0]?.toUpperCase() || <User size={12} />}
                        </div>
                        <span className="font-medium text-gray-800">{s.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{s.email || "—"}</td>
                    <td className="px-5 py-3.5">
                      {s.std ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#eaf2ea] text-[#3E5B3F] border border-[#d6e4d6]">
                          <GraduationCap size={11} /> {s.std}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCheck size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{getCounselorName(s)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.assessmentStatus === "completed" ? "bg-green-50 text-green-600 border-green-100" : s.assessmentStatus === "in_progress" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.assessmentStatus === "completed" ? "bg-green-500" : s.assessmentStatus === "in_progress" ? "bg-blue-500" : "bg-gray-400"}`}></span>
                        {s.assessmentStatus === "completed" ? "Completed" : s.assessmentStatus === "in_progress" ? "In Progress" : "Not Started"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paged.map((s) => (
              <div key={s._id} className="bg-white rounded-2xl border border-[#d6e4d6] p-5 hover:shadow-md transition hover:border-[#3E5B3F]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#3E5B3F] text-[#E6DEB5] flex items-center justify-center font-bold text-base flex-shrink-0">
                    {s.name?.[0]?.toUpperCase() || <User size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{s.name || "—"}</p>
                    {s.std && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#3E5B3F] font-medium">
                        <GraduationCap size={11} /> Class {s.std}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={13} className="flex-shrink-0" />
                    <span className="truncate">{s.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <UserCheck size={13} className="flex-shrink-0" />
                    <span className="truncate">{getCounselorName(s)}</span>
                  </div>
                  <div className="pt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.assessmentStatus === "completed" ? "bg-green-50 text-green-600 border-green-100" : s.assessmentStatus === "in_progress" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.assessmentStatus === "completed" ? "bg-green-500" : s.assessmentStatus === "in_progress" ? "bg-blue-500" : "bg-gray-400"}`}></span>
                      {s.assessmentStatus === "completed" ? "Completed" : s.assessmentStatus === "in_progress" ? "In Progress" : "Not Started"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400">Page {page} of {totalPages} · {filtered.length} total</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#d6e4d6] text-[#3E5B3F] hover:bg-[#eaf2ea] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold border transition ${pg === page ? "bg-[#3E5B3F] text-[#E6DEB5] border-[#3E5B3F]" : "border-[#d6e4d6] text-gray-600 hover:bg-[#eaf2ea]"}`}>{pg}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#d6e4d6] text-[#3E5B3F] hover:bg-[#eaf2ea] disabled:opacity-30 disabled:cursor-not-allowed transition text-xs">›</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}