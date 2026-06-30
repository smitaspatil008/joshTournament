import { motion } from 'framer-motion';
import { Trophy, Users, Target, Flame, Calendar, Medal, TrendingUp, BarChart3 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import LiveBadge from '../components/ui/LiveBadge';
import MatchCard from '../components/tournament/MatchCard';
import { useTournamentStore, useLiveMatches, useUpcomingMatches } from '../store/tournamentStore';
import { TOURNAMENT } from '../data/mockData';

export default function Dashboard() {
  const { teams, players, matches, announcements } = useTournamentStore();
  const liveMatches = useLiveMatches();
  const upcomingMatches = useUpcomingMatches();
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const getTeam = (id: string) => teams.find((t) => t.id === id);

  const totalMatchesExpected = 30;
  const progress = Math.round((completedMatches.length / totalMatchesExpected) * 100);

  const stats = [
    { icon: <Trophy className="w-5 h-5" />, label: 'Total Teams',      value: teams.length,             gradient: '#2563EB', delay: 0,    sub: 'Active' },
    { icon: <Users className="w-5 h-5" />,  label: 'Players',          value: players.length,           gradient: '#2563EB', delay: 0.05 },
    { icon: <Target className="w-5 h-5" />, label: 'Matches Played',   value: completedMatches.length,  gradient: '#059669', delay: 0.1  },
    { icon: <Flame className="w-5 h-5" />,  label: 'Live Now',         value: liveMatches.length,       gradient: '#ef4444', delay: 0.15, sub: liveMatches.length>0?'🔴':'—' },
    { icon: <Calendar className="w-5 h-5" />,label: 'Upcoming',        value: upcomingMatches.length,   gradient: '#2563EB', delay: 0.2  },
    { icon: <Medal className="w-5 h-5" />,  label: 'Champions',        value: teams.filter(t=>t.status==='champion').length, gradient: '#d97706', delay: 0.25 },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-3xl sm:text-4xl text-blue-600 font-extrabold mb-1">Dashboard</motion.h1>
        <p className="text-gray-500 text-sm">{TOURNAMENT.name} · {TOURNAMENT.status === 'live' ? 'Live Now' : TOURNAMENT.status}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Tournament progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Tournament Progress</h2>
        </div>
        <div className="space-y-4">
          <ProgressBar value={progress} label="Overall Completion" />
          <ProgressBar
            value={Math.round((matches.filter(m=>m.game==='carrom'&&m.status==='completed').length / 15) * 100)}
            label="Carrom Bracket"
            color="#2563EB"
          />
          <ProgressBar
            value={Math.round((matches.filter(m=>m.game==='sequence'&&m.status==='completed').length / 15) * 100)}
            label="Sequence Groups"
            color="#2563EB"
          />
        </div>
      </motion.div>

      {/* Live + Upcoming */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Live */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <LiveBadge />
            <h2 className="font-semibold text-gray-900">Live Matches</h2>
          </div>
          {liveMatches.length > 0 ? (
            <div className="space-y-3">
              {liveMatches.map((m) => (
                <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} compact />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">No live matches right now</div>
          )}
        </div>

        {/* Upcoming */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Upcoming Matches</h2>
          </div>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches.slice(0, 4).map((m) => (
                <MatchCard key={m.id} match={m} teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!} compact />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">No upcoming matches</div>
          )}
        </div>
      </div>

      {/* Recent announcements */}
      <div className="mt-8">
        <h2 className="font-semibold mb-4 text-gray-900">Recent Announcements</h2>
        <div className="space-y-2">
          {announcements.slice(0, 3).map((a) => (
            <motion.div key={a.id} whileHover={{ x: 4 }}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
              <span className="text-xl">{a.type==='champion'?'🎉':a.type==='winner'?'🏆':a.type==='match'?'⚡':'📢'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate text-gray-900">{a.title}</div>
                <div className="text-xs text-gray-500 truncate">{a.body}</div>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">{new Date(a.createdAt).toLocaleDateString([],{month:'short',day:'numeric'})}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
