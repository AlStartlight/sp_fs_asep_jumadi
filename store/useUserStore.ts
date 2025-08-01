// stores/useUserStore.ts
import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
}));
