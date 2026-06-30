import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Trophy } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LiveBadge from '../components/ui/LiveBadge';
import AnimatedScore from '../components/ui/AnimatedScore';
import { useTournamentStore } from '../store/tournamentStore';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { matches, teams, players } = useTournamentStore();

  const match = matches.find((m) => m.id === id);
  if (!match) return (
    <Layout>
      <div className="text-center py-20">
        <p className="text-gray-500">Match not found.</p>
        <Link to="/live" className="text-blue-600 hover:underline text-sm mt-2 block">← Back to Matches</Link>
      </div>
    </Layout>
  );

  const teamA = teams.find((t) => t.id === match.teamAId)!;
  const teamB = teams.find((t) => t.id === match.teamBId)!;
  const playersA = teamA?.playerIds.map((pid) => players.find((p) => p.id === pid)).filter(Boolean) ?? [];
  const playersB = teamB?.playerIds.map((pid) => players.find((p) => p.id === pid)).filter(Boolean) ?? [];

  const isLive = match.status === 'live';
  const isDone = match.status === 'completed';
  const winnerTeam = match.winner ? teams.find((t) => t.id === match.winner) : undefined;

  return (
    <Layout>
      {/* Back */}
      <Link to="/live" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </Link>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isLive && <LiveBadge />}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
              isDone ? 'bg-green-100 text-green-600' : isLive ? '' : 'bg-blue-100 text-blue-600'
            }`}>{!isLive && match.status}</span>
          </div>
          <p className="text-gray-500 text-sm capitalize">{match.game} · {match.round}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" />{match.court}</div>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <Clock className="w-3 h-3" />
            {new Date(match.scheduledAt).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
          </div>
        </div>
      </div>

      {/* Main scoreboard */}
      <motion.div
        className="rounded-2xl overflow-hidden mb-8 bg-white border border-gray-200"
      >
        <div className="p-4 sm:p-12">
          <div className="flex items-center justify-between gap-4">
            {/* Team A */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-display font-black text-xl sm:text-4xl mb-2 sm:mb-3"
                style={{ background: teamA?.color }}>
                {teamA?.logo}
              </div>
              <h2 className="font-display font-bold text-sm sm:text-xl text-gray-900">{teamA?.name}</h2>
              <p className="text-gray-500 text-xs capitalize">{teamA?.game}</p>
              {match.winner === teamA?.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="mt-2 text-yellow-500 text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> Winner
                </motion.div>
              )}
            </motion.div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 sm:gap-8">
                <AnimatedScore score={match.scoreA} color={teamA?.color} size="xl" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-300">—</span>
                  {isLive && (
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-red-500 mt-1" />
                  )}
                </div>
                <AnimatedScore score={match.scoreB} color={teamB?.color} size="xl" />
              </div>
              <div className="text-xs text-gray-500 mt-1">{match.game === 'carrom' ? 'Points' : 'Games'}</div>
            </div>

            {/* Team B */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="flex-1 flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-display font-black text-xl sm:text-4xl mb-2 sm:mb-3"
                style={{ background: teamB?.color }}>
                {teamB?.logo}
              </div>
              <h2 className="font-display font-bold text-sm sm:text-xl text-gray-900">{teamB?.name}</h2>
              <p className="text-gray-500 text-xs capitalize">{teamB?.game}</p>
              {match.winner === teamB?.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="mt-2 text-yellow-500 text-sm font-bold flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> Winner
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Players */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {[{ team: teamA, players: playersA }, { team: teamB, players: playersB }].map(({ team, players: ps }) => (
          <div key={team?.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900">
              <span className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: team?.color }}>{team?.logo}</span>
              {team?.name}
            </h3>
            <div className="flex gap-3">
              {ps.map((p) => p && (
                <div key={p.id} className="flex flex-col items-center gap-1">
                  <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: team?.color }} />
                  <span className="text-[10px] text-center text-gray-500 leading-tight">{p.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Score history (if available) */}
      {match.history && match.history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold mb-4 text-gray-900">Score History</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {match.history.map((h, i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="text-xs text-gray-500 mb-1">#{i + 1}</div>
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold text-gray-900">
                  {h.scoreA}–{h.scoreB}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
