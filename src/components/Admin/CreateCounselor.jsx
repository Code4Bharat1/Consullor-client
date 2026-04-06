"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "../../utils/api"; // using your axios instance

export default function CreateCounselor() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationName: "",
    organizationType: "school",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await API.post(
        `${API_URL}/counselor/create`,
        formData
      );

      const data = res.data;

      console.log(data);

      if (res.status >= 200 && res.status < 300) {
        toast.success("Counselor created & email sent!");

        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Error creating counselor");
      }

    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Server error"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-[#5E0006]">
          Create Counselor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
          />

          <input
            type="text"
            name="organizationName"
            placeholder="Organization Name"
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
          />

          <select
            name="organizationType"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
          >
            <option value="school">School</option>
            <option value="coaching">Coaching</option>
            <option value="freelance">Freelance</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5E0006] text-white p-3 rounded-lg hover:bg-[#7a0008] transition"
          >
            {loading ? "Creating..." : "Create Counselor"}
          </button>

        </form>

      </div>
    </div>
  );
}