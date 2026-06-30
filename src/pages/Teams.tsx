import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import TeamCard from '../components/tournament/TeamCard';
import { useTournamentStore } from '../store/tournamentStore';
import type { Team } from '../types';

export default function Teams() {
  const { teams, players, isAdmin, updateTeam } = useTournamentStore();
  const [search, setSearch] = useState('');
  const [game, setGame] = useState<'all' | 'carrom' | 'sequence'>('all');
  const [selected, setSelected] = useState<Team | null>(null);
  const [editName, setEditName] = useState('');
  const [editLogo, setEditLogo] = useState('');
  const [editColor, setEditColor] = useState('');

  const filtered = teams.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesGame = game === 'all' || t.game === game;
    return matchesSearch && matchesGame;
  });

  const getTeamPlayers = (teamId: string) => players.filter((p) => p.teamId === teamId);

  const openTeam = (t: Team) => {
    setSelected(t);
    setEditName(t.name);
    setEditLogo(t.logo);
    setEditColor(t.color);
  };

  const handleSave = () => {
    if (!selected) return;
    updateTeam(selected.id, { name: editName, logo: editLogo, color: editColor });
    setSelected(null);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold mb-1">Teams</h1>
        <p className="text-gray-500 text-sm">{teams.length} teams across 2 games</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white text-gray-900"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'carrom', 'sequence'] as const).map((g) => (
            <button key={g} onClick={() => setGame(g)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                game === g
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {g === 'all' ? 'All Games' : g}
            </button>
          ))}
        </div>
      </div>

      {game === 'all' ? (
        <>
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              🎯 Carrom Teams <span className="text-sm text-gray-500 font-normal">({teams.filter(t=>t.game==='carrom').length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.filter(t=>t.game==='carrom').map((t, i) => (
                <TeamCard key={t.id} team={t} players={getTeamPlayers(t.id)} delay={i * 0.04} onClick={() => openTeam(t)} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              🃏 Sequence Teams <span className="text-sm text-gray-500 font-normal">({teams.filter(t=>t.game==='sequence').length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.filter(t=>t.game==='sequence').map((t, i) => (
                <TeamCard key={t.id} team={t} players={getTeamPlayers(t.id)} delay={i * 0.04} onClick={() => openTeam(t)} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t, i) => (
            <TeamCard key={t.id} team={t} players={getTeamPlayers(t.id)} delay={i * 0.04} onClick={() => openTeam(t)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">No teams found</div>
          )}
        </div>
      )}

      {/* Team detail / edit modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {isAdmin ? 'Edit Team' : 'Team Details'}
              </h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-2"
                style={{ background: isAdmin ? editColor : selected.color }}>
                {isAdmin ? editLogo : selected.logo}
              </div>
            </div>

            {isAdmin ? (
              <div className="space-y-3">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Team Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/30" />
                <input value={editLogo} onChange={(e) => setEditLogo(e.target.value)} placeholder="Logo Emoji"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/30" />
                <div className="flex items-center gap-3">
                  <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="w-12 h-12 rounded-xl border-0 cursor-pointer" />
                  <span className="text-sm text-gray-500">Team Color</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">Save</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <h4 className="font-semibold text-lg text-gray-900">{selected.name}</h4>
                <p className="text-xs text-gray-500 capitalize">{selected.game}</p>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="font-bold text-xl text-gray-900">{selected.wins + selected.losses}</div>
                    <div className="text-[10px] text-gray-500">Played</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-green-500">{selected.wins}</div>
                    <div className="text-[10px] text-gray-500">Won</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl text-red-500">{selected.losses}</div>
                    <div className="text-[10px] text-gray-500">Lost</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Players</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {getTeamPlayers(selected.id).map((p) => (
                      <span key={p.id} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-900">{p.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
