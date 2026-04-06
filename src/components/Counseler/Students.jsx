"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";

export default function Students() {
  const [showModal, setShowModal] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "10th",
    schoolName: "",
  });

  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
const res = await API.get("/students");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSendAssessment = async (id) => {
    try {
      const res = await API.post(`/students/send/${id}`);
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
      //  FRONTEND VALIDATION (duplicate check)
      const emailExists = students.some(
        (s) => s.email === studentData.email
      );

      const phoneExists = students.some(
        (s) => s.phone === studentData.phone
      );

      if (emailExists) {
        return toast.error("Email already exists");
      }

      if (phoneExists) {
        return toast.error("Phone number already exists");
      }

      await API.post("/students", studentData);

      toast.success("Student Created");

      //  REFRESH DATA WITHOUT PAGE RELOAD
      await fetchStudents();

      //  RESET FORM
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

  return (
    <div>
      {/* BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        + Create Student
      </button>

      {/* TABLE */}
      <div className="mt-6">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
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
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.class}</td>
                <td>{s.schoolName}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm
                      ${
                        s.assessmentStatus === "not_sent"
                          ? "bg-gray-400"
                          : s.assessmentStatus === "pending"
                          ? "bg-yellow-500"
                          : s.assessmentStatus === "started"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                  >
                    {s.assessmentStatus}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="space-x-2">
                  {s.assessmentStatus === "not_sent" && (
                    <button
                      onClick={() => handleSendAssessment(s._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Send
                    </button>
                  )}

                  {s.assessmentStatus !== "not_sent" && (
                    <span className="text-sm text-gray-600">
                      {s.assessmentStatus}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              Create Student
            </h2>

            <form
              onSubmit={handleCreateStudent}
              className="space-y-3"
            >
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <input
                name="email"
                placeholder="Email"
                value={studentData.email}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                value={studentData.phone}
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <select
                name="class"
                onChange={handleChange}
                className="w-full border p-2"
              >
                <option value="10th">10th</option>
                <option value="12th">12th</option>
              </select>

              <input
                name="schoolName"
                placeholder="School Name"
                onChange={handleChange}
                className="w-full border p-2"
                required
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
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