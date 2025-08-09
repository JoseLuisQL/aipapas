import { create } from 'zustand';

type Role = 'farmer' | 'admin';

interface AuthState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'farmer',
  setRole: (role) => set({ role }),
}));

