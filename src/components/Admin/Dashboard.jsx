"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusCircle, LogOut, User } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) {
      router.push("/admin-login");
    } else {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="w-full h-16 bg-[#5E0006] text-white flex items-center justify-between px-6 shadow-md">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm">
            {admin?.email}
          </span>

          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
            <User size={18} />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* BODY */}
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#5E0006] min-h-[calc(100vh-64px)] p-5">
          <button
            onClick={() => router.push("/admin/createcounselor")}
            className="w-full flex items-center gap-2 justify-center bg-[#9B0F06] p-3 rounded-xl hover:opacity-90 transition text-white font-medium"
          >
            <PlusCircle size={22} />
            Create Counselor
          </button>
        </aside>

        {/* MAIN AREA (EMPTY OR YOU CAN ADD CARDS LATER) */}
        <main className="flex-1 bg-white"></main>

      </div>
    </div>
  );
}