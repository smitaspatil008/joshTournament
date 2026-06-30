import { motion } from 'framer-motion';

interface Props { value: number; label?: string; color?: string; }

export default function ProgressBar({ value, label, color = '#2563EB' }: Props) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">{label}</span>
          <span className="font-semibold text-gray-900">{value}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}
