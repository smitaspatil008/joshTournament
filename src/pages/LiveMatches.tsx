import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LiveBadge from '../components/ui/LiveBadge';
import MatchCard from '../components/tournament/MatchCard';
import { useTournamentStore, useLiveMatches, useUpcomingMatches } from '../store/tournamentStore';

export default function LiveMatches() {
  const { teams, players } = useTournamentStore();
  const live = useLiveMatches();
  const upcoming = useUpcomingMatches();

  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getPlayers = (teamId: string) => {
    const team = getTeam(teamId);
    return team?.playerIds.map((pid) => players.find((p) => p.id === pid)).filter(Boolean) ?? [];
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LiveBadge />
          <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold">Live Matches</h1>
        </div>
        <p className="text-gray-500 text-sm">{live.length} match{live.length !== 1 ? 'es' : ''} live right now</p>
      </div>

      {/* Live */}
      {live.length > 0 ? (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-lg text-gray-900">Playing Now</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {live.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <MatchCard match={m}
                  teamA={getTeam(m.teamAId)!}
                  teamB={getTeam(m.teamBId)!}
                  playerA={getPlayers(m.teamAId)[0]}
                  playerB={getPlayers(m.teamBId)[0]}
                />
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center mb-12">
          <Flame className="w-12 h-12 mx-auto mb-3 text-gray-500 opacity-40" />
          <h3 className="font-semibold text-lg mb-1 text-gray-900">No Live Matches</h3>
          <p className="text-gray-500 text-sm">Check back soon for the next match</p>
        </div>
      )}

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-lg text-gray-900">Upcoming</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {upcoming.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <MatchCard match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} />
            </motion.div>
          ))}
          {upcoming.length === 0 && (
            <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 text-sm">No upcoming matches scheduled</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
