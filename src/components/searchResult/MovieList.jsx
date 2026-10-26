import { useState } from "react";

const genreNames = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Sci-Fi",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};

function MoviePoster({ movie }) {
  const [imageFailed, setImageFailed] = useState(false);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;
  // TV shows use `name`, movies use `title`
  const title = movie.title || movie.name || movie.original_title || movie.original_name || "Untitled";

  if (!posterUrl || imageFailed) {
    return (
      <div
        className="flex h-18 w-12 shrink-0 items-center justify-center rounded bg-code text-center text-[9px] font-medium leading-tight text-foreground"
        role="img"
        aria-label={`Poster unavailable for ${title}`}
      >
        No poster
      </div>
    );
  }

  return (
    <img
      className="h-18 w-12 shrink-0 rounded object-cover"
      src={posterUrl}
      alt={`${title} poster`}
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );
}

function MovieSearchList({
  movies = [],
  onMovieInfo,
  onDelete,
  showUserRating = false,
}) {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-y-3 @md:grid-cols-2 @md:gap-x-4 ">
      {movies.map((movie) => {
        const title = movie.title || movie.name || movie.original_title || movie.original_name || "Untitled";
        // TV shows use `first_air_date`, movies use `release_date`
        const releaseDate = movie.release_date || movie.first_air_date;
        // TV shows use `genre_ids` too, so this works for both
        const genreIds = movie.genre_ids ?? [];
        // Badge: show "TV" label for TV show results so users know the type
        const isTV = movie.media_type === "tv";

        return (
          <li
            key={movie.id}
            className="relative flex items-center gap-3 border-b border-border pb-3 last:border-b-0 @md:rounded-lg @md:border @md:p-2 cursor-pointer"
            onClick={() => onMovieInfo?.(movie)}
            role={onMovieInfo ? "button" : undefined}
            tabIndex={onMovieInfo ? 0 : undefined}
          >
            <MoviePoster movie={movie} />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h2 className="truncate font-heading text-base font-semibold leading-tight text-heading">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 text-xs leading-relaxed text-foreground">
                <span>{releaseDate?.slice(0, 4) || "Year unknown"}</span>
                {isTV && (
                  <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    TV
                  </span>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-heading">
                  <span aria-hidden="true" className="text-accent">
                    ★
                  </span>{" "}
                  {showUserRating && Number.isFinite(movie.userRating)
                    ? `${movie.userRating}/10 (your rating)`
                    : Number.isFinite(movie.vote_average)
                      ? movie.vote_average.toFixed(1)
                      : "Not rated"}
                </span>
                {!showUserRating && Number.isFinite(movie.vote_count) && (
                  <span>({movie.vote_count.toLocaleString()} votes)</span>
                )}
              </div>
              {genreIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {genreIds.slice(0, 2).map((genreId) => (
                    <span
                      key={genreId}
                      className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium leading-tight text-heading"
                    >
                      {genreNames[genreId] ?? "Other"}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {onDelete && (
              <button
                type="button"
                aria-label={`Remove ${title} from watchlist`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(movie.id);
                }}
                className="ml-auto shrink-0 rounded-full p-1.5 text-foreground transition-colors hover:bg-accent-soft hover:text-accent cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default MovieSearchList;
