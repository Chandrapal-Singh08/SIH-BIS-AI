import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

/* ==========================================
   SIH BIS AI Engine - Main Layout
========================================== */

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ================= Sidebar ================= */}
      <Sidebar />

      {/* ================= Main Section ================= */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 lg:px-8 py-4">

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-sm">

            <div>
              <p className="font-semibold text-green-700">
                🇮🇳 Bureau of Indian Standards
              </p>

              <p className="text-slate-500">
                AI Powered Government Tender Compliance Platform
              </p>
            </div>

            <div className="text-slate-500 text-center md:text-right">
              <p>Smart India Hackathon 2026</p>
              <p>Version 1.0 • BIS AI Recommendation Engine</p>
            </div>

          </div>

        </footer>

      </div>

    </div>
  );
}