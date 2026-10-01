import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50">
        <span className="text-6xl font-extrabold text-brand-600 block mb-2">404</span>
        <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The page or resource you're searching for doesn't exist or may have been relocated.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Stores</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
