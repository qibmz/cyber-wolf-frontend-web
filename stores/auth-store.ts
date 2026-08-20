"use client"

import { create } from "zustand"

import type { User } from "@/api/endpoints"

interface AuthStore {
  /** 当前登录用户（仅内存维护，不持久化） */
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
