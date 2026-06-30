import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import type { Match, Team } from '../../types';
import LiveBadge from '../ui/LiveBadge';

interface Props {
  matches: Match[];
  teams: Team[];
}

interface BracketMatchProps {
  match: Match;
  teamA?: Team;
  teamB?: Team;
  isChampion?: boolean;
}

function BracketMatchCard({ match, teamA, teamB, isChampion }: BracketMatchProps) {
  const isLive = match.status === 'live';
  const isDone = match.status === 'completed';

  return (
    <Link to={`/match/${match.id}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`rounded-xl overflow-hidden text-xs min-w-[160px] cursor-pointer transition-all bg-white border border-gray-200 ${
          isLive ? 'ring-2 ring-red-500' : isDone ? 'ring-1 ring-blue-200' : ''
        } ${isChampion ? 'ring-2 ring-yellow-500' : ''}`}
      >
        {isLive && (
          <div className="px-2 py-1 flex justify-center bg-red-50">
            <LiveBadge size="sm" />
          </div>
        )}
        {isChampion && (
          <div className="px-2 py-1 text-center text-[10px] font-bold text-yellow-600 bg-yellow-50">
            🏆 CHAMPION
          </div>
        )}

        {/* Team A */}
        <div className={`flex items-center justify-between px-3 py-2 border-b border-gray-200 ${match.winner === teamA?.id ? 'font-bold' : ''}`}
          style={{ background: match.winner === teamA?.id ? `${teamA?.color}12` : 'transparent' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: teamA?.color ?? '#64748b' }}>
              {teamA?.logo ?? '?'}
            </span>
            <span className="truncate max-w-[90px]" style={{ color: match.winner === teamA?.id ? teamA?.color : '#111827' }}>
              {teamA?.name ?? 'TBD'}
            </span>
          </div>
          <span className="font-bold tabular-nums ml-2" style={{ color: match.winner === teamA?.id ? teamA?.color : '#111827' }}>
            {isDone || isLive ? match.scoreA : '-'}
          </span>
        </div>

        {/* Team B */}
        <div className={`flex items-center justify-between px-3 py-2 ${match.winner === teamB?.id ? 'font-bold' : ''}`}
          style={{ background: match.winner === teamB?.id ? `${teamB?.color}12` : 'transparent' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: teamB?.color ?? '#64748b' }}>
              {teamB?.logo ?? '?'}
            </span>
            <span className="truncate max-w-[90px]" style={{ color: match.winner === teamB?.id ? teamB?.color : '#111827' }}>
              {teamB?.name ?? 'TBD'}
            </span>
          </div>
          <span className="font-bold tabular-nums ml-2" style={{ color: match.winner === teamB?.id ? teamB?.color : '#111827' }}>
            {isDone || isLive ? match.scoreB : '-'}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

function RoundLabel({ label }: { label: string }) {
  return (
    <div className="text-center mb-4">
      <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-blue-600">
        {label}
      </span>
    </div>
  );
}

function ConnectorV({ height }: { height: number }) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <div className="w-px h-full bg-gray-300" />
    </div>
  );
}

export default function KnockoutBracket({ matches, teams }: Props) {
  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getMatch = (id: string) => matches.find((m) => m.id === id);

  const r16 = ['m1','m2','m3','m4','m5','m6','m7','m8'].map(getMatch).filter(Boolean) as Match[];
  const qf  = ['m9','m10','m11','m12'].map(getMatch).filter(Boolean) as Match[];
  const sf  = ['m13','m14'].map(getMatch).filter(Boolean) as Match[];
  const fin = getMatch('m15');

  const champion = fin?.winner ? getTeam(fin.winner) : null;

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[900px]">
        <div className="flex items-start gap-6 justify-start">
          {/* R16 */}
          <div className="flex flex-col gap-2">
            <RoundLabel label="Round of 16" />
            <div className="flex flex-col gap-3">
              {r16.map((m) => (
                <BracketMatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)} teamB={getTeam(m.teamBId)} />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center self-center mt-8">
            <div className="w-8 h-px bg-blue-400" />
            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-400" />
          </div>

          {/* QF */}
          <div className="flex flex-col gap-2">
            <RoundLabel label="Quarter Finals" />
            <div className="flex flex-col gap-16 mt-6">
              {qf.map((m) => (
                <BracketMatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)} teamB={getTeam(m.teamBId)} />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center self-center mt-8">
            <div className="w-8 h-px bg-blue-400" />
            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-400" />
          </div>

          {/* SF */}
          <div className="flex flex-col gap-2">
            <RoundLabel label="Semi Finals" />
            <div className="flex flex-col gap-48 mt-20">
              {sf.map((m) => (
                <BracketMatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)} teamB={getTeam(m.teamBId)} />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center self-center mt-8">
            <div className="w-8 h-px bg-blue-400" />
            <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-400" />
          </div>

          {/* Final */}
          <div className="flex flex-col gap-2">
            <RoundLabel label="Final" />
            <div className="mt-52">
              {fin && (
                <BracketMatchCard
                  match={fin}
                  teamA={getTeam(fin.teamAId)}
                  teamB={getTeam(fin.teamBId)}
                  isChampion={fin.status === 'completed'}
                />
              )}
            </div>
          </div>

          {/* Champion */}
          {champion && (
            <>
              <div className="flex items-center self-center mt-8">
                <div className="w-8 h-px bg-yellow-400" />
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-yellow-400" />
              </div>
              <div className="flex flex-col gap-2">
                <RoundLabel label="Champion" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="mt-52 rounded-2xl p-4 text-center bg-yellow-50 border-2 border-yellow-300"
                >
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-2" style={{ background: champion.color }}>
                    {champion.logo}
                  </div>
                  <div className="font-bold text-sm text-yellow-600">{champion.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{champion.game}</div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
