import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  FileCheck,
  Activity,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { useTender } from "../context/TenderContext";

export default function Analytics() {
  const { complianceScore, riskLevel, filename } = useTender();

  const score = complianceScore || 71;
  const risk = riskLevel || "MEDIUM";

  // Clause-wise Compliance
  const clauseData = [
    { clause: "IP66", value: 100 },
    { clause: "Warranty", value: 100 },
    { clause: "Lumen", value: 100 },
    { clause: "Voltage", value: 100 },
    { clause: "Power Factor", value: 20 },
    { clause: "IK08", value: 0 },
    { clause: "Surge Protection", value: 80 },
  ];

  // Risk Distribution
  const riskData = [
    { name: "Compliant", value: 5 },
    { name: "Missing Clauses", value: 2 },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  // AI Processing Timeline
  const timeline = [
    { stage: "Upload", value: 10 },
    { stage: "OCR", value: 35 },
    { stage: "Recommendation", value: 60 },
    { stage: "Validation", value: 82 },
    { stage: "Report", value: 100 },
  ];

  const bisCoverage = [
    {
      code: "IS 10322",
      status: "Detected",
      color: "bg-green-100 text-green-700",
    },
    {
      code: "IS 16102",
      status: "Detected",
      color: "bg-green-100 text-green-700",
    },
    {
      code: "IS 16107",
      status: "Detected",
      color: "bg-green-100 text-green-700",
    },
    {
      code: "Power Factor ≥0.95",
      status: "Missing",
      color: "bg-red-100 text-red-700",
    },
    {
      code: "IK08 Impact Rating",
      status: "Missing",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <BarChart3 size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              Procurement Analytics Dashboard
            </h1>

            <p className="mt-2 text-green-100">
              AI-driven analytics for BIS compliance, tender validation,
              procurement risk assessment, and recommendation insights.
            </p>
          </div>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ShieldCheck className="text-green-600 mb-3" size={28} />

          <p className="text-slate-500">Compliance Score</p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {score}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AlertTriangle className="text-orange-500 mb-3" size={28} />

          <p className="text-slate-500">Risk Level</p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {risk}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <FileCheck className="text-blue-600 mb-3" size={28} />

          <p className="text-slate-500">Standards Identified</p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            3
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Activity className="text-red-600 mb-3" size={28} />

          <p className="text-slate-500">Missing Clauses</p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            2
          </h2>
        </div>
      </div>

      {/* COMPLIANCE SCORE + PIE */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Circular Compliance */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-8">
            Overall BIS Compliance Score
          </h2>

          <div className="flex justify-center">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  stroke="#E5E7EB"
                  strokeWidth="14"
                  fill="none"
                />

                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  stroke="#16A34A"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${score * 5.15} 515`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <p className="text-5xl font-bold text-green-600">
                  {score}%
                </p>

                <p className="text-slate-500 mt-2">
                  Procurement Compliance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            Clause Compliance Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                innerRadius={70}
                outerRadius={95}
              >
                {riskData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-8 mt-4 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
              Compliant
            </div>

            <div className="flex items-center gap-2 text-red-700">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              Missing
            </div>
          </div>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-green-600" />

          <h2 className="text-2xl font-bold text-slate-800">
            Clause-wise BIS Compliance
          </h2>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={clauseData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="clause" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#16A34A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TIMELINE AREA CHART */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          AI Processing Workflow Progress
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="stage" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#16A34A"
              fillOpacity={1}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* BIS COVERAGE */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          BIS Standards Coverage
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {bisCoverage.map((item) => (
            <div
              key={item.code}
              className="border rounded-2xl p-5 flex justify-between items-center hover:bg-slate-50 transition"
            >
              <div>
                <h3 className="font-bold text-slate-800">
                  {item.code}
                </h3>
              </div>

              <span
                className={`px-3 py-2 rounded-full text-sm font-semibold ${item.color}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          AI Recommendation Insights
        </h2>

        <div className="space-y-4">
          <div className="border-l-4 border-red-500 bg-red-50 p-5 rounded-xl">
            <h3 className="font-bold text-red-700">
              High Priority Recommendation
            </h3>

            <p className="text-slate-700 mt-2">
              Add a mandatory Power Factor ≥ 0.95 clause to comply with BIS
              lighting procurement guidelines.
            </p>
          </div>

          <div className="border-l-4 border-red-500 bg-red-50 p-5 rounded-xl">
            <h3 className="font-bold text-red-700">
              Structural Compliance Issue
            </h3>

            <p className="text-slate-700 mt-2">
              IK08 Impact Resistance Rating is missing. This is recommended for
              outdoor LED street lighting tenders.
            </p>
          </div>

          <div className="border-l-4 border-green-500 bg-green-50 p-5 rounded-xl">
            <h3 className="font-bold text-green-700">
              Successfully Verified Clauses
            </h3>

            <p className="text-slate-700 mt-2">
              AI verified IP66 Protection, Warranty, Voltage Range, and Lumen
              Efficacy requirements from the uploaded tender.
            </p>
          </div>
        </div>
      </div>

      {/* TENDER SNAPSHOT */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-5">
          Current Tender Snapshot
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <p className="text-green-100 text-sm">
              Tender File
            </p>

            <p className="font-semibold break-all mt-1">
              {filename || "No Tender Uploaded"}
            </p>
          </div>

          <div>
            <p className="text-green-100 text-sm">
              Product Category
            </p>

            <p className="font-semibold mt-1">
              LED Luminaire for Road & Street Lights
            </p>
          </div>

          <div>
            <p className="text-green-100 text-sm">
              AI Validation Result
            </p>

            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 size={18} />

              BIS Validation Completed
            </div>
          </div>

          <div>
            <p className="text-green-100 text-sm">
              Procurement Risk
            </p>

            <p className="font-semibold mt-1">
              Medium Risk — 2 Clauses Missing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}