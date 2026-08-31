import { motion } from "framer-motion";
import {
  FileCheck2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Bot,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTender } from "../context/TenderContext";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    filename,
    originalFilename,
    complianceScore,
    riskLevel,
    matchedClauses,
    missingClauses,
    recommendations,
    productCategory,
  } = useTender();

  const stats = [
    {
      title: "Compliance Score",
      value: `${complianceScore}%`,
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Matched Clauses",
      value: matchedClauses.length,
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Missing Clauses",
      value: missingClauses.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "AI Recommendations",
      value: recommendations.length,
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const workflow = [
    {
      title: "Upload Tender",
      desc: "Upload Government Tender PDF.",
      icon: UploadCloud,
      path: "/upload",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "OCR Extraction",
      desc: "Extract text from Digital & Scanned PDFs.",
      icon: ScanSearch,
      path: "/ocr",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "BIS Validation",
      desc: "Validate mandatory BIS clauses.",
      icon: ShieldCheck,
      path: "/validation",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "AI Recommendations",
      desc: "RAG engine suggests BIS standards.",
      icon: Sparkles,
      path: "/recommendations",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "PDF Review",
      desc: "Review tender with highlighted clauses.",
      icon: FileText,
      path: "/review",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "AI Assistant",
      desc: "Chat with Gemini Procurement Assistant.",
      icon: Bot,
      path: "/assistant",
      color: "bg-cyan-100 text-cyan-700",
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003366] via-[#004C99] to-[#0066CC] text-white p-10 shadow-xl">
        <p className="uppercase tracking-widest text-blue-200 text-sm mb-2">
          Smart India Hackathon 2026
        </p>

        <h1 className="text-4xl font-bold mb-4">
          AI Powered BIS Tender Compliance Engine 🇮🇳
        </h1>

        <p className="text-blue-100 text-lg max-w-3xl leading-8">
          AI-powered procurement platform that automatically extracts OCR,
          validates BIS clauses, recommends relevant standards using RAG, and
          generates compliance reports for Government tenders.
        </p>

        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-[#003366] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Analyze New Tender
          </button>

          <button
            onClick={() => navigate("/assistant")}
            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-[#003366] transition"
          >
            Open AI Assistant
          </button>
        </div>
      </div>

      {/* Tender Status */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <h2 className="text-2xl font-bold text-[#003366] mb-6">
          Current Tender Status
        </h2>

        {filename ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">Tender File</p>
              <h3 className="font-semibold mt-2 break-all">
                {originalFilename}
              </h3>

              <p className="text-xs text-gray-500 mt-3 break-all">
                Saved as: {filename}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-sm text-gray-500">Detected Product</p>

              <h3 className="font-semibold mt-2">
                {productCategory || "Unknown Product"}
              </h3>

              <p className="mt-3 text-sm text-gray-600">
                Risk Level:
                <span
                  className={`ml-2 font-bold ${
                    riskLevel === "LOW"
                      ? "text-green-600"
                      : riskLevel === "MEDIUM"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {riskLevel}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <UploadCloud size={50} className="mx-auto mb-3 text-gray-400" />
            No tender uploaded yet.
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <Icon size={28} className={item.color} />
              </div>

              <p className="mt-5 text-gray-500 text-sm">{item.title}</p>

              <h2 className={`text-3xl font-bold mt-2 ${item.color}`}>
                {item.value}
              </h2>
            </motion.div>
          );
        })}
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <h2 className="text-2xl font-bold text-[#003366] mb-6">
          AI Compliance Workflow
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(step.path)}
                className="cursor-pointer border rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${step.color}`}
                >
                  <Icon size={26} />
                </div>

                <h3 className="font-bold text-lg mt-5">{step.title}</h3>

                <p className="text-sm text-gray-600 mt-2 leading-6">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <h2 className="text-2xl font-bold text-[#003366] mb-6">
          AI Features Implemented
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            "OCR for Digital + Scanned Government Tender PDFs",
            "BIS Mandatory Clause Validation (IP66, Warranty, Surge Protection, etc.)",
            "RAG-Based BIS Standard Recommendation Engine",
            "PostgreSQL BIS Standards Knowledge Base",
            "Gemini AI Procurement Assistant",
            "Automated BIS Compliance PDF Report Generator",
            "Interactive Tender PDF Review",
            "Compliance Score & Risk Level Detection",
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-slate-50 rounded-xl p-4"
            >
              <CheckCircle2 className="text-green-600 mt-1" size={20} />
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 text-white p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-3">
          Ready for Tender Evaluation?
        </h2>

        <p className="text-green-100 mb-6 max-w-2xl">
          Upload a Government tender PDF and let AI automatically validate BIS
          compliance, recommend standards, generate reports, and answer
          procurement questions.
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
          >
            Upload Tender
          </button>

          <button
            onClick={() => navigate("/report")}
            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-green-700 transition"
          >
            Compliance Report
          </button>
        </div>
      </div>
    </motion.div>
  );
}