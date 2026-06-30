import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">Josh — Carrom & Sequence</div>
                <div className="text-xs text-gray-500">Play. Compete. Celebrate.</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              The official tournament management platform for JOSH organization. Track live scores, brackets, and leaderboards in real time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home','/'],[' Live Matches','/live'],['Carrom','/carrom'],['Sequence','/sequence'],['Leaderboard','/leaderboard']].map(([l,p]) => (
                <li key={p}><Link to={p} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-gray-400 uppercase tracking-wider mb-3">Tournament</h4>
            <ul className="space-y-2">
              {[['Schedule','/schedule'],['Gallery','/gallery'],['History','/history'],['Teams','/teams'],['Players','/players']].map(([l,p]) => (
                <li key={p}><Link to={p} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} JOSH Organizing Committee. All rights reserved.</p>
          <p className="text-sm text-gray-400">Powered by JOSH Arena</p>
        </div>
      </div>
    </footer>
  );
}
