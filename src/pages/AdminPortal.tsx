import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Trophy, Zap, CheckCircle, Play, RotateCcw, Shield, Trash2, Calendar, Edit3, Lock, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useTournamentStore } from '../store/tournamentStore';
import toast from 'react-hot-toast';
import type { GameType } from '../types';

type Modal = 'addTeam' | 'addPlayer' | 'startMatch' | 'updateScore' | 'finishMatch' | 'deletePlayer' | 'deleteTeam' | 'addMatch' | 'editMatch' | 'changePin' | 'deleteCompleted' | null;

export default function AdminPortal() {
  const store = useTournamentStore();
  const { isAdmin, userRole, teams, matches, players, addTeam, addPlayer, addMatch, updateMatch, startMatch, updateScore, finishMatch, deletePlayer, deleteTeam, changePin, deleteCompletedMatches, logout } = store;
  const navigate = useNavigate();
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  if (!isAdmin) {
    return (
      <Layout>
        <div className="text-center py-20">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
          <h2 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>Admin Access Required</h2>
          <Link to="/login" className="btn-primary inline-flex">Login as Admin</Link>
        </div>
      </Layout>
    );
  }

  const isUmpire = userRole === 'umpire';
  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  const allActions = [
    { id: 'addTeam', icon: '🏅', label: 'Add Team', color: '#2563EB', desc: 'Register a new team', adminOnly: true },
    { id: 'addPlayer', icon: '👤', label: 'Add Player', color: '#7C3AED', desc: 'Add player to roster', adminOnly: true },
    { id: 'deletePlayer', icon: '🗑️', label: 'Delete Player', color: '#ef4444', desc: `${players.length} players`, adminOnly: true },
    { id: 'deleteTeam', icon: '❌', label: 'Delete Team', color: '#dc2626', desc: `${teams.length} teams`, adminOnly: true },
    { id: 'addMatch', icon: '📅', label: 'Add Match', color: '#0891b2', desc: 'Schedule a new match', adminOnly: true },
    { id: 'editMatch', icon: '✏️', label: 'Edit Match', color: '#6366f1', desc: 'Update schedule', adminOnly: true },
    { id: 'startMatch', icon: '▶️', label: 'Start Match', color: '#059669', desc: `${upcomingMatches.length} upcoming`, adminOnly: false },
    { id: 'updateScore', icon: '📊', label: 'Update Score', color: '#F97316', desc: `${liveMatches.length} live`, adminOnly: false },
    { id: 'finishMatch', icon: '✅', label: 'Finish Match', color: '#D97706', desc: 'End a live match', adminOnly: false },
    { id: 'deleteCompleted', icon: '🧹', label: 'Delete Completed', color: '#78716c', desc: `${completedMatches.length} completed`, adminOnly: true },
    { id: 'changePin', icon: '🔑', label: 'Change PIN', color: '#0d9488', desc: 'Update access PIN', adminOnly: true },
  ];

  const actions = isUmpire ? allActions.filter(a => !a.adminOnly) : allActions;

  const handleAction = (id: string) => {
    setForm({});
    setModal(id as Modal);
  };

  const closeModal = () => { setModal(null); setForm({}); };

  const modalTitle = (() => {
    if (modal === 'changePin') return 'Change PIN';
    if (modal === 'deleteCompleted') return 'Delete Completed Matches';
    return allActions.find(a => a.id === modal)?.label ?? '';
  })();

  const handleSubmit = () => {
    if (modal === 'addTeam') {
      if (!form.name || !form.game) { toast.error('Fill required fields'); return; }
      addTeam({ name: form.name, logo: form.name.slice(0, 2).toUpperCase(), color: form.color || '#2563EB', playerIds: [], wins: 0, losses: 0, points: 0, status: 'active', game: form.game as GameType });
      toast.success('Team added!');
    } else if (modal === 'addPlayer') {
      if (!form.name || !form.teamId) { toast.error('Fill required fields'); return; }
      const photo = form.photo || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 80)}`;
      addPlayer({ name: form.name, photo, teamId: form.teamId, gamesPlayed: 0, wins: 0, losses: 0 });
      toast.success('Player added!');
    } else if (modal === 'deletePlayer') {
      if (!form.playerId) { toast.error('Select a player'); return; }
      deletePlayer(form.playerId);
      toast.success('Player deleted');
    } else if (modal === 'deleteTeam') {
      if (!form.teamId) { toast.error('Select a team'); return; }
      deleteTeam(form.teamId);
      toast.success('Team deleted (players & matches removed)');
    } else if (modal === 'addMatch') {
      if (!form.teamAId || !form.teamBId || !form.game) { toast.error('Fill required fields'); return; }
      addMatch({
        teamAId: form.teamAId,
        teamBId: form.teamBId,
        scoreA: 0, scoreB: 0,
        status: 'upcoming',
        game: form.game as GameType,
        round: form.round || 'Group Stage',
        court: form.court || 'Court 1',
        scheduledAt: form.scheduledAt || new Date().toISOString(),
        winner: undefined,
      });
      toast.success('Match scheduled!');
    } else if (modal === 'editMatch') {
      if (!form.matchId) { toast.error('Select a match'); return; }
      const updates: Record<string, string> = {};
      if (form.court) updates.court = form.court;
      if (form.round) updates.round = form.round;
      if (form.scheduledAt) updates.scheduledAt = form.scheduledAt;
      updateMatch(form.matchId, updates);
      toast.success('Match updated!');
    } else if (modal === 'startMatch') {
      if (!form.matchId) { toast.error('Select a match'); return; }
      startMatch(form.matchId);
      toast.success('Match started!');
    } else if (modal === 'updateScore') {
      if (!form.matchId) { toast.error('Select a match'); return; }
      updateScore(form.matchId, Number(form.scoreA ?? 0), Number(form.scoreB ?? 0));
      toast.success('Score updated!');
    } else if (modal === 'finishMatch') {
      if (!form.matchId || !form.winner) { toast.error('Select match and winner'); return; }
      finishMatch(form.matchId, form.winner);
      toast.success('Match finished!');
    } else if (modal === 'changePin') {
      if (!form.newPin || form.newPin.length < 4) { toast.error('PIN must be at least 4 digits'); return; }
      if (form.newPin !== form.confirmPin) { toast.error('PINs do not match'); return; }
      changePin(form.newPin);
      toast.success('PIN changed successfully!');
    } else if (modal === 'deleteCompleted') {
      deleteCompletedMatches();
      toast.success(`Deleted ${completedMatches.length} completed matches`);
    }
    closeModal();
  };

  const inputStyle = {
    background: 'var(--color-surface-2)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  };

  const renderModalContent = () => {
    switch (modal) {
      case 'addTeam':
        return <>
          <input placeholder="Team Name *" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          <select value={form.game ?? ''} onChange={e => setForm({ ...form, game: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Game *</option>
            <option value="carrom">Carrom</option>
            <option value="sequence">Sequence</option>
          </select>
          <input type="color" value={form.color ?? '#2563EB'} onChange={e => setForm({ ...form, color: e.target.value })} className="w-12 h-12 rounded-xl border-0 cursor-pointer" />
        </>;
      case 'addPlayer':
        return <>
          <input placeholder="Player Name *" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          <input placeholder="Photo URL (optional)" value={form.photo ?? ''} onChange={e => setForm({ ...form, photo: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          <select value={form.teamId ?? ''} onChange={e => setForm({ ...form, teamId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Team *</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.game})</option>)}
          </select>
        </>;
      case 'deletePlayer':
        return (
          <select value={form.playerId ?? ''} onChange={e => setForm({ ...form, playerId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Player to Delete</option>
            {players.map(p => {
              const team = teams.find(t => t.id === p.teamId);
              return <option key={p.id} value={p.id}>{p.name} ({team?.name})</option>;
            })}
          </select>
        );
      case 'deleteTeam':
        return <>
          <select value={form.teamId ?? ''} onChange={e => setForm({ ...form, teamId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Team to Delete</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.game})</option>)}
          </select>
          {form.teamId && (
            <div className="p-3 rounded-xl text-xs text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>
              ⚠️ This will also delete all players and matches for this team.
            </div>
          )}
        </>;
      case 'addMatch':
        return <>
          <select value={form.game ?? ''} onChange={e => setForm({ ...form, game: e.target.value, teamAId: '', teamBId: '' })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Game *</option>
            <option value="carrom">Carrom</option>
            <option value="sequence">Sequence</option>
          </select>
          {form.game && <>
            <select value={form.teamAId ?? ''} onChange={e => setForm({ ...form, teamAId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
              <option value="">Team A *</option>
              {teams.filter(t => t.game === form.game && t.id !== form.teamBId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={form.teamBId ?? ''} onChange={e => setForm({ ...form, teamBId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
              <option value="">Team B *</option>
              {teams.filter(t => t.game === form.game && t.id !== form.teamAId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </>}
          <input placeholder="Round (e.g. Group Stage)" value={form.round ?? ''} onChange={e => setForm({ ...form, round: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          <input placeholder="Court" value={form.court ?? ''} onChange={e => setForm({ ...form, court: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          <input type="datetime-local" value={form.scheduledAt ?? ''} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
        </>;
      case 'editMatch':
        return <>
          <select value={form.matchId ?? ''} onChange={e => {
            const m = matches.find(x => x.id === e.target.value);
            setForm({ ...form, matchId: e.target.value, court: m?.court ?? '', round: m?.round ?? '', scheduledAt: m?.scheduledAt?.slice(0, 16) ?? '' });
          }} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Match</option>
            {matches.filter(m => m.status !== 'completed').map(m => {
              const tA = teams.find(t => t.id === m.teamAId);
              const tB = teams.find(t => t.id === m.teamBId);
              return <option key={m.id} value={m.id}>{tA?.name} vs {tB?.name} ({m.status})</option>;
            })}
          </select>
          {form.matchId && <>
            <input placeholder="Round" value={form.round ?? ''} onChange={e => setForm({ ...form, round: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
            <input placeholder="Court" value={form.court ?? ''} onChange={e => setForm({ ...form, court: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
            <input type="datetime-local" value={form.scheduledAt ?? ''} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle} />
          </>}
        </>;
      case 'startMatch':
        return (
          <select value={form.matchId ?? ''} onChange={e => setForm({ ...form, matchId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Match</option>
            {upcomingMatches.map(m => {
              const tA = teams.find(t => t.id === m.teamAId);
              const tB = teams.find(t => t.id === m.teamBId);
              return <option key={m.id} value={m.id}>{tA?.name} vs {tB?.name}</option>;
            })}
          </select>
        );
      case 'updateScore':
        return <>
          <select value={form.matchId ?? ''} onChange={e => {
            const m = matches.find(x => x.id === e.target.value);
            setForm({ ...form, matchId: e.target.value, scoreA: String(m?.scoreA ?? 0), scoreB: String(m?.scoreB ?? 0) });
          }} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Live Match</option>
            {liveMatches.map(m => {
              const tA = teams.find(t => t.id === m.teamAId);
              const tB = teams.find(t => t.id === m.teamBId);
              return <option key={m.id} value={m.id}>{tA?.name} vs {tB?.name} ({m.scoreA}-{m.scoreB})</option>;
            })}
          </select>
          {form.matchId && (() => {
            const m = matches.find(x => x.id === form.matchId);
            const tA = teams.find(t => t.id === m?.teamAId);
            const tB = teams.find(t => t.id === m?.teamBId);
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted px-1">
                  <span>{tA?.name}</span>
                  <span>{tB?.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Score A" value={form.scoreA ?? ''} onChange={e => setForm({ ...form, scoreA: e.target.value })} className="px-4 py-3 rounded-xl border text-sm outline-none text-center font-bold text-xl" style={inputStyle} />
                  <input type="number" placeholder="Score B" value={form.scoreB ?? ''} onChange={e => setForm({ ...form, scoreB: e.target.value })} className="px-4 py-3 rounded-xl border text-sm outline-none text-center font-bold text-xl" style={inputStyle} />
                </div>
              </div>
            );
          })()}
        </>;
      case 'finishMatch':
        return <>
          <select value={form.matchId ?? ''} onChange={e => setForm({ ...form, matchId: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
            <option value="">Select Match</option>
            {liveMatches.map(m => {
              const tA = teams.find(t => t.id === m.teamAId);
              const tB = teams.find(t => t.id === m.teamBId);
              return <option key={m.id} value={m.id}>{tA?.name} vs {tB?.name}</option>;
            })}
          </select>
          {form.matchId && (
            <select value={form.winner ?? ''} onChange={e => setForm({ ...form, winner: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={inputStyle}>
              <option value="">Select Winner</option>
              {(() => {
                const m = matches.find(x => x.id === form.matchId);
                if (!m) return null;
                return [
                  <option key={m.teamAId} value={m.teamAId}>{teams.find(t => t.id === m.teamAId)?.name}</option>,
                  <option key={m.teamBId} value={m.teamBId}>{teams.find(t => t.id === m.teamBId)?.name}</option>,
                ];
              })()}
            </select>
          )}
        </>;
      case 'changePin':
        return <>
          <input type="password" placeholder="New PIN (min 4 digits)" value={form.newPin ?? ''} onChange={e => setForm({ ...form, newPin: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none text-center text-xl tracking-[0.3em]" style={inputStyle} maxLength={6} />
          <input type="password" placeholder="Confirm PIN" value={form.confirmPin ?? ''} onChange={e => setForm({ ...form, confirmPin: e.target.value })} className="w-full px-4 py-3 rounded-xl border text-sm outline-none text-center text-xl tracking-[0.3em]" style={inputStyle} maxLength={6} />
        </>;
      case 'deleteCompleted':
        return (
          <div className="space-y-3">
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              ⚠️ This will permanently delete {completedMatches.length} completed match{completedMatches.length !== 1 ? 'es' : ''}.
            </div>
            {completedMatches.slice(0, 5).map(m => {
              const tA = teams.find(t => t.id === m.teamAId);
              const tB = teams.find(t => t.id === m.teamBId);
              return (
                <div key={m.id} className="text-xs px-3 py-2 rounded-lg flex justify-between" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                  <span>{tA?.name} vs {tB?.name}</span>
                  <span>{m.scoreA}-{m.scoreB}</span>
                </div>
              );
            })}
            {completedMatches.length > 5 && (
              <p className="text-xs text-muted text-center">...and {completedMatches.length - 5} more</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text mb-1">
            {isUmpire ? 'Umpire Panel' : 'Admin Portal'}
          </h1>
          <p className="text-muted text-sm">
            {isUmpire ? 'Match control center' : 'Tournament control center'}
          </p>
        </div>
        <button onClick={() => { logout(); navigate('/'); toast.success('Logged out'); }}
          className="text-sm text-red-500 hover:text-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors">
          Logout
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { value: teams.length, label: 'Teams', color: '#2563EB' },
          { value: players.length, label: 'Players', color: '#7C3AED' },
          { value: liveMatches.length, label: 'Live', color: '#ef4444' },
          { value: upcomingMatches.length, label: 'Upcoming', color: '#F97316' },
        ].map((s) => (
          <div key={s.label} className="surface rounded-xl p-4 text-center">
            <div className="font-bold text-2xl font-display" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {actions.map((a, i) => (
          <motion.button key={a.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, boxShadow: `0 16px 40px ${a.color}30` }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleAction(a.id)}
            className="surface rounded-2xl p-5 flex flex-col items-center gap-2 text-center cursor-pointer"
          >
            <div className="text-3xl">{a.icon}</div>
            <div className="font-semibold text-sm" style={{ color: a.color }}>{a.label}</div>
            <div className="text-xs text-muted">{a.desc}</div>
          </motion.button>
        ))}
      </div>

      {/* Umpire links */}
      <h2 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Umpire Screens</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {liveMatches.map((m) => {
          const tA = teams.find(t => t.id === m.teamAId);
          const tB = teams.find(t => t.id === m.teamBId);
          return (
            <Link key={m.id} to={`/umpire/${m.id}`}>
              <motion.div whileHover={{ y: -2 }}
                className="surface rounded-xl px-4 py-3 flex items-center justify-between border-l-4 transition-shadow hover:shadow-lg"
                style={{ borderLeftColor: '#ef4444' }}>
                <div>
                  <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{tA?.name} vs {tB?.name}</div>
                  <div className="text-xs text-muted capitalize">{m.game} · {m.court}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--color-text)' }}>{m.scoreA}–{m.scoreB}</span>
                  <Zap className="w-4 h-4 text-brand-orange" />
                </div>
              </motion.div>
            </Link>
          );
        })}
        {liveMatches.length === 0 && (
          <div className="col-span-2 surface rounded-xl p-6 text-center text-muted text-sm">
            No live matches — start a match to open umpire screen
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={closeModal}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="surface rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>{modalTitle}</h3>
            <div className="space-y-3">
              {renderModalContent()}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border text-sm font-medium transition-colors hover:bg-red-500/10 hover:text-red-500" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: modal === 'deletePlayer' || modal === 'deleteTeam' || modal === 'deleteCompleted' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                {modal === 'deletePlayer' || modal === 'deleteTeam' || modal === 'deleteCompleted' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
