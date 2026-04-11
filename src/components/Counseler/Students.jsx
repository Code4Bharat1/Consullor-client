"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";

export default function Students() {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("table"); // 🔥 table | card
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "10th",
    schoolName: "",
  });

  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchStudents = async () => {
    const counselor = JSON.parse(localStorage.getItem("counselor"));

    const res = await API.get(
      `/students?counselorId=${counselor._id}`
    );
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSendAssessment = async (id) => {
    try {
      await API.post(`/students/send/${id}`);
      toast.success("Link generated & sent!");
      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    try {
      const emailExists = students.some(
        (s) => s.email === studentData.email
      );

      const phoneExists = students.some(
        (s) => s.phone === studentData.phone
      );

      if (emailExists) return toast.error("Email already exists");
      if (phoneExists) return toast.error("Phone number already exists");

      const counselor = JSON.parse(localStorage.getItem("counselor"));

      await API.post("/students", {
        ...studentData,
        counselorId: counselor._id,
      });

      toast.success("Student Created");

      await fetchStudents();

      setStudentData({
        name: "",
        email: "",
        phone: "",
        class: "10th",
        schoolName: "",
      });

      setShowModal(false);
    } catch (err) {
      console.log(err);
      toast.error("Error creating student");
    }
  };

  // 🔥 FILTER LOGIC (SEARCH + STATUS)
  const filteredStudents = students.filter((s) => {
    const matchesSearch = `${s.name} ${s.email} ${s.phone} ${s.schoolName}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || s.assessmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const ITEMS_PER_PAGE = view === "table" ? 10 : 6;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
  );

  const pagedStudents = filteredStudents.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
  );  

  return (
    <div>
      {/* 🔥 TOP BAR — single line */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* CREATE BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#3E5B3F] text-[#E6DEB5] px-4 py-2 rounded-lg whitespace-nowrap font-medium hover:bg-[#d8cf9e] hover:text-[#3E5B3F] transition-colors"
        >
          + Create Student
        </button>

        {/* SEARCH — grows to fill space */}
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          className="border px-3 py-2 rounded-lg flex-1 min-w-[200px]"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          className="border px-3 py-2 rounded-lg bg-white text-sm cursor-pointer"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="Not Sent">Not Sent</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* REFRESH BUTTON */}
        <button
          onClick={fetchStudents}
          title="Refresh list"
          className="border px-3 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-600"
        >
          {/* Refresh icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        {/* VIEW TOGGLE — icon buttons */}
        <div className="flex gap-1 border rounded-lg overflow-hidden">
          {/* Table icon */}
          <button
            onClick={() => {
              setView("table");
              setCurrentPage(1);
            }}
            title="Table view"
            className={`px-3 py-2 transition-colors ${
              view === "table" ? "bg-[#1a6e42] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
          </button>

          {/* Card icon */}
          <button
            onClick={() => {
              setView("card");
              setCurrentPage(1);
            }}
            title="Card view"
            className={`px-3 py-2 transition-colors ${
              view === "card" ? "bg-[#1a6e42] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* 🔥 TABLE VIEW */}
      {view === "table" && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Class</th>
                <th>School</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pagedStudents.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.class}</td>
                  <td>{s.schoolName}</td>

                  <td>
                    <span
                      className={`inline-flex w-10/12 text-center mx-auto justify-center items-center gap-1.5 text-xs font-medium text-white border px-2.5 py-1 rounded-full
                      ${
                        s.assessmentStatus === "Not Sent"
                          ? "bg-gray-400"
                          : s.assessmentStatus === "Not Started"
                          ? "bg-yellow-500"
                          : s.assessmentStatus === "In Progress"
                          ? "bg-blue-500"
                          : s.assessmentStatus === "Completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {s.assessmentStatus}
                    </span>
                  </td>

                  <td>
                    {!s.assessmentToken ? (
                      <button
                        onClick={() => handleSendAssessment(s._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-white border px-2.5 py-1 rounded-full bg-blue-600 w-10/12 text-center mx-auto justify-center"
                      >
                        Send
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 inline-flex items-center gap-1.5 text-xs font-medium text-white border px-2.5 py-1 rounded-full bg-blue-600 w-10/12 text-center mx-auto justify-center"
                      >
                        Sent
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
  <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
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

      {/* 🔥 CARD VIEW (MOBILE FRIENDLY) */}
{view === "card" && (
  <>
    {/* CARD GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {pagedStudents.map((s) => (
        <div
          key={s._id}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-800 truncate">
              {s.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{s.email}</p>
          </div>

          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p><span className="font-medium">Phone:</span> {s.phone}</p>
            <p><span className="font-medium">Class:</span> {s.class}</p>
            <p className="truncate">
              <span className="font-medium">School:</span> {s.schoolName}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap
                ${
                  s.assessmentStatus === "Not Sent"
                    ? "bg-gray-200 text-gray-700"
                    : s.assessmentStatus === "Not Started"
                    ? "bg-yellow-100 text-yellow-700"
                    : s.assessmentStatus === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : s.assessmentStatus === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {s.assessmentStatus}
            </span>

            {!s.assessmentToken ? (
              <button
                onClick={() => handleSendAssessment(s._id)}
                className="bg-[#3E5B3F] text-[#E6DEB5] px-4 py-1.5 rounded-lg"
              >
                Send
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-600 px-4 py-1.5 rounded-lg"
              >
                Sent
              </button>
            )}
          </div>
        </div>
      ))}

      {filteredStudents.length === 0 && (
        <p className="text-gray-500 text-center col-span-full">
          No students found
        </p>
      )}
    </div>

    {/* ✅ PAGINATION (PUT HERE ONLY) */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border rounded-lg">
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
  </>
)}

      {/* 🔥 MODAL (UNCHANGED LOGIC) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[90%] md:w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              Create Student
            </h2>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2" required />
              <input name="email" placeholder="Email" value={studentData.email} onChange={handleChange} className="w-full border p-2" required />
              <input name="phone" placeholder="Phone" value={studentData.phone} onChange={handleChange} className="w-full border p-2" required />

              <select name="class" onChange={handleChange} className="w-full border p-2">
                <option value="10th">10th</option>
                <option value="12th">12th</option>
              </select>

              <input name="schoolName" placeholder="School Name" onChange={handleChange} className="w-full border p-2" required />

              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 px-4 py-2 rounded">
                  Cancel
                </button>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}