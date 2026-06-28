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
      toast.success(`✅ Welcome, ${role === 'admin' ? 'Admin' : 'Umpire'}!`);
      navigate('/admin');
    } else {
      toast.error('❌ Invalid PIN. Try 1234');
      setPin('');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', boxShadow: '0 8px 32px rgba(37,99,235,0.4)' }}>
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl gradient-text mb-1">Josh — Carrom & Sequence</h1>
          <p className="text-muted text-sm">Admin & Umpire Login</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="surface rounded-3xl p-8">

          {/* Role selector */}
          <div className="flex gap-3 mb-6">
            {(['admin', 'umpire'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)} type="button"
                className="flex-1 py-3 rounded-xl font-semibold text-sm capitalize flex items-center justify-center gap-2 transition-all"
                style={{
                  background: role === r ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : 'var(--color-surface-2)',
                  color: role === r ? 'white' : 'var(--color-text-muted)',
                  border: role === r ? 'none' : '1px solid var(--color-border)',
                  boxShadow: role === r ? '0 4px 16px rgba(37,99,235,0.3)' : 'none',
                }}>
                {r === 'admin' ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Access PIN</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all"
                  style={{
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-brand-blue transition-colors">
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted mt-1.5 text-center">Demo PIN: 1234</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading || pin.length < 4}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' }}>
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
          <div className="mt-6 pt-5 border-t text-xs text-muted text-center space-y-1" style={{ borderColor: 'var(--color-border)' }}>
            <p><span className="font-semibold">Admin</span> — full tournament control</p>
            <p><span className="font-semibold">Umpire</span> — update scores during matches</p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted mt-6">
          Public viewers can browse without login. <a href="/" className="text-brand-blue hover:underline">Go to home →</a>
        </p>
      </div>
    </Layout>
  );
}
