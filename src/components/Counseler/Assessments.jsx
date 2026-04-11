"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import {
  RefreshCcw,
  Search,
  Table,
  LayoutGrid,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Assessments() {
  const [data, setData] = useState({
    completed: [],
    inProgress: [],
    notStarted: [],
  });

  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSummary = async () => {
    const counselor = JSON.parse(localStorage.getItem("counselor"));
    const res = await API.get(`/assessment/summary/${counselor._id}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // MERGE
  const getAllData = () => {
    return [
      ...data.notStarted,
      ...data.inProgress,
      ...data.completed,
    ];
  };

const handleExport = () => {
  if (filteredData.length === 0) return;

  const headers = ["Name", "Email", "Phone", "Class", "School", "Status"];

  const rows = filteredData.map((s) => {
    let status = getStatus(s);

    return [
      s.name,
      s.email,
      s.phone,
      s.class,
      s.schoolName,
      status,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "assessments.csv";
  a.click();
};

  // FILTER
  const getFilteredData = () => {
    let list = [];

    if (active === "all") list = getAllData();
    else list = data[active] || [];

    return list.filter((s) =>
      `${s.name} ${s.email} ${s.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  // ✅ DIFFERENT PAGINATION FOR BOTH VIEWS
  const ITEMS_PER_PAGE = view === "table" ? 7 : 4;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );

  const pagedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // STATUS HELPER
  const getStatus = (s) => {
    if (data.completed.some((x) => x._id === s._id)) return "completed";
    if (data.inProgress.some((x) => x._id === s._id)) return "inProgress";
    if (data.notStarted.some((x) => x._id === s._id)) return "notStarted";
    return "unknown";
  };

  return (
    <div className="space-y-4">

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white flex-1">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={fetchSummary} className="flex items-center gap-1 bg-gray-200 px-3 py-2 rounded">
            <RefreshCcw size={16} /> Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded"
          >
            <Download size={16} /> CSV
          </button>

          <button onClick={() => { setView("table"); setCurrentPage(1); }}
            className={`p-2 rounded ${view === "table" ? "bg-[#1a6e42] text-white" : "bg-gray-200"}`}>
            <Table size={18} />
          </button>

          <button onClick={() => { setView("card"); setCurrentPage(1); }}
            className={`p-2 rounded ${view === "card" ? "bg-[#1a6e42] text-white" : "bg-gray-200"}`}>
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* FILTER */}
      <select
        value={active}
        onChange={(e) => {
          setActive(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white shadow-sm"
      >
        <option value="all">All</option>
        <option value="notStarted">Not Started</option>
        <option value="inProgress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* ================= TABLE VIEW ================= */}
      {view === "table" ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">School</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {pagedData.map((s) => {
                const status = getStatus(s);

                return (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.phone}</td>
                    <td className="px-4 py-3">{s.class}</td>
                    <td className="px-4 py-3">{s.schoolName}</td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full text-white
                          ${status === "completed" ? "bg-green-500" :
                            status === "inProgress" ? "bg-blue-500" :
                            status === "notStarted" ? "bg-yellow-500" :
                            "bg-gray-400"
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 border rounded flex items-center justify-center">
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded ${pg === currentPage ? "bg-[#3E5B3F] text-white" : "border"}`}>
                    {pg}
                  </button>
                ))}

                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 border rounded flex items-center justify-center">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      ) : (

        /* ================= CARD VIEW ================= */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          {pagedData.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No students found
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pagedData.map((s) => {
                  let status = getStatus(s);

                  return (
                    <div key={s._id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
                      
                      {/* SAME YOUR STRUCTURE */}
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                        <p className="text-sm">{s.phone}</p>
                        <p className="text-sm">{s.class}</p>
                        <p className="text-sm">{s.schoolName}</p>
                      </div>

                      <div className="flex justify-end">
                        <span
                          className={`text-xs px-3 py-1 rounded-full text-white
                            ${status === "completed" ? "bg-green-500" :
                              status === "inProgress" ? "bg-blue-500" :
                              status === "notStarted" ? "bg-yellow-500" :
                              "bg-gray-400"
                            }`}
                        >
                          {status}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t">
                  <span className="text-xs text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 border rounded flex items-center justify-center">
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-8 h-8 rounded ${pg === currentPage ? "bg-[#3E5B3F] text-white" : "border"}`}>
                        {pg}
                      </button>
                    ))}

                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 border rounded flex items-center justify-center">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}