import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  label: string;
  value: string | number;
  gradient?: string;
  delay?: number;
  sub?: string;
}

export default function StatCard({ icon, label, value, gradient, delay = 0, sub }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-default transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          style={{ background: gradient ?? '#2563EB' }}
        >
          {icon}
        </div>
        {sub && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{sub}</span>}
      </div>
      <div className="font-bold text-3xl text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    </motion.div>
  );
}
