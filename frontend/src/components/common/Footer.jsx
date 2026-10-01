import React from 'react';
import { Star, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-8 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          </div>
          <span className="text-sm font-bold text-slate-800">
            Rate<span className="text-brand-600">Mate</span>
          </span>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Designed with precision & performance
        </p>
      </div>
    </footer>
  );
};

export default Footer;
