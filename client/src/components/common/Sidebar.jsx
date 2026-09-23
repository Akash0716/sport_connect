import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  FolderOpen,
  Trophy,
  BarChart3,
  User,
  Shield,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const playerLinks = [
    { to: '/dashboard', label: 'Player Dashboard', icon: LayoutDashboard },
    { to: '/sessions', label: 'Browse Sessions', icon: Calendar },
    { to: '/create-session', label: 'Create Session', icon: PlusCircle },
    { to: '/my-sessions', label: 'My Sessions', icon: FolderOpen },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/admin/sports', label: 'Manage Sports', icon: Trophy },
    { to: '/admin/reports', label: 'Analytics Reports', icon: BarChart3 },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 glass-panel border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Menu Header */}
          <div className="px-2 pt-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Player Portal
            </p>
          </div>

          <nav className="space-y-1.5">
            {playerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.to} to={link.to} onClick={onClose} className={linkClass}>
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Section if Admin */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="px-2 flex items-center justify-between">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Admin Controls
                </p>
              </div>
              <nav className="space-y-1.5">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink key={link.to} to={link.to} onClick={onClose} className={linkClass}>
                      <Icon className="w-5 h-5 shrink-0 text-cyan-400" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar Footer Note */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <p className="text-xs font-bold text-slate-300">SportConnect v1.0</p>
          <p className="text-[10px] text-slate-400 mt-1">Full-Stack Capstone Project</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
