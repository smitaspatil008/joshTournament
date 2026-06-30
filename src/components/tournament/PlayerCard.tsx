import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Player, Team } from '../../types';

interface Props { player: Player; team?: Team; delay?: number; onClick?: () => void; }

export default function PlayerCard({ player, team, delay = 0, onClick }: Props) {
  const winPct = player.gamesPlayed > 0 ? Math.round((player.wins / player.gamesPlayed) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center text-center cursor-pointer"
    >
      {/* Photo */}
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-[3px]" style={{ borderColor: team?.color ?? '#2563EB' }}>
          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
        </div>
        {team && (
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold border-2 border-white" style={{ background: team.color }}>
            {team.logo}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-sm text-gray-900">{player.name}</h3>
      {team && <p className="text-xs mt-0.5" style={{ color: team.color }}>{team.name}</p>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-gray-200">
        <div>
          <div className="font-bold text-lg text-gray-900">{player.gamesPlayed}</div>
          <div className="text-[10px] text-gray-500">Played</div>
        </div>
        <div>
          <div className="font-bold text-lg text-green-500">{player.wins}</div>
          <div className="text-[10px] text-gray-500">Won</div>
        </div>
        <div>
          <div className="font-bold text-lg text-red-500">{player.losses}</div>
          <div className="text-[10px] text-gray-500">Lost</div>
        </div>
      </div>

      {/* Win % */}
      <div className="w-full mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Win Rate</span>
          <span className="font-semibold text-gray-900">{winPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${winPct}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="h-full rounded-full"
            style={{ background: team?.color ?? '#2563EB' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
