"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Menu, LayoutDashboard, Users, FileText, BarChart3, Settings } from "lucide-react";
import toast from "react-hot-toast";
import Students from "../Counseler/Students";

export default function CounselorDashboard() {
  const router = useRouter();
  const [counselor, setCounselor] = useState(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
});

 const [active, setActive] = useState("Dashboard");
  const [open, setOpen] = useState(true);

   const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Students", icon: <Users size={20} /> },
    { name: "Assessments", icon: <FileText size={20} /> },
    { name: "Reports", icon: <BarChart3 size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

const handleChangePassword = async () => {
  const counselor = JSON.parse(localStorage.getItem("counselor"));

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ✅ basic validation
  if (!passwordData.currentPassword || !passwordData.newPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (passwordData.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    const res = await fetch(`${API}/counselor/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: counselor._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Password changed successfully");

      // 🔥 update local storage
      counselor.isFirstLogin = false;
      localStorage.setItem("counselor", JSON.stringify(counselor));

      // 🔒 close modal
      setShowChangePassword(false);

      // 🔥 SHOW PROFILE MODAL
  if (!counselor.isProfileComplete) {
    setShowProfileModal(true);
  }

      // reset fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error("Server error");
  }
};

const handleProfileChange = (e) => {
  if (e.target.name === "logo") {
    setProfileData({
      ...profileData,
      logo: e.target.files[0],
    });
  } else {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  }
};

const [showProfileModal, setShowProfileModal] = useState(false);
const [profileData, setProfileData] = useState({
  organizationName: "",
  organizationType: "",
  logo: null,
});

const handleProfileSubmit = async () => {
  const counselor = JSON.parse(localStorage.getItem("counselor"));

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  if (!profileData.organizationName || !profileData.organizationType) {
    toast.error("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("id", counselor._id);
  formData.append("organizationName", profileData.organizationName);
  formData.append("organizationType", profileData.organizationType);

  if (profileData.logo) {
    formData.append("logo", profileData.logo);
  }

  try {
    const res = await fetch(`${API}/counselor/setup-profile`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Profile setup complete");

      counselor.isProfileComplete = true;
      localStorage.setItem("counselor", JSON.stringify(counselor));

      setShowProfileModal(false);

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error("Server error");
  }
};

useEffect(() => {
  const stored = localStorage.getItem("counselor");

  if (!stored) {
    router.push("/counselor/login");
  } else {
    const user = JSON.parse(stored);
    setCounselor(user);

    if (user.isFirstLogin) {
      setShowChangePassword(true);
    } else if (!user.isProfileComplete) {
      setShowProfileModal(true);
    }
  }
}, []);

    const handleLogout = () => {
      localStorage.removeItem("counselor");
      router.push("/counselor/login");
    };

    


return (
  <>
    <div className="min-h-screen flex flex-col">

      {/* 🔥 NAVBAR */}
      <nav className="w-full h-16 bg-[#0000FF] text-white flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            {counselor?.email}
          </span>

          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
            <User size={18} />
          </div>

        </div>
      </nav>

      {/*  BODY */}
      <div className="flex">
  <aside
      className={`${
        open ? "w-64" : "w-16"
      } bg-[#0000FF] h-[calc(100vh-64px)] p-4 transition-all duration-300 flex flex-col`}
    >
      {/* TOGGLE */}
      <button onClick={() => setOpen(!open)} className="mb-6 text-white hover:bg-[#0041C2]  ">
        <Menu />
      </button>

      {/* MENU */}
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.name} className="relative group">
           <button
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center 
              ${open ? "gap-3 px-3 justify-start" : "justify-center"} 
              py-3 rounded-lg transition
              ${
                active === item.name
                  ? "bg-white text-[#0000FF] font-semibold"
                  : "text-white hover:bg-[#0041C2]"
                 }`}
                      >
            {/* ICON */}
            <span className={`${open ? "" : "flex justify-center w-full"}`}>
              {item.icon}
            </span>

            {/* TEXT */}
            {open && <span>{item.name}</span>}
            </button>

              {/*  TOOLTIP (only when closed) */}
              {!open && (
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </li>
        ))}
      </ul>

      {/*  LOGOUT BUTTON */}
      {open && (
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 bg-red-500 px-3 py-2 rounded-lg text-white hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      )}
    </aside>
         <main className="flex-1 bg-gray-100 p-5">
  {active === "Students" && <Students />}
</main>
      </div>
    </div>

    {/*  MODAL INSIDE SAME RETURN */}
    {showChangePassword && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">

          <h3 className="text-xl font-bold mb-4 text-center text-[#5E0006]">
            Change Password
          </h3>

          <p className="text-sm text-gray-500 mb-4 text-center">
            You must change your password before continuing
          </p>

          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg mb-3"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={handleChangePassword}
            className="w-full bg-[#5E0006] text-white p-3 rounded-lg"
          >
            Update Password
          </button>

        </div>
      </div>
    )}

    {showProfileModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[420px] shadow-xl">

      <h3 className="text-xl font-bold mb-4 text-center text-[#5E0006]">
        Setup Profile
      </h3>

      <input
        type="text"
        name="organizationName"
        placeholder="Organization Name"
        onChange={handleProfileChange}
        className="w-full border p-3 rounded-lg mb-3"
      />

      {/* 🔽 DROPDOWN */}
      <select
        name="organizationType"
        onChange={handleProfileChange}
        className="w-full border p-3 rounded-lg mb-3"
      >
        <option value="">Select Organization Type</option>
        <option value="school">School</option>
        <option value="coaching">Coaching Class</option>
        <option value="counseling">Counseling Group</option>
        <option value="freelancer">Freelancer</option>
      </select>

      {/* 📁 FILE INPUT */}
      <input
        type="file"
        name="logo"
        accept="image/*"
        onChange={handleProfileChange}
        className="w-full mb-4"
      />

      <button
        onClick={handleProfileSubmit}
        className="w-full bg-[#5E0006] text-white p-3 rounded-lg"
      >
        Save Profile
      </button>

    </div>
  </div>
    )}

   
  </>
);
}