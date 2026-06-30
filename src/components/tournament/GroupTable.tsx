import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { Group, GroupStanding, Team } from '../../types';

interface Props {
  group: Group;
  standings: GroupStanding[];
  teams: Team[];
}

export default function GroupTable({ group, standings, teams }: Props) {
  const getTeam = (id: string) => teams.find((t) => t.id === id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
        <h3 className="font-display font-extrabold text-lg text-blue-600">{group.name}</h3>
        <span className="text-xs text-gray-500 capitalize px-2 py-1 rounded-lg bg-gray-100">{group.game}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">#</th>
              <th className="text-left px-2 py-3 text-xs font-semibold text-gray-500">Team</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">P</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">W</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">L</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">Pts</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, idx) => {
              const team = getTeam(s.teamId);
              if (!team) return null;
              return (
                <motion.tr
                  key={s.teamId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-t border-gray-200 transition-colors hover:bg-gray-50"
                  style={{
                    background: s.qualified ? 'rgba(37,99,235,0.04)' : 'transparent',
                  }}
                >
                  <td className="px-5 py-3.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${idx < 2 ? 'text-white bg-blue-600' : 'text-gray-500'}`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: team.color }}>
                        {team.logo}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{team.name}</div>
                        <div className="text-[10px] text-gray-500 capitalize">{team.game}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center px-3 py-3.5 text-gray-500">{s.played}</td>
                  <td className="text-center px-3 py-3.5 font-semibold text-green-500">{s.won}</td>
                  <td className="text-center px-3 py-3.5 font-semibold text-red-400">{s.lost}</td>
                  <td className="text-center px-3 py-3.5">
                    <span className="font-bold text-blue-600">{s.points}</span>
                  </td>
                  <td className="text-center px-3 py-3.5">
                    {s.qualified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Qualified
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
        <span className="inline-block w-3 h-3 rounded mr-1 bg-blue-100" style={{ verticalAlign: 'middle' }} />
        Top 2 teams qualify for playoffs
      </div>
    </div>
  );
}
