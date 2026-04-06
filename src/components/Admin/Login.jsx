
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validateEmail = (email) => {
//     return /\S+@\S+\.\S+/.test(email);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.email || !form.password) {
//       return setError("All fields are required");
//     }

//     if (!validateEmail(form.email)) {
//       return setError("Invalid email format");
//     }

//     setLoading(true);
//     const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//     try {
//       const res = await axios.post(`${API}/admin/login`, form);

//       const data = res.data;

//       localStorage.setItem("admin", JSON.stringify(data.admin));

//       router.push("/admin/dashboard");
//     } catch (err) {
//       if (err.response) {
//         setError(err.response.data.message);
//       } else {
//         setError("Server not responding");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
//         {/* Title */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
//           <p className="text-gray-300 text-sm mt-1">Sign in to continue</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="bg-red-500/10 border border-red-400 text-red-300 text-sm p-2 rounded-lg text-center">
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-300">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-300">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300 shadow-lg hover:shadow-xl"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-gray-400 text-xs">
//           © 2026 Admin Dashboard. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) return setError("All fields are required");
    if (!validateEmail(form.email)) return setError("Invalid email format");

    setLoading(true);
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await axios.post(`${API}/admin/login`, form);
      const data = res.data;
      localStorage.setItem("admin", JSON.stringify(data.admin));
      router.push("/admin/dashboard");
    } catch (err) {
      if (err.response) setError(err.response.data.message);
      else setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Corner Border Animation */}
      <style>{`
        .border-wrapper {
          position: relative;
          border-radius: 30px;
        }

        .line {
          position: absolute;
          background: #E6DEB5;
          z-index: 10;
        }

        /* TOP LEFT LINE */
        .line1 {
          height: 2px;
          width: 0;
          top: 0;
          left: 0;
          animation: moveTop 5s linear infinite;
        }

        .line2 {
          width: 2px;
          height: 0;
          top: 0;
          left: 0;
          animation: moveLeft 5s linear infinite;
          animation-delay: 5s;
        }

        /* BOTTOM RIGHT LINE */
        .line3 {
          height: 2px;
          width: 0;
          bottom: 0;
          right: 0;
          animation: moveBottom 5s linear infinite;
        }

        .line4 {
          width: 2px;
          height: 0;
          bottom: 0;
          right: 0;
          animation: moveRight 5s linear infinite;
          animation-delay: 5s;
        }

        @keyframes moveTop {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes moveLeft {
          0% { height: 0; }
          100% { height: 100%; }
        }

        @keyframes moveBottom {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes moveRight {
          0% { height: 0; }
          100% { height: 100%; }
        }
          @media (max-width: 767px) {
  .border-wrapper {
    display: block; /* keep it visible for layout */
    position: static; /* remove absolute positioning on mobile */
    max-width: none;
    box-shadow: none; /* optionally remove shadow */
  }

  .border-wrapper .line {
    display: none; /* hide the moving lines on mobile */
  }

  /* Hide the LEFT side panel on mobile */
  .border-wrapper > .flex > div:first-child {
    display: none;
  }
}
      `}</style>

      <div className="min-h-screen bg-[#3E5B3F] flex flex-col items-center justify-center px-4">

        {/* MOBILE LOGO */}
        <div className="md:hidden flex justify-center mb-6">
            <img src="/logo.png" className="w-[230px]" />
        </div>

        {/* 🔥 BORDER WRAPPER */}
        <div className="border-wrapper w-full max-w-[1100px] relative">

          {/* animated lines */}
          <div className="line line1"></div>
          <div className="line line2"></div>
          <div className="line line3"></div>
          <div className="line line4"></div>

          {/* CARD */}
          <div className="flex flex-col md:flex-row w-full min-h-[600px] overflow-hidden shadow-2xl">

            {/* LEFT */}
            <div className="hidden md:flex w-1/2 bg-[#3E5B3F] text-[#E6DEB5] flex-col items-center justify-center text-center px-12 py-8">
              <img src="/logo.png" className="w-[400px] mb-8" />

              <h1 className="text-5xl font-bold leading-tight">
                AI Career Consultant
              </h1>

              <p className="text-base mt-6 max-w-[320px] leading-relaxed">
                Smart career guidance powered by AI. Discover the right path based on your skills and future goals.
              </p>
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-14 flex flex-col justify-center relative">

              <div className="absolute inset-0 border-4 border-[#3E5B3F] pointer-events-none"></div>

              <h2 className="text-5xl font-bold text-[#3E5B3F] mb-4 text-center md:text-left">
                Admin Login
              </h2>

              <p className="text-lg text-gray-500 mb-8 text-center md:text-left">
                Access your dashboard
              </p>

              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-14 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-[#3E5B3F]"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full h-14 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-[#3E5B3F]"
                />

                <button
                  className="w-full h-14 rounded-lg bg-[#3E5B3F] text-[#E6DEB5] font-semibold text-lg hover:shadow-lg transition"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}