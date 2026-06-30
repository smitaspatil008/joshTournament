import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import PlayerCard from '../components/tournament/PlayerCard';
import { useTournamentStore } from '../store/tournamentStore';
import type { Player } from '../types';

export default function Players() {
  const { players, teams, isAdmin, updatePlayer } = useTournamentStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  const openPlayer = (p: Player) => {
    setSelected(p);
    setEditName(p.name);
    setEditPhoto(p.photo);
  };

  const handleSave = () => {
    if (!selected) return;
    updatePlayer(selected.id, { name: editName, photo: editPhoto });
    setSelected(null);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-blue-600 font-extrabold mb-1">Players</h1>
        <p className="text-gray-500 text-sm">{players.length} athletes competing in Josh 2026</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white text-gray-900"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">{filtered.length} players</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map((p, i) => (
          <PlayerCard key={p.id} player={p} team={getTeam(p.teamId)} delay={Math.min(i * 0.03, 0.5)} onClick={() => openPlayer(p)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-6 bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">No players found</div>
        )}
      </div>

      {/* Player detail / edit modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">
                {isAdmin ? 'Edit Player' : 'Player Details'}
              </h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              <img src={isAdmin ? editPhoto : selected.photo} alt={selected.name} className="w-20 h-20 rounded-full object-cover border-[3px] mb-3" style={{ borderColor: getTeam(selected.teamId)?.color ?? '#2563EB' }} />
            </div>

            {isAdmin ? (
              <div className="space-y-3">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/30" />
                <input value={editPhoto} onChange={(e) => setEditPhoto(e.target.value)} placeholder="Photo URL"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm outline-none bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/30" />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setSelected(null)} className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">Save</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <h4 className="font-semibold text-lg text-gray-900">{selected.name}</h4>
                {getTeam(selected.teamId) && (
                  <p className="text-sm" style={{ color: getTeam(selected.teamId)!.color }}>{getTeam(selected.teamId)!.name}</p>
                )}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="font-bold text-xl text-gray-900">{selected.gamesPlayed}</div>
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
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}
