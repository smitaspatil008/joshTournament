import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import Layout from '../components/layout/Layout';
import GroupTable from '../components/tournament/GroupTable';
import MatchCard from '../components/tournament/MatchCard';
import LiveBadge from '../components/ui/LiveBadge';
import { useTournamentStore } from '../store/tournamentStore';
import { GROUPS, GROUP_STANDINGS, SEQUENCE_BRACKET } from '../data/mockData';

function SequencePlayoffBracket({ matches, teams }: { matches: any[]; teams: any[] }) {
  const getMatch = (id: string) => matches.find((m: any) => m.id === id);
  const getTeam = (id: string) => teams.find((t: any) => t.id === id);

  const sf = SEQUENCE_BRACKET.sf.map(s => ({ ...s, match: getMatch(s.matchId) }));
  const fin = getMatch(SEQUENCE_BRACKET.final[0].matchId);
  const champion = fin?.winner ? getTeam(fin.winner) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-display font-bold text-lg text-blue-600 font-extrabold mb-6">Sequence Playoffs</h3>
      <div className="flex flex-col sm:flex-row items-start gap-6 overflow-x-auto">
        {/* Semi Finals */}
        <div className="flex-1 min-w-[200px]">
          <div className="text-center mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-blue-600">
              Semi Finals
            </span>
          </div>
          <div className="space-y-4">
            {sf.map(({ matchId, label, match }) => {
              if (!match) return null;
              const tA = getTeam(match.teamAId);
              const tB = getTeam(match.teamBId);
              const isLive = match.status === 'live';
              const isDone = match.status === 'completed';
              return (
                <Link key={matchId} to={`/match/${matchId}`}>
                  <motion.div whileHover={{ scale: 1.02 }}
                    className={`rounded-xl overflow-hidden text-xs cursor-pointer bg-white border border-gray-200 ${isLive ? 'ring-2 ring-red-500' : ''}`}>
                    {isLive && (
                      <div className="px-2 py-1 flex justify-center bg-red-50">
                        <LiveBadge size="sm" />
                      </div>
                    )}
                    <div className="px-1 py-0.5 text-center text-[9px] text-gray-500 border-b border-gray-200">{label}</div>
                    {[{team: tA, score: match.scoreA, winner: match.winner === tA?.id}, {team: tB, score: match.scoreB, winner: match.winner === tB?.id}].map((row, i) => (
                      <div key={i} className={`flex items-center justify-between px-3 py-2 ${i === 0 ? 'border-b border-gray-200' : ''} ${row.winner ? 'font-bold' : ''}`}
                        style={{ background: row.winner ? `${row.team?.color}15` : 'transparent' }}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded text-white text-[9px] font-bold flex items-center justify-center" style={{ background: row.team?.color ?? '#64748b' }}>{row.team?.logo ?? '?'}</span>
                          <span className="truncate max-w-[90px]" style={{ color: row.winner ? row.team?.color : '#111827' }}>{row.team?.name ?? 'TBD'}</span>
                        </div>
                        <span className="font-bold ml-2 tabular-nums" style={{ color: row.winner ? row.team?.color : '#111827' }}>
                          {isDone || isLive ? row.score : '-'}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center self-center sm:mt-8">
          <div className="w-8 h-px hidden sm:block bg-blue-600" />
          <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 hidden sm:block" style={{ borderLeftColor: '#2563EB' }} />
        </div>

        {/* Final */}
        <div className="flex-1 min-w-[200px]">
          <div className="text-center mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-yellow-500">
              Final
            </span>
          </div>
          {fin && (
            <div className="mt-6">
              <Link to={`/match/${fin.id}`}>
                <motion.div whileHover={{ scale: 1.02 }}
                  className={`rounded-xl overflow-hidden text-xs cursor-pointer bg-white border border-gray-200 ${fin.status === 'completed' ? 'ring-2 ring-yellow-500' : ''}`}>
                  {fin.status === 'completed' && (
                    <div className="px-2 py-1 text-center text-[10px] font-bold text-yellow-600 bg-yellow-50">
                      🏆 CHAMPION
                    </div>
                  )}
                  {[{team: getTeam(fin.teamAId), score: fin.scoreA, winner: fin.winner===fin.teamAId}, {team: getTeam(fin.teamBId), score: fin.scoreB, winner: fin.winner===fin.teamBId}].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 ${i === 0 ? 'border-b border-gray-200' : ''} ${row.winner ? 'font-bold' : ''}`}
                      style={{ background: row.winner ? `${row.team?.color}15` : 'transparent' }}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded text-white text-[9px] font-bold flex items-center justify-center" style={{ background: row.team?.color ?? '#64748b' }}>{row.team?.logo ?? '?'}</span>
                        <span style={{ color: row.winner ? row.team?.color : '#111827' }}>{row.team?.name ?? 'TBD'}</span>
                      </div>
                      <span className="font-bold ml-2 tabular-nums" style={{ color: row.winner ? row.team?.color : '#111827' }}>
                        {fin.status === 'completed' || fin.status === 'live' ? row.score : '-'}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {/* Champion */}
        {champion && (
          <>
            <div className="flex items-center self-center sm:mt-8">
              <div className="w-8 h-px hidden sm:block bg-yellow-500" />
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 hidden sm:block" style={{ borderLeftColor: '#eab308' }} />
            </div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
              className="flex-shrink-0 rounded-2xl p-4 text-center self-center sm:mt-8 bg-yellow-50 border-2 border-yellow-400"
              style={{ minWidth: 120 }}>
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-1" style={{ background: champion.color }}>{champion.logo}</div>
              <div className="font-bold text-xs text-yellow-600">{champion.name}</div>
              <div className="text-[10px] text-gray-500">🏆 Champion</div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SequenceGroups() {
  const { teams, matches } = useTournamentStore();
  const seqTeams = teams.filter((t) => t.game === 'sequence');
  const seqMatches = matches.filter((m) => m.game === 'sequence');
  const liveSeq = seqMatches.filter((m) => m.status === 'live');
  const playoffMatches = seqMatches.filter((m) => ['Semi Finals', 'Final'].includes(m.round));
  const getTeam = (id: string) => teams.find((t) => t.id === id);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-blue-600 text-white">🃏</div>
          <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold">Sequence Groups</h1>
        </div>
        <p className="text-gray-500 text-sm">Group stage · Top 2 from each group advance to playoffs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { value: seqTeams.length, label: 'Teams', color: '#2563EB' },
          { value: liveSeq.length, label: 'Live', color: '#ef4444' },
          { value: seqMatches.filter(m=>m.status==='completed').length, label: 'Completed', color: '#059669' },
          { value: seqMatches.filter(m=>m.status==='upcoming').length, label: 'Upcoming', color: '#2563EB' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="font-bold text-2xl font-display" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live matches */}
      {liveSeq.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
            <LiveBadge size="sm" /> Live Sequence Matches
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {liveSeq.map((m) => (
              <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} />
            ))}
          </div>
        </div>
      )}

      {/* Group tables */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {GROUPS.map((group, i) => (
          <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GroupTable group={group} standings={GROUP_STANDINGS[group.id]} teams={seqTeams} />
          </motion.div>
        ))}
      </div>

      {/* Playoff Bracket */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">🏆 Sequence Playoffs</h2>
        <SequencePlayoffBracket matches={seqMatches} teams={seqTeams} />
      </div>

      {/* Playoff match cards */}
      {playoffMatches.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4 text-gray-900">Playoff Matches</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {playoffMatches.map((m) => (
              <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} />
            ))}
          </div>
        </div>
      )}

      {/* Recent group results */}
      <div>
        <h2 className="font-semibold text-lg mb-4 text-gray-900">Group Stage Results</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {seqMatches.filter(m=>m.status==='completed'&&['Group A','Group B'].includes(m.round)).slice(-6).reverse().map((m) => (
            <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} compact />
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">Upcoming</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {seqMatches.filter(m=>m.status==='upcoming').map((m) => (
            <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} compact />
          ))}
          {seqMatches.filter(m=>m.status==='upcoming').length === 0 && (
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 text-sm">No upcoming sequence matches</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
