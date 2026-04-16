"use client";
import { create } from 'zustand';

export type UserRole = 'employee' | 'head' | 'admin';

interface RoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: 'Сотрудник',
  head: 'Руководитель',
  admin: 'Администратор',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  employee: 'bg-blue-500',
  head: 'bg-amber-500',
  admin: 'bg-red-500',
};

export const useRoleStore = create<RoleState>((set) => ({
  // Default to 'employee' — реальная роль всегда подгружается
  // из profiles после загрузки сессии. Дефолт 'admin' был багом,
  // из-за которого при сломанной сессии показывалась заглушка-админ.
  role: 'employee',
  setRole: (role) => set({ role }),
}));
