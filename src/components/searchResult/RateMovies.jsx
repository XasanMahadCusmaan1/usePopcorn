import { useState } from "react";

function RateMovies({ movie, onAddToWatchlist }) {
  const [rating, setRating] = useState(0);

  return (
    <section className="border-t border-border px-1 py-4">
      <div className="rounded-xl border border-border bg-social p-4 shadow-soft sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-bold text-heading">
              Your rating
            </h2>
            <p className="mt-0.5 text-xs text-foreground">
              Choose a score from 1 to 10
            </p>
          </div>
          {rating > 0 && (
            <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-heading">
              {rating}/10
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap items-center gap-0.5"
            role="group"
            aria-label="Rate this movie from 1 to 10 stars"
          >
            {Array.from({ length: 10 }, (_, index) => {
              const value = index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className={`cursor-pointer text-xl leading-none transition-colors ${
                    value <= rating
                      ? "text-accent"
                      : "text-border hover:text-accent"
                  }`}
                >
                  <span aria-hidden="true">★</span>
                </button>
              );
            })}
          </div>

          {rating > 0 && (
            <button
              type="button"
              onClick={() => onAddToWatchlist(movie, rating)}
              className="w-full cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:brightness-95 sm:w-auto"
            >
              Add to watchlist
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default RateMovies;