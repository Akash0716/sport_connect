import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 lg:px-8 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200">SportConnect</p>
            <p className="text-xs text-slate-400">Find Players. Create Matches. Play Together.</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} SportConnect Capstone Project. Built for College 501 Full-Stack Development.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
