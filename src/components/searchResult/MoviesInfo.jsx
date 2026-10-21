import { useEffect, useState } from "react";
import Loading from "./Loading.jsx";
import RateMovies from "./RateMovies.jsx";

function CastMember({ actor }) {
  const [imageFailed, setImageFailed] = useState(false);
  const profileUrl = actor.profile_path
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : null;

  return (
    <li className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-border bg-social p-2 transition-colors hover:border-accent-border">
      {profileUrl && !imageFailed ? (
        <img
          className="size-12 shrink-0 rounded-full object-cover"
          src={profileUrl}
          alt={`${actor.name}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent-soft to-code font-heading text-lg font-bold text-accent"
          role="img"
          aria-label={`No profile photo available for ${actor.name}`}
        >
          {actor.name?.trim().charAt(0) || "?"}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-heading transition-colors group-hover:text-accent cursor-pointer">
          {actor.name}
        </p>
        {actor.character && (
          <p className="truncate text-xs text-foreground">{actor.character}</p>
        )}
      </div>
    </li>
  );
}

function MoviesInfo({ movie, onBack, onAddToWatchlist }) {
  const [actors, setActors] = useState([]);
  const [castLoading, setCastLoading] = useState(true);
  const [castError, setCastError] = useState("");
  const title = movie.title || movie.original_title || "Untitled movie";
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCast() {
      setCastLoading(true);
      setCastError("");

      const response = await fetch(
        `/api/tmdb/movie/${movie.id}/credits`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error(`TMDB credits request failed: ${response.status}`);
      }

      const data = await response.json();
      setActors((data.cast ?? []).slice(0, 5));
    }

    loadCast()
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
          setCastError("Could not load cast information.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCastLoading(false);
        }
      });

    return () => controller.abort();
  }, [movie.id]);

  if (castLoading) {
    return <Loading message="Loading movie details..." />;
  }

  return (
    <article className="overflow-hidden rounded-md border-2 border-accent bg-code p-3 shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-1 pb-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-accent transition hover:bg-accent-soft cursor-pointer hover:text-heading"
        >
          ← Back to movies
        </button>
        <span className="text-xs font-medium uppercase tracking-wider text-foreground">
          Movie details
        </span>
      </div>

      <div className="flex flex-col items-center gap-5 px-1 py-4 sm:flex-row sm:items-start sm:gap-6 sm:py-6">
        {posterUrl ? (
          <img
            className="aspect-2/3 w-36 shrink-0 rounded-lg object-cover shadow-soft sm:w-40"
            src={posterUrl}
            alt={`${title} poster`}
          />
        ) : (
          <div
            className="flex aspect-2/3 w-36 shrink-0 items-center justify-center rounded-lg bg-social text-sm font-medium text-foreground sm:w-40"
            role="img"
            aria-label={`Poster unavailable for ${title}`}
          >
            No poster available
          </div>
        )}

        <div className="flex w-full min-w-0 flex-col items-start gap-4 text-left">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Featured movie
            </p>
            <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-heading sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-foreground">
              {movie.release_date || "Release date unavailable"}
              {movie.original_language && (
                <span> · {movie.original_language.toUpperCase()}</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground">
            <span className="inline-flex items-center gap-1 font-semibold text-heading">
              <span className="text-accent" aria-hidden="true">★</span>
              {Number.isFinite(movie.vote_average)
                ? movie.vote_average.toFixed(1)
                : "Not rated"}
              <span className="font-normal text-foreground">/ 10</span>
            </span>
            {Number.isFinite(movie.vote_count) && (
              <span>
                {movie.vote_count.toLocaleString()} votes
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-border px-1 py-4">
        <h2 className="mb-2 font-heading text-base font-bold text-heading">
          Overview
        </h2>
        <p className="text-sm leading-relaxed text-foreground">
          {movie.overview || "No overview is available for this movie."}
        </p>
      </section>

      <RateMovies movie={movie} onAddToWatchlist={onAddToWatchlist} />

      <section className="border-t border-border px-1 py-4">
        <h2 className="mb-3 font-heading text-base font-bold text-heading">
          Top cast
        </h2>
        {castError ? (
          <p className="text-sm text-foreground">{castError}</p>
        ) : actors.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {actors.map((actor) => (
              <CastMember key={actor.id} actor={actor} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground">
            Cast information is unavailable.
          </p>
        )}
      </section>
    </article>
  );
}

export default MoviesInfo;