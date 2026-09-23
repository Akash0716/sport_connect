import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Trophy, Users, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs mb-6 shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-4 h-4" />
          <span>Full-Stack Sports Session Management Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
          Find Players. Create Matches. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
            Play Together.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          SportConnect connects campus athletes, local clubs, and recreational players. Host sessions, join upcoming matches, and track real-time attendance seamlessly.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-700 transition-all text-center"
          >
            Sign In with Demo
          </Link>
        </div>

        {/* Feature Pill Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 font-bold">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dynamic Sport Catalog</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Administrators create and configure available sports dynamically. Football, Cricket, Basketball, Tennis, Badminton, and more.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Slot Guard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic capacity enforcement, duplicate join protection, and backend double-booking collision guards.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analytics & Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admin statistics with time period range filters, sport popularity breakdown, and database status reports.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Box */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Instant Demo Credentials</h2>
          <p className="text-xs text-slate-400 mb-6">Test the application with pre-configured Player and Admin accounts</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PLAYER DEMO
              </span>
              <p className="text-sm font-bold text-white mt-2">Email: player@sportconnect.com</p>
              <p className="text-xs text-slate-400">Password: Player@123</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                ADMIN DEMO
              </span>
              <p className="text-sm font-bold text-white mt-2">Email: admin@sportconnect.com</p>
              <p className="text-xs text-slate-400">Password: Admin@123</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
