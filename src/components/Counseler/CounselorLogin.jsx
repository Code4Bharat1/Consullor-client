"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CounselorLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);



  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/counselor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");

        localStorage.setItem("counselor", JSON.stringify(data.counselor));
        router.push("/counselor/dashboard");

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Server error");
     }

    setLoading(false);
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* 🔥 LOGIN BOX */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5E0006]">
          Counselor Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5E0006]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5E0006]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5E0006] text-white p-3 rounded-lg hover:bg-[#7a0008]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      

    </div>
  );
}