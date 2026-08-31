import { ArrowUpRight } from "lucide-react";

export default function ScoreCard({
  title,
  value,
  color,
  icon,
  subtitle = "Live AI Analysis",
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${color} p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
    >
      {/* Decorative Background Circle */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />

      {/* Icon */}
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
          {icon}
        </div>

        <ArrowUpRight className="text-white/70" size={24} />
      </div>

      {/* Value */}
      <h2 className="mt-8 text-4xl font-bold">{value}</h2>

      {/* Title */}
      <p className="mt-2 text-lg font-semibold">{title}</p>

      {/* Subtitle */}
      <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
        <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
        {subtitle}
      </div>
    </div>
  );
}