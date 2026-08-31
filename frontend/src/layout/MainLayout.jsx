import { Outlet } from "react-router-dom";
import {
  ShieldCheck,
  Bell,
  UserCircle,
} from "lucide-react";

import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#F3F6FA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
          {/* Left */}
          <div>
            <h1 className="text-lg font-bold text-[#003366]">
              AI Powered BIS Tender Compliance Engine
            </h1>

            <p className="text-xs text-gray-500">
              Bureau of Indian Standards • Smart India Hackathon 2026
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {/* Compliance Badge */}
            <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
              <ShieldCheck size={18} className="text-green-600" />

              <span className="text-sm font-medium text-green-700">
                BIS Compliance Portal
              </span>
            </div>

            {/* Notification */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />

              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2">
              <UserCircle size={34} className="text-[#003366]" />

              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-700">
                  Government Officer
                </p>

                <p className="text-xs text-gray-500">
                  Tender Evaluation Portal
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}