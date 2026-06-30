import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Medal } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useTournamentStore } from '../store/tournamentStore';
import type { GameType } from '../types';

const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { teams } = useTournamentStore();
  const [game, setGame] = useState<GameType>('carrom');

  const gameTeams = [...teams]
    .filter((t) => t.game === game)
    .sort((a, b) => b.points - a.points || b.wins - a.wins)
    .map((t, i) => ({ ...t, rank: i + 1 }));

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold">Leaderboard</h1>
        </div>
        <p className="text-gray-500 text-sm">Team rankings for Josh 2026</p>
      </div>

      {/* Game tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['carrom', 'sequence'] as const).map((g) => (
          <button key={g} onClick={() => setGame(g)}
            className={`px-6 py-3 rounded-lg text-sm font-semibold capitalize transition-colors ${
              game === g
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {g === 'carrom' ? '🎯 Carrom' : '🃏 Sequence'}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="mb-10">
        <h2 className="font-semibold mb-4 capitalize text-gray-900">{game} Podium</h2>
        <div className="flex items-end justify-center gap-2 sm:gap-4 h-40 sm:h-48">
          {[1, 0, 2].map((idx) => {
            const t = gameTeams[idx];
            if (!t) return null;
            const heights = [32, 40, 24];
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center"
              >
                <div className="text-2xl sm:text-3xl mb-1">{MEDAL_ICONS[idx]}</div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2"
                  style={{ background: t.color }}>
                  {t.logo}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-center max-w-[60px] sm:max-w-[80px] leading-tight text-gray-900">{t.name}</div>
                <div className="text-[9px] sm:text-[10px] text-gray-500">{t.points} pts</div>
                <div className="mt-1 sm:mt-2 rounded-t-xl flex items-end justify-center font-bold text-white text-xs sm:text-sm"
                  style={{ width: 60, height: heights[idx] * 2.2, background: idx===0?'#eab308':idx===1?'#2563EB':'#6b7280' }}>
                  #{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rankings Table */}
      <div>
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
          <Medal className="w-5 h-5 text-yellow-500" /> <span className="capitalize">{game}</span> Team Rankings
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">#</th>
                <th className="text-left px-2 py-3 text-xs font-semibold text-gray-500">Team</th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500">W</th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500">L</th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500">Pts</th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {gameTeams.map((t, i) => (
                <motion.tr key={t.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {i < 3 ? <span className="text-lg">{MEDAL_ICONS[i]}</span> :
                      <span className="text-gray-500 text-sm">{t.rank}</span>}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: t.color }}>{t.logo}</div>
                      <div className="font-medium text-xs text-gray-900">{t.name}</div>
                    </div>
                  </td>
                  <td className="text-center px-2 py-3 font-semibold text-green-500">{t.wins}</td>
                  <td className="text-center px-2 py-3 font-semibold text-red-400">{t.losses}</td>
                  <td className="text-center px-2 py-3">
                    <span className="font-bold text-blue-600">{t.points}</span>
                  </td>
                  <td className="text-center px-2 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      t.status === 'champion' ? 'bg-yellow-100 text-yellow-600' :
                      t.status === 'eliminated' ? 'bg-red-100 text-red-500' :
                      t.status === 'runner-up' ? 'bg-blue-100 text-blue-500' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
