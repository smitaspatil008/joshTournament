import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useTournamentStore } from '../store/tournamentStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'admin' | 'umpire'>('admin');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useTournamentStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(pin, role);
    setLoading(false);
    if (ok) {
      toast.success(`Welcome, ${role === 'admin' ? 'Admin' : 'Umpire'}!`);
      navigate('/admin');
    } else {
      toast.error('Invalid PIN. Try 1234');
      setPin('');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-blue-600 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-blue-600 font-extrabold mb-1">Josh — Carrom & Sequence</h1>
          <p className="text-gray-500 text-sm">Admin & Umpire Login</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {(['admin', 'umpire'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)} type="button"
                className={`flex-1 py-3 rounded-lg font-semibold text-sm capitalize flex items-center justify-center gap-2 transition-all ${
                  role === r
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}>
                {r === 'admin' ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Access PIN</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                <button type="button" onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors">
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 text-center">Demo PIN: 1234</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading || pin.length < 4}
              className="w-full py-3.5 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 shadow-md">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Verifying…
                </div>
              ) : `Login as ${role === 'admin' ? 'Admin' : 'Umpire'}`}
            </motion.button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-5 border-t border-gray-200 text-xs text-gray-500 text-center space-y-1">
            <p><span className="font-semibold">Admin</span> — full tournament control</p>
            <p><span className="font-semibold">Umpire</span> — update scores during matches</p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Public viewers can browse without login. <a href="/" className="text-blue-600 hover:underline">Go to home →</a>
        </p>
      </div>
    </Layout>
  );
}
