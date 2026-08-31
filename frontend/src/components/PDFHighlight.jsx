import { AlertTriangle } from "lucide-react";

export default function PDFHighlight({ clauses, currentPage }) {
  return (
    <>
      {clauses.map((clause, index) => {
        if ((clause.page || 1) !== currentPage) return null;

        return (
          <div
            key={index}
            className="absolute pointer-events-none animate-pulse"
            style={{
              top: `${clause.top}%`,
              left: `${clause.left}%`,
              width: "240px",
              height: "34px",
            }}
          >
            {/* Highlight Box */}
            <div className="w-full h-full bg-yellow-300/60 border-2 border-yellow-500 rounded-md shadow-lg" />

            {/* AI Label */}
            <div className="absolute -top-10 left-0 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap shadow-md">
              <AlertTriangle size={13} />
              Missing BIS Clause
            </div>
          </div>
        );
      })}
    </>
  );
}