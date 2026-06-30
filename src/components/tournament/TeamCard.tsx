import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp } from 'lucide-react';
import type { Team, Player } from '../../types';

interface Props { team: Team; players?: Player[]; delay?: number; onClick?: () => void; }

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-600',
  eliminated: 'bg-red-50 text-red-500',
  champion: 'bg-yellow-50 text-yellow-600',
  'runner-up': 'bg-blue-50 text-blue-600',
};

export default function TeamCard({ team, players = [], delay = 0, onClick }: Props) {
  const winRate = team.wins + team.losses > 0
    ? Math.round((team.wins / (team.wins + team.losses)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="h-2" style={{ background: team.color }} />
      <div className="p-5">
        {/* Logo + name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl shadow-sm"
              style={{ background: team.color }}
            >
              {team.logo}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{team.name}</h3>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 capitalize ${STATUS_STYLES[team.status]}`}>
                {team.status}
              </span>
            </div>
          </div>
          {team.status === 'champion' && <Trophy className="w-6 h-6 text-yellow-500" />}
        </div>

        {/* Players */}
        {players.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4">
            {players.slice(0, 4).map((p, i) => (
              <div key={p.id} className="w-8 h-8 rounded-full overflow-hidden border-2" style={{ borderColor: team.color, marginLeft: i > 0 ? '-8px' : '0' }}>
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              </div>
            ))}
            <span className="text-xs text-gray-500 ml-1">{players.length} players</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="font-bold text-xl text-green-500">{team.wins}</div>
            <div className="text-[10px] text-gray-500">Wins</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="font-bold text-xl text-red-500">{team.losses}</div>
            <div className="text-[10px] text-gray-500">Losses</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="font-bold text-xl" style={{ color: team.color }}>{team.points}</div>
            <div className="text-[10px] text-gray-500">Points</div>
          </div>
        </div>

        {/* Win rate */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Win rate</span>
            <span className="font-semibold text-gray-900">{winRate}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${winRate}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
              className="h-full rounded-full"
              style={{ background: team.color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
