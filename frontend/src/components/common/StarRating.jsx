import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange = null,
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const currentDisplay = hoverRating || rating || 0;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(maxStars)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= currentDisplay;

          return (
            <button
              key={starNumber}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starNumber)}
              onMouseEnter={() => interactive && setHoverRating(starNumber)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? 'cursor-pointer hover:scale-115 active:scale-95 transition-transform p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded'
                  : 'cursor-default p-0'
              }`}
              aria-label={interactive ? `Rate ${starNumber} of ${maxStars} stars` : undefined}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                    : 'fill-slate-100 text-slate-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-slate-700 ml-1">
          {rating ? Number(rating).toFixed(1) : 'No ratings'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
