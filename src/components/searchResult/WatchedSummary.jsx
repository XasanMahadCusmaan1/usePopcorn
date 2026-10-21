import MovieSearchList from "./MovieList.jsx";

function WatchedMoviesSummary({ movies = [], onMovieInfo }) {
  const averageUserRating =
    movies.length > 0
      ? (
          movies.reduce((total, movie) => total + movie.userRating, 0) /
          movies.length
        ).toFixed(1)
      : "—";
  const averageTmdbRating =
    movies.length > 0
      ? (
          movies.reduce((total, movie) => total + movie.vote_average, 0) /
          movies.length
        ).toFixed(1)
      : "—";

  return (
    <div className="pt-4">
      <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-t-md bg-social px-4 py-3 font-sans text-sm text-foreground">
        <span>🎥 {movies.length} {movies.length === 1 ? "movie" : "movies"}</span>
        <span>⭐ Your average: {averageUserRating}</span>
        <span>🌟 TMDB average: {averageTmdbRating}</span>
      </div>
      {movies.length > 0 ? (
        <MovieSearchList
          movies={movies}
          onMovieInfo={onMovieInfo}
          showUserRating
        />
      ) : (
        <p className="px-1 py-4 text-sm text-foreground">
          Movies you add will appear here.
        </p>
      )}
    </div>
  );
}

export default WatchedMoviesSummary;
