import { motion } from "framer-motion";

export default function ComplianceGauge({ score = 0 }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90
      ? "#16A34A"
      : score >= 70
      ? "#F59E0B"
      : "#DC2626";

  return (
    <div className="flex justify-center items-center">
      <svg width="220" height="220">
        {/* Background circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="14"
          fill="transparent"
        />

        {/* Progress circle */}
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2 }}
          transform="rotate(-90 110 110)"
        />

        {/* Score */}
        <text
          x="110"
          y="105"
          textAnchor="middle"
          fontSize="30"
          fill={color}
          fontWeight="bold"
        >
          {score}%
        </text>

        <text
          x="110"
          y="130"
          textAnchor="middle"
          fontSize="12"
          fill="#64748B"
        >
          BIS Compliance
        </text>
      </svg>
    </div>
  );
}