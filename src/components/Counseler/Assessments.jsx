"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import { RefreshCcw, Search, Table, LayoutGrid, Download } from "lucide-react";

export default function Assessments() {
  const [data, setData] = useState({
    completed: [],
    inProgress: [],
    notStarted: [],
  });

  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table"); // table | card

  const fetchSummary = async () => {
    const counselor = JSON.parse(localStorage.getItem("counselor"));

    const res = await API.get(
      `/assessment/summary/${counselor._id}`
    );

    setData(res.data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // 🔥 MERGE DATA FOR "ALL"
  const getAllData = () => {
    return [
      ...data.notStarted,
      ...data.inProgress,
      ...data.completed,
    ];
  };

  // 🔥 FILTER LOGIC
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

  // 🔥 EXPORT CSV
    const handleExport = () => {
      if (filteredData.length === 0) return;

      const headers = ["Name", "Email", "Phone", "Class", "School", "Status"];

      const rows = filteredData.map((s) => {
        let status = "unknown";

        if (data.completed.some((x) => x._id === s._id)) {
          status = "completed";
        } else if (data.inProgress.some((x) => x._id === s._id)) {
          status = "inProgress";
        } else if (data.notStarted.some((x) => x._id === s._id)) {
          status = "notStarted";
        }

        return [
          s.name,
          s.email,
          s.phone,
          s.class,
          s.schoolName,
          status, // ✅ NEW FIELD
        ];
      });

      const csvContent =
        [headers, ...rows]
          .map((e) => e.join(","))
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "assessments.csv";
      a.click();
    };

  return (
    <div className="space-y-4">

      {/* 🔥 TOP BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch">

          {/* 🔍 SEARCH (FULL WIDTH) */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white flex-1">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 🔥 ACTION BUTTONS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchSummary}
              className="flex items-center gap-1 bg-gray-200 px-3 py-2 rounded"
            >
              <RefreshCcw size={16} /> Refresh
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded"
            >
              <Download size={16} /> CSV
            </button>

            <button
              onClick={() => setView("table")}
              className={`p-2 rounded ${view === "table" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              <Table size={18} />
            </button>

            <button
              onClick={() => setView("card")}
              className={`p-2 rounded ${view === "card" ? "bg-black text-white" : "bg-gray-200"}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
      </div>

      {/* 🔥 FILTER */}
     <div className="w-full sm:w-auto">
  <select
    value={active}
    onChange={(e) => setActive(e.target.value)}
    className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none"
  >
    <option value="all">All</option>
    <option value="notStarted">Not Started</option>
    <option value="inProgress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</div>

      {/* 🔥 DATA VIEW */}
      {view === "table" ? (
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Class</th>
              <th className="px-4 py-3 text-left font-semibold">School</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredData.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.phone}</td>
                <td className="px-4 py-3">{s.class}</td>
                <td className="px-4 py-3">{s.schoolName}</td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    ) : (
        /* 🔥 CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredData.map((s) => (
            <div key={s._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{s.name}</h3>
              <p className="text-sm text-gray-600">{s.email}</p>
              <p className="text-sm">{s.phone}</p>
              <p className="text-sm">{s.class}</p>
              <p className="text-sm">{s.schoolName}</p>
            </div>
          ))}

          {filteredData.length === 0 && (
            <p className="text-gray-500">No students found</p>
          )}
        </div>
      )}
    </div>
  );
}