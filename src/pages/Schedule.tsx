import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Plus, Edit3, Trash2, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import LiveBadge from '../components/ui/LiveBadge';
import { useTournamentStore } from '../store/tournamentStore';
import type { GameType } from '../types';
import toast from 'react-hot-toast';

type ModalType = 'addMatch' | 'editMatch' | null;

export default function Schedule() {
  const { matches, teams, isAdmin, addMatch, updateMatch, deleteMatch } = useTournamentStore();
  const [filter, setFilter] = useState<'all' | 'carrom' | 'sequence'>('all');
  const [modal, setModal] = useState<ModalType>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const filtered = filter === 'all' ? matches : matches.filter((m) => m.game === filter);
  const sorted = [...filtered].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const byDate = sorted.reduce<Record<string, typeof sorted>>((acc, m) => {
    const d = new Date(m.scheduledAt).toDateString();
    if (!acc[d]) acc[d] = [];
    acc[d].push(m);
    return acc;
  }, {});

  const getTeam = (id: string) => teams.find((t) => t.id === id);

  const STATUS_COLOR: Record<string, string> = {
    live: '#ef4444',
    completed: '#059669',
    upcoming: '#2563EB',
  };

  const closeModal = () => { setModal(null); setForm({}); };

  const openEdit = (matchId: string) => {
    const m = matches.find((x) => x.id === matchId);
    if (!m) return;
    setForm({
      matchId,
      round: m.round,
      court: m.court,
      scheduledAt: m.scheduledAt.slice(0, 16),
    });
    setModal('editMatch');
  };

  const handleSubmit = () => {
    if (modal === 'addMatch') {
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
      });
      toast.success('Match scheduled!');
    } else if (modal === 'editMatch') {
      if (!form.matchId) { toast.error('Select a match'); return; }
      const updates: Record<string, string> = {};
      if (form.court) updates.court = form.court;
      if (form.round) updates.round = form.round;
      if (form.scheduledAt) updates.scheduledAt = new Date(form.scheduledAt).toISOString();
      updateMatch(form.matchId, updates);
      toast.success('Match updated!');
    }
    closeModal();
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-7 h-7 text-blue-600" />
            <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold">Schedule</h1>
          </div>
          <p className="text-gray-500 text-sm">Full match schedule for Josh Tournament 2026</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setForm({}); setModal('addMatch'); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold">
            <Plus className="w-4 h-4" /> Add Match
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8">
        {(['all', 'carrom', 'sequence'] as const).map((g) => (
          <button key={g} onClick={() => setFilter(g)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === g
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {g === 'all' ? 'All Games' : g}
          </button>
        ))}
      </div>

      {/* Days */}
      <div className="space-y-8">
        {Object.entries(byDate).map(([dateStr, dayMatches], di) => {
          const d = new Date(dateStr);
          const isToday = new Date().toDateString() === dateStr;
          return (
            <div key={dateStr}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-4 py-2 rounded-xl ${isToday ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                  <div className={`font-display font-bold text-sm ${isToday ? 'text-white' : 'text-gray-900'}`}>
                    {d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  {isToday && <div className="text-blue-100 text-xs">Today</div>}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-500">{dayMatches.length} matches</span>
              </div>

              <div className="space-y-2">
                {dayMatches.map((m, i) => {
                  const tA = getTeam(m.teamAId);
                  const tB = getTeam(m.teamBId);
                  const time = new Date(m.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <motion.div key={m.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: di * 0.05 + i * 0.04 }}
                      className="bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-3"
                      style={{ borderLeft: `3px solid ${STATUS_COLOR[m.status]}` }}>
                      <div className="flex items-center gap-2 sm:gap-4">
                        {/* Time */}
                        <div className="flex-shrink-0 text-center w-12 sm:w-14">
                          <div className="text-xs font-semibold" style={{ color: STATUS_COLOR[m.status] }}>{time}</div>
                          <div className="text-[10px] text-gray-500 capitalize">{m.game}</div>
                        </div>

                        {/* Teams */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex-shrink-0 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold" style={{ background: tA?.color ?? '#64748b' }}>{tA?.logo}</div>
                            <span className="text-xs sm:text-sm font-medium truncate text-gray-900">{tA?.name}</span>
                            <span className="text-[10px] sm:text-xs text-gray-500">vs</span>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex-shrink-0 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold" style={{ background: tB?.color ?? '#64748b' }}>{tB?.logo}</div>
                            <span className="text-xs sm:text-sm font-medium truncate text-gray-900">{tB?.name}</span>
                          </div>
                        </div>

                        {/* Score (if played) */}
                        {(m.status === 'live' || m.status === 'completed') && (
                          <div className="font-bold text-xs sm:text-sm flex-shrink-0 text-gray-900">
                            {m.scoreA}–{m.scoreB}
                          </div>
                        )}

                        {/* Status + Admin edit */}
                        <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />{m.court}
                          </div>
                          {m.status === 'live' ? <LiveBadge size="sm" /> :
                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize"
                              style={{ background: `${STATUS_COLOR[m.status]}15`, color: STATUS_COLOR[m.status] }}>
                              {m.status}
                            </span>}
                          {isAdmin && m.status !== 'completed' && (
                            <button onClick={() => openEdit(m.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                              title="Edit schedule">
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                          )}
                          {isAdmin && m.status === 'completed' && (
                            <button onClick={() => { deleteMatch(m.id); toast.success('Match deleted'); }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                              title="Delete match">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">No matches scheduled</div>
      )}

      {/* Add / Edit Match Modal */}
      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeModal}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {modal === 'addMatch' ? 'Add Match' : 'Edit Match'}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {modal === 'addMatch' && <>
                <select value={form.game ?? ''} onChange={e => setForm({ ...form, game: e.target.value, teamAId: '', teamBId: '' })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900">
                  <option value="">Select Game *</option>
                  <option value="carrom">Carrom</option>
                  <option value="sequence">Sequence</option>
                </select>
                {form.game && <>
                  <select value={form.teamAId ?? ''} onChange={e => setForm({ ...form, teamAId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900">
                    <option value="">Team A *</option>
                    {teams.filter(t => t.game === form.game && t.id !== form.teamBId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <select value={form.teamBId ?? ''} onChange={e => setForm({ ...form, teamBId: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900">
                    <option value="">Team B *</option>
                    {teams.filter(t => t.game === form.game && t.id !== form.teamAId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </>}
              </>}

              {modal === 'editMatch' && form.matchId && (() => {
                const m = matches.find(x => x.id === form.matchId);
                const tA = getTeam(m?.teamAId ?? '');
                const tB = getTeam(m?.teamBId ?? '');
                return (
                  <div className="px-4 py-3 rounded-lg text-sm font-medium bg-gray-50 text-gray-900">
                    {tA?.name} vs {tB?.name}
                    <span className="text-xs text-gray-500 ml-2 capitalize">({m?.game})</span>
                  </div>
                );
              })()}

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Round</label>
                <input placeholder="e.g. Group Stage, Quarter Final" value={form.round ?? ''} onChange={e => setForm({ ...form, round: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Court / Venue</label>
                <input placeholder="e.g. Court 1, Main Hall" value={form.court ?? ''} onChange={e => setForm({ ...form, court: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date & Time</label>
                <input type="datetime-local" value={form.scheduledAt ?? ''} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900" />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
                {modal === 'addMatch' ? 'Schedule Match' : 'Update Schedule'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
