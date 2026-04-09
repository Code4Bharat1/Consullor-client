"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CounselorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/counselor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="w-full min-h-screen flex flex-col md:flex-row">

      {/* LEFT GREEN PANEL */}
      <div className="hidden md:flex relative w-[45%] bg-[#1a6e42] overflow-hidden flex-col justify-between px-12 py-14">

        {/* Curve */}
        <div
          className="absolute bg-white"
          style={{
            // top: "-5%",
            // right: "-520px",
            // width: "700px",
            // height: "120%",
            // borderRadius: "50% 0 0 50%",
            background: "#1a6e42"
          }}
        />

        {/* Logo */}
              <div className="relative z-10 flex justify-center items-start">
          <img src="/logo.png" alt="logo" className="w-[580px] object-contain" />
        </div>

        {/* Text */}
        <div className="relative " style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          <p className="text-[#E6DEB5] text-2xl mt-4 leading-relaxed justify-center">
            Smart career guidance powered by AI. Discover the right path based on your skills and future goals.
          </p>
        </div>

        <div></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
           
        {/* Mobile Top */}
        <div className="md:hidden relative bg-[#1a6e42] w-full pb-20">
          <div
            className="absolute bottom-0 left-0 w-full bg-white"
            style={{ height: "90px", borderRadius: "50% 50% 0 0" }}
          />
          <div className="relative z-10 flex justify-center pt-10">
            <img src="/logo.png" alt="logo" className="w-40" />
          </div>
        </div>

        {/* FORM */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-12 bg-white">
          <div className="w-full max-w-md">

            {/* Heading */}
            <h2
              className="text-[#1a6e42] font-extrabold  text-5xl text-center md:text-left mb-2"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
            >
              Welcome
            </h2>

            <p className="text-gray-400 text-lg text-base text-center md:text-left mb-10"
            style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
              Login in to your account to continue
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6"
            style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>

              {/* Email */}
              <div>
                <label className="text-lg font-semibold text-gray-500 uppercase tracking-wider pl-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  onChange={handleChange}
                  className="w-full px-6 py-3 rounded-full bg-[#d4ede0] text-gray-700 text-sm outline-none focus:bg-[#bfe0ce] transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-lg font-semibold text-gray-500 uppercase tracking-wider pl-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  onChange={handleChange}
                  className="w-full px-6 py-3 rounded-full bg-[#d4ede0] text-gray-700 text-sm outline-none focus:bg-[#bfe0ce] transition"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a6e42] text-white py-3 rounded-full text-sm font-bold tracking-widest hover:bg-[#155934] active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? "Logging in..." : "LOG IN"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}