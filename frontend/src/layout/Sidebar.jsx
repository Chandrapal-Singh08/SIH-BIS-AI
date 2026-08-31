import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  ScanSearch,
  ShieldCheck,
  FileCheck2,
  FileText,
  Bot,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Upload Tender", path: "/upload", icon: Upload },
  { name: "OCR Review", path: "/ocr", icon: ScanSearch },
  { name: "BIS Validation", path: "/validation", icon: ShieldCheck },
  { name: "Recommendations", path: "/recommendations", icon: FileCheck2 },
  { name: "PDF Review", path: "/review", icon: FileText },
  { name: "AI Assistant", path: "/assistant", icon: Bot },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800 flex items-center gap-3">
        <img
          src="/bis-logo.png"
          alt="BIS Logo"
          className="w-11 h-11 rounded-full bg-white p-1"
        />

        <div>
          <h2 className="font-bold text-lg">BIS AI Engine</h2>
          <p className="text-xs text-blue-200">
            SIH 2026
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-[#003366] font-semibold shadow"
                    : "hover:bg-[#0B4A8B] text-blue-100"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800 text-xs text-blue-200">
        <p className="font-semibold">
          Bureau of Indian Standards
        </p>

        <p>AI Tender Compliance Engine</p>

        <p className="mt-2 text-blue-300">
          Version 1.0 • SIH 2026
        </p>
      </div>
    </aside>
  );
}