import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, User, Shield, PlusCircle } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Sidebar Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Activity className="w-5 h-5" />
          </button>

          <Link to={user ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Sport<span className="text-emerald-400">Connect</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Find Players • Match • Play
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Quick Actions & Profile Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/create-session"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Create Session</span>
              </Link>

              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-100">{user.name}</span>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1 justify-end">
                    {isAdmin && <Shield className="w-3 h-3 text-cyan-400" />}
                    {user.role}
                  </span>
                </div>

                <div className="relative group">
                  <button className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold hover:border-emerald-500 transition-colors">
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                    <div className="px-4 py-2 border-b border-slate-800 md:hidden">
                      <p className="text-xs font-bold text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-emerald-400 uppercase font-bold">{user.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
