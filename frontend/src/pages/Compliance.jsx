import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";

import {
  validateTender,
  downloadReport,
} from "../services/api";

export default function Compliance() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadCompliance() {
      try {
        const filename = localStorage.getItem("filename");

        if (!filename) {
          alert("Upload a tender first.");
          return;
        }

        const data = await validateTender(filename);
        setReport(data);
      } catch (err) {
        console.error(err);
        alert("Unable to fetch compliance report.");
      } finally {
        setLoading(false);
      }
    }

    loadCompliance();
  }, []);

  const handleDownload = async () => {
    try {
      const filename = localStorage.getItem("filename");

      const pdfBlob = await downloadReport(filename);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "BIS_Compliance_Report.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download report.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-green-700" size={60} />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-xl">

        <p className="uppercase tracking-widest text-green-100 text-sm">
          BIS Compliance Validation
        </p>

        <h1 className="text-5xl font-bold mt-3">
          Tender Compliance Report
        </h1>

        <p className="mt-5 text-lg text-green-50">
          AI validated mandatory BIS specifications, detected missing clauses,
          calculated compliance score, and estimated procurement risk.
        </p>

      </div>

      {/* SCORE + RISK */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Compliance Score */}
        <div className="bg-white rounded-3xl p-8 shadow-md text-center">

          <p className="text-green-700 font-semibold uppercase">
            Overall Compliance Score
          </p>

          <h1 className="text-6xl font-bold text-green-700 mt-5">
            {report.score}%
          </h1>

          <div className="mt-6 w-full bg-slate-200 rounded-full h-5 overflow-hidden">

            <div
              className="bg-green-600 h-5 rounded-full transition-all duration-700"
              style={{ width: `${report.score}%` }}
            />

          </div>

          <p className="mt-5 text-slate-500">
            Based on mandatory BIS specification validation.
          </p>

        </div>

        {/* Risk */}
        <div className="bg-white rounded-3xl p-8 shadow-md">

          <p className="text-orange-600 font-semibold uppercase">
            Procurement Risk Level
          </p>

          <div className="flex items-center gap-4 mt-6">

            <AlertTriangle className="text-orange-500" size={48} />

            <h2 className="text-4xl font-bold text-orange-600">
              {report.risk_level}
            </h2>

          </div>

          <p className="mt-6 text-slate-600 leading-8">
            Missing BIS clauses increase procurement and compliance risk before
            publishing the tender.
          </p>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg">
          <CheckCircle2 size={38} />
          <p className="mt-5 text-green-100">Passed Clauses</p>
          <h2 className="text-4xl font-bold">{report.passed_clauses}</h2>
        </div>

        <div className="bg-red-600 rounded-3xl p-6 text-white shadow-lg">
          <XCircle size={38} />
          <p className="mt-5 text-red-100">Failed Clauses</p>
          <h2 className="text-4xl font-bold">{report.failed_clauses}</h2>
        </div>

        <div className="bg-orange-500 rounded-3xl p-6 text-white shadow-lg">
          <AlertTriangle size={38} />
          <p className="mt-5 text-orange-100">Missing Clauses</p>
          <h2 className="text-4xl font-bold">
            {report.missing_clauses.length}
          </h2>
        </div>

      </div>

      {/* PASS / FAIL TABLE */}
      <div className="bg-white rounded-3xl p-8 shadow-md">

        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Mandatory BIS Specification Validation
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-green-50 text-green-700">
              <th className="p-4 text-left">Specification</th>
              <th className="p-4 text-left">Expected</th>
              <th className="p-4 text-left">Found</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>

            {report.checks.map((check, index) => (
              <tr key={index} className="border-b">

                <td className="p-4 capitalize">
                  {check.field.replaceAll("_", " ")}
                </td>

                <td className="p-4 font-medium">
                  {check.expected}
                </td>

                <td className="p-4">
                  {check.found}
                </td>

                <td className="p-4 text-center">
                  {check.status === "PASS" ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      PASS
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                      FAIL
                    </span>
                  )}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MISSING CLAUSES */}
      <div className="bg-white rounded-3xl p-8 shadow-md">

        <h2 className="text-3xl font-bold text-red-600 mb-8">
          Missing BIS Clauses
        </h2>

        {report.missing_clauses.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">

            <CheckCircle2 className="text-green-600" />

            <p className="text-green-700 font-medium">
              No mandatory BIS clauses are missing.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {report.missing_clauses.map((clause, index) => (
              <div
                key={index}
                className="border-l-4 border-red-500 bg-red-50 rounded-xl p-5"
              >

                <h3 className="font-bold text-red-700 text-lg">
                  {clause.label}
                </h3>

                <p className="mt-2 text-slate-700">
                  Expected Requirement:
                  <span className="font-semibold text-red-700 ml-2">
                    {clause.expected}
                  </span>
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* SUMMARY */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl">

        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="text-green-400" size={30} />

          <h2 className="text-3xl font-bold">
            AI Compliance Summary
          </h2>

        </div>

        <p className="text-slate-300 text-lg leading-8">
          {report.summary}
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">

          <div className="bg-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">
              Recommended Standard
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {report.recommended_standard}
            </h3>
          </div>

          <div className="bg-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm">
              Product Category
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {report.category}
            </h3>
          </div>

        </div>

      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="text-center">

        <button
          onClick={handleDownload}
          className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto shadow-lg transition"
        >

          <Download size={22} />

          Download Audit PDF Report

        </button>

      </div>

    </div>
  );
}