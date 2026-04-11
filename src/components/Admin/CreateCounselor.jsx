// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import API from "../../utils/api"; // using your axios instance

// export default function CreateCounselor({ modalMode = false, onClose }) {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     organizationName: "",
//     organizationType: "school",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const API_URL =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//     try {
//       const res = await API.post(
//         `${API_URL}/counselor/create`,
//         formData
//       );

//       const data = res.data;

//       console.log(data);

//       if (res.status >= 200 && res.status < 300) {
//         toast.success("Counselor created & email sent!");

//         if (onClose) {
//           onClose();
//         }

//         setTimeout(() => {
//           router.push("/admin/dashboard");
//         }, 1500);
//       } else {
//         toast.error(data.message || "Error creating counselor");
//       }

//     } catch (err) {
//       console.log(err);
//       toast.error(
//         err.response?.data?.message || "Server error"
//       );
//     }

//     setLoading(false);
//   };

//   return (
//     <div className={modalMode ? "" : "min-h-screen bg-gray-100 flex items-center justify-center"}>
//       <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
//         {onClose && (
//           <button
//             type="button"
//             onClick={onClose}
//             className="absolute right-4 top-4 rounded-full bg-[#3E5B3F] px-3 py-2 text-[#E6DEB5] hover:bg-[#2b4b35]"
//           >
//             ✕
//           </button>
//         )}

//         <h2 className="text-2xl font-bold mb-6 text-center text-[#5E0006]">
//           Create Counselor
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             onChange={handleChange}
//             required
//             className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             required
//             className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
//           />

//           <input
//             type="text"
//             name="organizationName"
//             placeholder="Organization Name"
//             onChange={handleChange}
//             required
//             className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
//           />

//           <select
//             name="organizationType"
//             onChange={handleChange}
//             className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E0006]"
//           >
//             <option value="school">School</option>
//             <option value="coaching">Coaching</option>
//             <option value="freelance">Freelance</option>
//           </select>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#5E0006] text-white p-3 rounded-lg hover:bg-[#7a0008] transition"
//           >
//             {loading ? "Creating..." : "Create Counselor"}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import API from "../../utils/api";

export default function CreateCounselor({ modalMode = false, onClose }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationName: "",
    organizationType: "school",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await API.post(`${API_URL}/counselor/create`, formData);
      const data = res.data;

      if (res.status >= 200 && res.status < 300) {
        toast.success("Counselor created & email sent!");
        if (onClose) onClose();
        setTimeout(() => { router.push("/admin/dashboard"); }, 1500);
      } else {
        toast.error(data.message || "Error creating counselor");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }

    setLoading(false);
  };

  const inputClass = "w-full border border-[#d6e4d6] bg-[#f9fbf9] p-3 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3E5B3F] focus:border-transparent transition";

  return (
    <div className={modalMode ? "" : "min-h-screen bg-[#f4f6f4] flex items-center justify-center p-6"} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className={modalMode ? "" : "bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"}>
        {!modalMode && (
          <h2 className="text-xl font-bold mb-6 text-[#3E5B3F]">Create Counselor</h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
            <input type="text" name="name" placeholder="e.g. Priya Sharma" onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
            <input type="email" name="email" placeholder="e.g. priya@school.com" onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Organization Name</label>
            <input type="text" name="organizationName" placeholder="e.g. Sunrise High School" onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Organization Type</label>
            <select name="organizationType" onChange={handleChange} className={inputClass}>
              <option value="school">School</option>
              <option value="coaching">Coaching</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E5B3F] hover:bg-[#2f4a30] text-[#E6DEB5] p-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating…" : "Create Counselor"}
          </button>
        </form>
      </div>
    </div>
  );
}