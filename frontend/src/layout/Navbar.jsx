import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  ScanSearch,
  ShieldCheck,
  FileCheck2,
  FileText,
  Bot,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Upload", path: "/upload", icon: Upload },
  { name: "OCR", path: "/ocr", icon: ScanSearch },
  { name: "Validation", path: "/validation", icon: ShieldCheck },
  { name: "Recommendations", path: "/recommendations", icon: FileCheck2 },
  { name: "PDF Review", path: "/review", icon: FileText },
  { name: "AI Assistant", path: "/assistant", icon: Bot },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#003366] text-white shadow-lg sticky top-0 z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* ---------- Logo ---------- */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/bis-logo.png"
            alt="BIS Logo"
            className="w-11 h-11 rounded-full bg-white p-1 object-contain shadow"
          />

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-wide">
              AI Powered BIS Engine
            </h1>

            <p className="text-xs text-blue-200">
              Smart India Hackathon 2026
            </p>
          </div>
        </NavLink>

        {/* ---------- Desktop Navigation ---------- */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm ${
                    isActive
                      ? "bg-white text-[#003366] font-semibold shadow-md"
                      : "hover:bg-[#0B4A8B] hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* ---------- Mobile Menu Button ---------- */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-blue-800 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ---------- Mobile Navigation ---------- */}
      {menuOpen && (
        <div className="lg:hidden bg-[#002B55] border-t border-blue-800 px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-white text-[#003366] font-semibold"
                      : "hover:bg-blue-700 text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}