import React from 'react';
import StarRating from '../common/StarRating';
import { MapPin, Mail, Star, Edit3, PlusCircle } from 'lucide-react';

export const StoreCard = ({ store, onRateClick, isAuthenticated, isNormalUser }) => {
  const hasUserRated = Boolean(store.userRating);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between group hover:border-brand-200 relative overflow-hidden">
      {/* Top accent gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Title and Overall Rating Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {store.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{store.email}</span>
            </div>
          </div>

          {/* Overall rating pill */}
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 font-extrabold text-sm shadow-2xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{store.overallRating !== null ? store.overallRating.toFixed(1) : '—'}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {store.totalRatings === 1
                ? '1 rating'
                : store.totalRatings > 1
                ? `${store.totalRatings} ratings`
                : 'No ratings'}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100 mb-4">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed line-clamp-2">{store.address}</span>
        </div>

        {/* Stars preview */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRating rating={store.overallRating || 0} size="sm" />
            <span className="text-xs font-semibold text-slate-500">
              {store.overallRating ? `${store.overallRating} / 5` : 'Unrated'}
            </span>
          </div>

          {/* User's rating badge if rated */}
          {isAuthenticated && isNormalUser && (
            <div>
              {hasUserRated ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                  <Star className="w-3 h-3 fill-brand-500 text-brand-500" />
                  Your Rating: {store.userRating}★
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Not rated by you</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
        {isAuthenticated && isNormalUser ? (
          <button
            onClick={() => onRateClick(store)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              hasUserRated
                ? 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 hover:shadow'
            }`}
          >
            {hasUserRated ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modify My Rating</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Rate this Store</span>
              </>
            )}
          </button>
        ) : isAuthenticated ? (
          <div className="w-full text-center text-xs text-slate-400 italic py-1.5">
            Store ratings submitted by customers
          </div>
        ) : (
          <button
            onClick={() => onRateClick(store)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 border border-slate-200/80 hover:border-brand-200 transition-all"
          >
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span>Sign in to Rate</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
