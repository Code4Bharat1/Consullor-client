"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, LayoutGrid, Table2, User, GraduationCap, UserCheck, ClipboardList } from "lucide-react";

const CARDS_PER_PAGE = 6;

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [page, setPage] = useState(1);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/assessment/all`);
      const data = await res.json();
      setAssessments(Array.isArray(data) ? data : data.assessments || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAssessments(); }, []);

  const filtered = assessments.filter((a) => {
    const q = search.toLowerCase();
    const studentName = a.studentName || a.student?.name || "";
    const counselorName = a.counselorName || a.counselor?.name || a.counselor?.email || "";
    const std = a.std || a.student?.std || "";
    const status = a.status || "";
    return (
      studentName.toLowerCase().includes(q) ||
      counselorName.toLowerCase().includes(q) ||
      std.toLowerCase().includes(q) ||
      status.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const paged = viewMode === "card"
    ? filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)
    : filtered;

  const getStudentName = (a) => a.studentName || a.student?.name || "—";
  const getStudentStd = (a) => a.std || a.student?.std || "—";
  const getCounselorName = (a) => a.counselorName || a.counselor?.name || a.counselor?.email || "—";

  const statusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return { wrap: "bg-green-50 text-green-600 border-green-100", dot: "bg-green-500", label: "Completed" };
    if (s === "in_progress" || s === "in progress") return { wrap: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500", label: "In Progress" };
    if (s === "pending") return { wrap: "bg-yellow-50 text-yellow-600 border-yellow-100", dot: "bg-yellow-500", label: "Pending" };
    return { wrap: "bg-gray-50 text-gray-500 border-gray-100", dot: "bg-gray-400", label: status || "—" };
  };

  return (
    <div className="space-y-5 max-w-6xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#3E5B3F]">Assessments</h2>
        <p className="text-sm text-gray-400 mt-0.5">{assessments.length} total assessments</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-[#d6e4d6] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-[#f4f6f4] rounded-xl px-3 py-2 border border-[#d6e4d6]">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by student, counselor, class, status…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAssessments} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d6e4d6] text-[#3E5B3F] hover:bg-[#eaf2ea] transition" title="Refresh">
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
          {search ? "No assessments match your search." : "No assessments found."}
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-[#d6e4d6] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-sm">
              <thead className="bg-[#3E5B3F]">
                <tr>
                  {["Student", "Class / Std", "Counselor", "Assessment", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#E6DEB5] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ee]">
                {filtered.map((a) => {
                  const st = statusStyle(a.status);
                  return (
                    <tr key={a._id} className="hover:bg-[#f9fbf9] transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#eaf2ea] text-[#3E5B3F] flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {getStudentName(a)?.[0]?.toUpperCase() || <User size={12} />}
                          </div>
                          <span className="font-medium text-gray-800">{getStudentName(a)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#eaf2ea] text-[#3E5B3F] border border-[#d6e4d6]">
                          <GraduationCap size={11} /> {getStudentStd(a)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserCheck size={13} className="text-gray-400 flex-shrink-0" />
                          {getCounselorName(a)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{a.assessmentName || a.title || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.wrap}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paged.map((a) => {
              const st = statusStyle(a.status);
              return (
                <div key={a._id} className="bg-white rounded-2xl border border-[#d6e4d6] p-5 hover:shadow-md transition hover:border-[#3E5B3F]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3E5B3F] text-[#E6DEB5] flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {getStudentName(a)?.[0]?.toUpperCase() || <User size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm">{getStudentName(a)}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-[#3E5B3F] font-medium">
                          <GraduationCap size={10} /> Class {getStudentStd(a)}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${st.wrap}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                      {st.label}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm border-t border-[#eef2ee] pt-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <UserCheck size={13} className="flex-shrink-0" />
                      <span className="truncate">{getCounselorName(a)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <ClipboardList size={13} className="flex-shrink-0" />
                      <span className="truncate">{a.assessmentName || a.title || "General Assessment"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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