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
  const title = movie.title || movie.original_title || "Untitled movie";

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
  showUserRating = false,
}) {
  return (
    <ul className="mt-6 grid grid-cols-1 gap-y-3 @md:grid-cols-2 @md:gap-x-4 ">
      {movies.map((movie) => {
        const title = movie.title || movie.original_title || "Untitled movie";
        const genreIds = movie.genre_ids ?? [];

        return (
          <li
            key={movie.id}
            className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0 @md:rounded-lg @md:border @md:p-2 cursor-pointer"
            onClick={() => onMovieInfo?.(movie)}
            role={onMovieInfo ? "button" : undefined}
            tabIndex={onMovieInfo ? 0 : undefined}
          >
            <MoviePoster movie={movie} />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="truncate font-heading text-base font-semibold leading-tight text-heading">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 text-xs leading-relaxed text-foreground">
                <span>{movie.release_date?.slice(0, 4) || "Year unknown"}</span>
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
          </li>
        );
      })}
    </ul>
  );
}

export default MovieSearchList;
