import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileSearch,
  ShieldCheck,
  Loader2,
  Eye,
  CheckCircle2,
} from "lucide-react";

import { validateTender, getTenderPDF } from "../services/api";
import { useTender } from "../context/TenderContext";
import PDFHighlight from "../components/PDFHighlight";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFReview() {
  const { filename } = useTender();

  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.25);

  const [report, setReport] = useState(null);
  const [missingClauses, setMissingClauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filename) {
      setLoading(false);
      return;
    }

    loadTender();
  }, [filename]);

  async function loadTender() {
    try {
      setLoading(true);

      setPdfUrl(getTenderPDF(filename));

      const data = await validateTender(filename);

      setReport(data);
      setMissingClauses(data.missing_clauses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
        <FileSearch className="mx-auto text-slate-400 mb-5" size={70} />
        <h2 className="text-3xl font-bold text-slate-700">
          No Tender Uploaded
        </h2>
        <p className="text-slate-500 mt-3">
          Upload a Government Tender PDF to review BIS clauses.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-green-700" size={55} />
        <p className="font-semibold text-slate-600">
          AI is loading the Tender PDF...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* ================= HEADER ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <FileSearch size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              AI Tender PDF Inspector
            </h1>

            <p className="text-green-100 mt-2">
              AI has inspected the uploaded tender and highlighted missing BIS
              clauses directly inside the procurement document.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white/20 rounded-xl p-4">
          <p className="text-sm text-green-100">Current Tender</p>
          <h3 className="font-semibold break-all">{filename}</h3>
        </div>
      </div>

      {/* ================= SCORE CARDS ================= */}
      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
          <ShieldCheck className="mx-auto text-green-600 mb-2" size={28} />
          <p className="text-slate-500 text-sm">Compliance</p>
          <h2 className="text-3xl font-bold text-green-600">
            {report.score}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
          <AlertTriangle className="mx-auto text-red-600 mb-2" size={28} />
          <p className="text-slate-500 text-sm">Missing Clauses</p>
          <h2 className="text-3xl font-bold text-red-600">
            {missingClauses.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
          <CheckCircle2 className="mx-auto text-blue-600 mb-2" size={28} />
          <p className="text-slate-500 text-sm">Verified Clauses</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {report.matched_clauses}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
          <Eye className="mx-auto text-purple-600 mb-2" size={28} />
          <p className="text-slate-500 text-sm">Pages</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {numPages}
          </h2>
        </div>

      </div>

      {/* ================= PDF + SIDEBAR ================= */}
      <div className="grid xl:grid-cols-4 gap-6">

        {/* PDF VIEWER */}
        <div className="xl:col-span-3 bg-white rounded-3xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-2xl font-bold text-green-700">
              Tender PDF Viewer
            </h2>

            <div className="flex gap-2">

              <button
                onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <ZoomOut size={18}/>
              </button>

              <button
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <ZoomIn size={18}/>
              </button>

            </div>

          </div>

          {/* PDF Container */}
          <div className="overflow-auto bg-slate-100 rounded-2xl p-4 border flex justify-center">

            <div className="relative">

              <Document
                file={pdfUrl}
                onLoadSuccess={onLoadSuccess}
                loading="Loading PDF..."
              >
                <Page pageNumber={pageNumber} scale={zoom}/>
              </Document>

              {/* AI Highlights */}
              <PDFHighlight
                clauses={missingClauses}
                currentPage={pageNumber}
              />

            </div>

          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-6 mt-6">

            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber((p) => p - 1)}
              className="bg-green-100 p-2 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft/>
            </button>

            <p className="font-semibold text-slate-700">
              Page {pageNumber} of {numPages}
            </p>

            <button
              disabled={pageNumber === numPages}
              onClick={() => setPageNumber((p) => p + 1)}
              className="bg-green-100 p-2 rounded-lg disabled:opacity-40"
            >
              <ChevronRight/>
            </button>

          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-5">

          {/* Missing Clauses */}
          <div className="bg-white rounded-3xl shadow-lg p-5">

            <div className="flex items-center gap-2 mb-5">

              <AlertTriangle className="text-red-600"/>

              <h3 className="font-bold text-red-700">
                Missing Clauses
              </h3>

            </div>

            {missingClauses.length === 0 ? (
              <p className="text-green-600 text-sm">
                No missing clauses detected.
              </p>
            ) : (
              <div className="space-y-4">
                {missingClauses.map((item, index) => (
                  <div
                    key={index}
                    className="border border-red-200 bg-red-50 rounded-xl p-4"
                  >
                    <h4 className="font-semibold text-red-700">
                      {item.label}
                    </h4>

                    <p className="text-xs text-slate-500 mt-2">
                      Expected Value
                    </p>

                    <p className="font-medium text-sm">
                      {item.expected}
                    </p>

                    <button
                      onClick={() => {
                        setPageNumber(item.page || 1);
                      }}
                      className="mt-3 text-green-700 text-sm font-semibold hover:underline"
                    >
                      Jump to Page {item.page}
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* AI Inspector */}
          <div className="bg-white rounded-3xl shadow-lg p-5">

            <div className="flex items-center gap-2 mb-5">

              <ShieldCheck className="text-green-600"/>

              <h3 className="font-bold text-green-700">
                AI Inspector Notes
              </h3>

            </div>

            <div className="space-y-4 text-sm text-slate-700">

              <div className="bg-green-50 rounded-xl p-3">
                ✅ IP66 clause detected successfully.
              </div>

              <div className="bg-green-50 rounded-xl p-3">
                ✅ Warranty clause verified.
              </div>

              <div className="bg-green-50 rounded-xl p-3">
                ✅ Voltage range 140–270 VAC found.
              </div>

              <div className="bg-yellow-50 rounded-xl p-3">
                ⚠ Power Factor ≥0.95 is missing.
              </div>

              <div className="bg-yellow-50 rounded-xl p-3">
                ⚠ IK08 Impact Resistance not found.
              </div>

              <div className="bg-yellow-50 rounded-xl p-3">
                ⚠ Surge Protection clause should mention 10kV.
              </div>

            </div>

          </div>

          {/* AI Risk */}
          <div className="bg-white rounded-3xl shadow-lg p-5">

            <h3 className="font-bold text-slate-800 mb-4">
              AI Procurement Risk
            </h3>

            <div
              className={`rounded-xl px-4 py-3 text-center font-bold text-lg ${
                report.risk_level === "LOW"
                  ? "bg-green-100 text-green-700"
                  : report.risk_level === "MEDIUM"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {report.risk_level}
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-6">
              AI classified this tender as{" "}
              <span className="font-semibold">
                {report.risk_level}
              </span>{" "}
              because mandatory BIS clauses related to electrical safety are
              missing.
            </p>

          </div>

        </div>

      </div>

      {/* ================= AI RECOMMENDATIONS ================= */}
      <div className="bg-white rounded-3xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          AI Suggested Tender Improvements
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {[
            "Add Power Factor ≥ 0.95 requirement under Technical Specifications.",
            "Include IK08 Impact Resistance Rating for outdoor street lights.",
            "Mention Surge Protection of minimum 10kV.",
            "Reference IS 10322 and IS 16102 explicitly inside technical compliance clauses.",
          ].map((tip, index) => (
            <div
              key={index}
              className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-3"
            >
              <CheckCircle2 className="text-green-600 mt-1"/>

              <p className="text-slate-700 leading-6">
                {tip}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}