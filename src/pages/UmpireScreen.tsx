import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Undo, Save, Trophy, CheckCircle, Minus, Plus, Shield } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';
import { useAutoSave } from '../hooks/useAutoSave';
import toast from 'react-hot-toast';

export default function UmpireScreen() {
  const { id } = useParams<{ id: string }>();
  const { matches, teams, players, isAdmin, updateScore, undoScore, finishMatch } = useTournamentStore();

  const match = matches.find((m) => m.id === id);
  const teamA = match ? teams.find((t) => t.id === match.teamAId) : null;
  const teamB = match ? teams.find((t) => t.id === match.teamBId) : null;

  const [scoreA, setScoreA] = useState(match?.scoreA ?? 0);
  const [scoreB, setScoreB] = useState(match?.scoreB ?? 0);
  const [saved, setSaved] = useState(true);
  const [showFinish, setShowFinish] = useState(false);

  useEffect(() => {
    if (match) { setScoreA(match.scoreA); setScoreB(match.scoreB); }
  }, [match?.id]);

  const doSave = () => {
    if (!match) return;
    updateScore(match.id, scoreA, scoreB);
    setSaved(true);
    toast.success('Score saved!', { duration: 1200 });
  };

  useAutoSave([scoreA, scoreB], doSave, 800);

  useEffect(() => { setSaved(false); }, [scoreA, scoreB]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Umpire access required.</p>
          <Link to="/login" className="text-blue-600 hover:underline text-sm mt-2 block">Login →</Link>
        </div>
      </div>
    );
  }

  if (!match || !teamA || !teamB) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-gray-500">Match not found.</p>
          <Link to="/admin" className="text-blue-600 hover:underline text-sm mt-2 block">← Admin</Link>
        </div>
      </div>
    );
  }

  const handleFinish = (winner: string) => {
    doSave();
    finishMatch(match.id, winner);
    toast.success('Match completed!');
    setShowFinish(false);
  };

  const btnStyle = (color: string) => ({
    background: color,
    borderRadius: '20px',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <div className="text-gray-500 text-xs capitalize">{match.game} · {match.round}</div>
          <div className="text-gray-900 text-sm font-semibold">{match.court}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-red-500 font-bold">LIVE</span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex-1 flex flex-col px-4 py-6 gap-6 max-w-sm mx-auto w-full">
        {/* Team A */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: teamA.color }}>{teamA.logo}</div>
            <div className="text-left">
              <div className="text-gray-900 font-semibold">{teamA.name}</div>
              <div className="text-gray-400 text-xs capitalize">{teamA.game ?? match.game}</div>
            </div>
          </div>
          <motion.div key={scoreA} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            className="text-6xl sm:text-8xl font-display font-black mb-4" style={{ color: teamA.color }}>
            {scoreA}
          </motion.div>
          <div className="flex gap-4 justify-center">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setScoreA(Math.max(0, scoreA - 1))}
              className="w-16 h-16 sm:w-20 sm:h-20"
              style={{ ...btnStyle('#9ca3af') }}>
              <Minus className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setScoreA(scoreA + 1)}
              className="w-16 h-16 sm:w-20 sm:h-20"
              style={{ ...btnStyle(teamA.color) }}>
              <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-300 text-sm font-bold">VS</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Team B */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: teamB.color }}>{teamB.logo}</div>
            <div className="text-left">
              <div className="text-gray-900 font-semibold">{teamB.name}</div>
              <div className="text-gray-400 text-xs capitalize">{teamB.game ?? match.game}</div>
            </div>
          </div>
          <motion.div key={scoreB} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            className="text-6xl sm:text-8xl font-display font-black mb-4" style={{ color: teamB.color }}>
            {scoreB}
          </motion.div>
          <div className="flex gap-4 justify-center">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setScoreB(Math.max(0, scoreB - 1))}
              className="w-16 h-16 sm:w-20 sm:h-20"
              style={{ ...btnStyle('#9ca3af') }}>
              <Minus className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setScoreB(scoreB + 1)}
              className="w-16 h-16 sm:w-20 sm:h-20"
              style={{ ...btnStyle(teamB.color) }}>
              <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { undoScore(match.id); toast('Undone', { icon: '↩' }); }}
              className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
              <Undo className="w-5 h-5" /> Undo
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={doSave}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold ${saved ? 'bg-green-50 text-green-600' : 'bg-blue-600 text-white'}`}>
              {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saved ? 'Saved' : 'Save'}
            </motion.button>
          </div>

          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => setShowFinish(true)}
            className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg bg-yellow-500 text-white hover:bg-yellow-600 shadow-md">
            <Trophy className="w-6 h-6" /> Finish Match & Declare Winner
          </motion.button>
        </div>

        {/* Auto-save indicator */}
        <div className="text-center">
          <span className="text-xs text-gray-400">Auto-saves every change · Umpire Mode</span>
        </div>
      </div>

      {/* Finish Match Modal */}
      {showFinish && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50">
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
            className="w-full max-w-sm rounded-2xl p-6 bg-white border border-gray-200 shadow-xl">
            <h3 className="font-bold text-gray-900 text-xl text-center mb-2">Declare Winner</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Final Score: {scoreA} – {scoreB}</p>
            <div className="flex gap-4">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => handleFinish(teamA.id)}
                className="flex-1 py-5 rounded-2xl flex flex-col items-center gap-2 font-bold text-white"
                style={{ background: teamA.color }}>
                <span className="text-2xl">{teamA.logo}</span>
                <span className="text-sm">{teamA.name}</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => handleFinish(teamB.id)}
                className="flex-1 py-5 rounded-2xl flex flex-col items-center gap-2 font-bold text-white"
                style={{ background: teamB.color }}>
                <span className="text-2xl">{teamB.logo}</span>
                <span className="text-sm">{teamB.name}</span>
              </motion.button>
            </div>
            <button onClick={() => setShowFinish(false)}
              className="w-full mt-4 py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors">
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
