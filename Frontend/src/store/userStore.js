import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
      logout: () => {
        set({ userInfo: null });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
