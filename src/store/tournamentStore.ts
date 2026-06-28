import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Team, Player, Match, GalleryItem, Announcement, HistoryEntry } from '../types';
import {
  ALL_TEAMS, PLAYERS, MATCHES, GALLERY, ANNOUNCEMENTS,
  CARROM_TEAMS, SEQUENCE_TEAMS, HISTORY,
} from '../data/mockData';

interface ScoreHistory { scoreA: number; scoreB: number; }

interface TournamentState {
  teams: Team[];
  players: Player[];
  matches: Match[];
  gallery: GalleryItem[];
  announcements: Announcement[];
  history: HistoryEntry[];
  scoreHistory: Record<string, ScoreHistory[]>;
  isAdmin: boolean;
  adminPin: string;

  login: (pin: string, role: 'admin' | 'umpire') => boolean;
  logout: () => void;
  userRole: 'admin' | 'umpire' | null;

  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  startMatch: (id: string) => void;
  updateScore: (id: string, teamA: number, teamB: number) => void;
  undoScore: (id: string) => void;
  finishMatch: (id: string, winner: string) => void;

  addPhoto: (item: Omit<GalleryItem, 'id'>) => void;
  deletePhoto: (id: string) => void;

  addAnnouncement: (a: Omit<Announcement, 'id'>) => void;

  addHistoryEntry: (entry: HistoryEntry) => void;
  deleteHistoryEntry: (year: number) => void;

  changePin: (newPin: string) => void;
  deleteCompletedMatches: () => void;

  reset: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      teams: ALL_TEAMS,
      players: PLAYERS,
      matches: MATCHES,
      gallery: GALLERY,
      announcements: ANNOUNCEMENTS,
      history: HISTORY,
      scoreHistory: {},
      isAdmin: false,
      adminPin: '1234',
      userRole: null,

      login: (pin, role) => {
        if (pin === get().adminPin) {
          set({ isAdmin: true, userRole: role });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false, userRole: null }),

      addTeam: (team) =>
        set((s) => ({ teams: [...s.teams, { ...team, id: 't_' + uid() }] })),
      updateTeam: (id, updates) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      deleteTeam: (id) =>
        set((s) => ({
          teams: s.teams.filter((t) => t.id !== id),
          players: s.players.filter((p) => p.teamId !== id),
          matches: s.matches.filter((m) => m.teamAId !== id && m.teamBId !== id),
        })),

      addPlayer: (player) =>
        set((s) => {
          const newId = 'p_' + uid();
          return {
            players: [...s.players, { ...player, id: newId }],
            teams: s.teams.map((t) =>
              t.id === player.teamId ? { ...t, playerIds: [...t.playerIds, newId] } : t
            ),
          };
        }),
      updatePlayer: (id, updates) =>
        set((s) => ({ players: s.players.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deletePlayer: (id) =>
        set((s) => ({
          players: s.players.filter((p) => p.id !== id),
          teams: s.teams.map((t) => ({ ...t, playerIds: t.playerIds.filter((pid) => pid !== id) })),
        })),

      addMatch: (match) =>
        set((s) => ({ matches: [...s.matches, { ...match, id: 'm_' + uid() }] })),
      updateMatch: (id, updates) =>
        set((s) => ({ matches: s.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteMatch: (id) =>
        set((s) => ({ matches: s.matches.filter((m) => m.id !== id) })),

      startMatch: (id) =>
        set((s) => ({
          matches: s.matches.map((m) => (m.id === id ? { ...m, status: 'live' } : m)),
        })),

      updateScore: (id, teamA, teamB) =>
        set((s) => {
          const match = s.matches.find((m) => m.id === id);
          if (!match) return {};
          const prev = s.scoreHistory[id] ?? [];
          return {
            matches: s.matches.map((m) =>
              m.id === id ? { ...m, scoreA: teamA, scoreB: teamB } : m
            ),
            scoreHistory: { ...s.scoreHistory, [id]: [...prev, { scoreA: match.scoreA, scoreB: match.scoreB }] },
          };
        }),

      undoScore: (id) =>
        set((s) => {
          const hist = s.scoreHistory[id] ?? [];
          if (!hist.length) return {};
          const last = hist[hist.length - 1];
          return {
            matches: s.matches.map((m) =>
              m.id === id ? { ...m, scoreA: last.scoreA, scoreB: last.scoreB } : m
            ),
            scoreHistory: { ...s.scoreHistory, [id]: hist.slice(0, -1) },
          };
        }),

      finishMatch: (id, winner) =>
        set((s) => ({
          matches: s.matches.map((m) =>
            m.id === id ? { ...m, status: 'completed', winner } : m
          ),
        })),

      addPhoto: (item) =>
        set((s) => ({ gallery: [{ ...item, id: 'gal_' + uid() }, ...s.gallery] })),
      deletePhoto: (id) =>
        set((s) => ({ gallery: s.gallery.filter((g) => g.id !== id) })),

      addAnnouncement: (a) =>
        set((s) => ({ announcements: [{ ...a, id: 'ann_' + uid() }, ...s.announcements] })),

      addHistoryEntry: (entry) =>
        set((s) => ({ history: [entry, ...s.history] })),
      deleteHistoryEntry: (year) =>
        set((s) => ({ history: s.history.filter((h) => h.year !== year) })),

      changePin: (newPin) => set({ adminPin: newPin }),
      deleteCompletedMatches: () =>
        set((s) => ({ matches: s.matches.filter((m) => m.status !== 'completed') })),

      reset: () =>
        set({
          teams: ALL_TEAMS,
          players: PLAYERS,
          matches: MATCHES,
          gallery: GALLERY,
          announcements: ANNOUNCEMENTS,
          history: HISTORY,
          scoreHistory: {},
        }),
    }),
    {
      name: 'josh-tournament-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          persistedState.history = HISTORY;
        }
        return persistedState as TournamentState;
      },
    }
  )
);

// Selectors
export const useCarromTeams = () => useTournamentStore(useShallow((s) => s.teams.filter((t) => t.game === 'carrom')));
export const useSequenceTeams = () => useTournamentStore(useShallow((s) => s.teams.filter((t) => t.game === 'sequence')));
export const useLiveMatches = () => useTournamentStore(useShallow((s) => s.matches.filter((m) => m.status === 'live')));
export const useUpcomingMatches = () => useTournamentStore(useShallow((s) => s.matches.filter((m) => m.status === 'upcoming')));
export const useCompletedMatches = () => useTournamentStore(useShallow((s) => s.matches.filter((m) => m.status === 'completed')));
