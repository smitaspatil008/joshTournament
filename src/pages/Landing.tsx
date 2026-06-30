import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, TrendingUp, Bell, ArrowRight, Play, Target, Brain, Award, Gamepad2, Zap } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LiveBadge from '../components/ui/LiveBadge';
import CountdownTimer from '../components/ui/CountdownTimer';
import MatchCard from '../components/tournament/MatchCard';
import TrophySection from '../components/tournament/TrophySection';
import { useTournamentStore, useLiveMatches, useUpcomingMatches } from '../store/tournamentStore';

const ANNOUNCEMENT_ICONS: Record<string, string> = {
  match: '⚡', winner: '🏆', champion: '🎉', info: '📢',
};

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Landing() {
  const { teams, players, matches, announcements } = useTournamentStore();
  const liveMatches = useLiveMatches();
  const upcoming = useUpcomingMatches();

  const getTeam = (id: string) => teams.find((t) => t.id === id);
  const getPlayer = (id: string) => players.find((p) => p.id === id);

  const nextMatch = upcoming[0];
  const completedCount = matches.filter(m => m.status === 'completed').length;

  return (
    <Layout noPadding fullWidth>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gray-900">
        {/* Abstract geometric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #111827 0%, #1e3a5f 50%, #1e1b4b 100%)' }} />
          {/* Diagonal lines pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
            style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Live pill */}
              {liveMatches.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
                  <LiveBadge size="sm" />
                  <span className="text-white/70 text-sm font-medium">Tournament is LIVE!</span>
                </motion.div>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-4"
              >
                Josh <br />
                <span className="text-blue-400">Carrom & Sequence</span> <br />
                Tournament 2026
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg text-white/50 mb-8 max-w-xl mx-auto lg:mx-0">
                Play Together. Compete Together. Celebrate Together.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link to="/live">
                  <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm">
                    <Play className="w-4 h-4" /> View Live Tournament
                  </button>
                </Link>
                <Link to="/leaderboard">
                  <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors text-sm">
                    <Trophy className="w-4 h-4" /> Leaderboard
                  </button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center lg:justify-start gap-8">
                {[
                  { value: teams.length, label: 'Teams', icon: <Users className="w-4 h-4 text-blue-400" /> },
                  { value: players.length, label: 'Players', icon: <Users className="w-4 h-4 text-blue-400" /> },
                  { value: liveMatches.length, label: 'Live Now', icon: <Zap className="w-4 h-4 text-red-400" /> },
                  { value: completedCount, label: 'Completed', icon: <Trophy className="w-4 h-4 text-green-400" /> },
                ].map((s, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {s.icon}
                      <span className="text-2xl font-bold text-white"><AnimatedCounter target={s.value} /></span>
                    </div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden lg:block flex-shrink-0"
            >
              <div className="grid grid-cols-2 gap-4 w-80 xl:w-96">
                {[
                  { icon: '🎯', title: 'Carrom', sub: `${teams.filter(t => t.game === 'carrom').length} teams`, bg: 'bg-blue-600/20 border-blue-500/30' },
                  { icon: '🃏', title: 'Sequence', sub: `${teams.filter(t => t.game === 'sequence').length} teams`, bg: 'bg-indigo-600/20 border-indigo-500/30' },
                  { icon: '🏆', title: 'Matches', sub: `${matches.length} total`, bg: 'bg-emerald-600/20 border-emerald-500/30' },
                  { icon: '⚡', title: 'Live', sub: `${liveMatches.length} now`, bg: 'bg-red-600/20 border-red-500/30' },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`rounded-2xl border p-6 text-center ${card.bg}`}
                  >
                    <div className="text-4xl mb-3">{card.icon}</div>
                    <div className="text-white font-bold text-sm">{card.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">{card.sub}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <div id="content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LiveBadge />
                <h2 className="font-bold text-2xl text-gray-900">Live Matches</h2>
              </div>
              <Link to="/live" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {liveMatches.map((m) => (
                <MatchCard key={m.id} match={m}
                  teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!}
                  playerA={getPlayer(teams.find(t => t.id === m.teamAId)?.playerIds[0] ?? '')}
                  playerB={getPlayer(teams.find(t => t.id === m.teamBId)?.playerIds[0] ?? '')}
                />
              ))}
            </div>
          </section>
        )}

        {/* Countdown + Upcoming */}
        {nextMatch && (
          <section className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <h2 className="font-bold text-xl text-gray-900 mb-2">Next Match In</h2>
              <p className="text-gray-500 text-sm mb-6">
                {teams.find(t => t.id === nextMatch.teamAId)?.name} vs {teams.find(t => t.id === nextMatch.teamBId)?.name}
              </p>
              <CountdownTimer targetDate={nextMatch.scheduledAt} />
              <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(nextMatch.scheduledAt).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                {' · '}{nextMatch.court}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-900">Upcoming Matches</h2>
                <Link to="/schedule" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Schedule <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcoming.slice(0, 4).map((m) => (
                  <MatchCard key={m.id} match={m}
                    teamA={getTeam(m.teamAId)!} teamB={getTeam(m.teamBId)!}
                    compact
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trophy */}
        <section>
          <TrophySection year={2026} />
        </section>

        {/* Announcements */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-2xl text-gray-900">Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 5).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl flex-shrink-0">{ANNOUNCEMENT_ICONS[a.type]}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">{a.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{a.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                  a.type === 'champion' ? 'bg-yellow-50 text-yellow-600' :
                  a.type === 'winner' ? 'bg-green-50 text-green-600' :
                  a.type === 'match' ? 'bg-red-50 text-red-600' :
                  'bg-blue-50 text-blue-600'
                }`}>{a.type}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick nav */}
        <section>
          <h2 className="font-bold text-2xl text-gray-900 mb-6">Explore Arena</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Carrom', path: '/carrom', icon: '🎯', color: '#2563EB' },
              { label: 'Sequence', path: '/sequence', icon: '🃏', color: '#4f46e5' },
              { label: 'Teams', path: '/teams', icon: '🏅', color: '#059669' },
              { label: 'Players', path: '/players', icon: '👥', color: '#2563EB' },
              { label: 'Gallery', path: '/gallery', icon: '📸', color: '#db2777' },
              { label: 'History', path: '/history', icon: '🏆', color: '#d97706' },
            ].map((n) => (
              <Link key={n.path} to={n.path}>
                <motion.div whileHover={{ y: -3 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 text-center cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{n.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: n.color }}>{n.label}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
