"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import { Eye } from "lucide-react";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    const counselor = JSON.parse(localStorage.getItem("counselor"));

    const res = await API.get(
      `/assessment/summary/${counselor._id}`
    );

    // 🔥 only completed students
    setStudents(res.data.completed);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewReport = async (token) => {
    try {
      const res = await API.post("/assessment/report", {
        token,
      });

      setSelectedReport(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* 🔥 TABLE */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
  <h2 className="text-lg font-semibold mb-4">
    Completed Assessments
  </h2>

  <table className="w-full text-sm border-collapse">

    {/* HEADER */}
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-3 text-left font-semibold">Name</th>
        <th className="px-4 py-3 text-left font-semibold">Email</th>
        <th className="px-4 py-3 text-left font-semibold">Phone</th>
        <th className="px-4 py-3 text-left font-semibold">Class</th>
        <th className="px-4 py-3 text-left font-semibold">School</th>
        <th className="px-4 py-3 text-center font-semibold">Action</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {students.map((s) => (
        <tr
          key={s._id}
          className="border-t hover:bg-gray-50 transition"
        >
          <td className="px-4 py-3">{s.name}</td>
          <td className="px-4 py-3">{s.email}</td>
          <td className="px-4 py-3">{s.phone}</td>
          <td className="px-4 py-3">{s.class}</td>
          <td className="px-4 py-3">{s.schoolName}</td>

          <td className="px-4 py-3 text-center">
            <button
            onClick={() => handleViewReport(s.token)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded transition"
            >
              <Eye size={18} />
            </button>
          </td>
        </tr>
      ))}

      {students.length === 0 && (
        <tr>
          <td colSpan="6" className="text-center py-4 text-gray-500">
            No completed reports
          </td>
        </tr>
      )}
    </tbody>

  </table>
</div>

      {/* 🔥 REPORT VIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">
              Student Report
            </h2>

            {/* 🔥 SHOW REPORT */}
            <div className="space-y-6">

  <h2 className="text-xl font-bold text-center text-[#1a6e42]">
    Student Career Report
  </h2>

  {/* CAREER */}
  <div>
    <h3 className="font-semibold text-green-700">🎯 Career Suggestions</h3>
    <ul className="list-disc pl-5">
      {selectedReport.careerSuggestions?.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

  {/* STRENGTHS */}
  <div>
    <h3 className="font-semibold text-blue-700">💪 Strengths</h3>
    <ul className="list-disc pl-5">
      {selectedReport.strengths?.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

  {/* IMPROVEMENTS */}
  <div>
    <h3 className="font-semibold text-red-600">⚡ Areas of Improvement</h3>
    <ul className="list-disc pl-5">
      {selectedReport.improvements?.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

  {/* SKILLS */}
  <div>
    <h3 className="font-semibold text-purple-700">🧠 Skills to Learn</h3>
    <ul className="list-disc pl-5">
      {selectedReport.skillsToLearn?.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>

  {/* ROADMAP */}
  <div>
    <h3 className="font-semibold text-yellow-600">🗺️ Career Roadmap</h3>
    <ol className="list-decimal pl-5">
      {selectedReport.roadmap?.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  </div>

</div>

            <button
              onClick={() => setSelectedReport(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}