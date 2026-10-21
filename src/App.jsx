import Header from "./components/header/Header.jsx";
import MovieSearchList from "./components/searchResult/MovieList.jsx";
import WatchedMoviesSummary from "./components/searchResult/WatchedSummary.jsx";
import Loading from "./components/searchResult/Loading.jsx";
import CollapsiblePanel from "./components/searchResult/Collapse.jsx";
import MoviesInfo from "./components/searchResult/MoviesInfo.jsx";
// import movies from "./data/movies.js";
import { useEffect, useState } from "react";

const KEY = import.meta.env.VITE_TMDB_API_KEY;
const WATCHED_MOVIES_STORAGE_KEY = "usePopcorn-watchedMovies";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState(() => {
    try {
      const savedMovies = localStorage.getItem(WATCHED_MOVIES_STORAGE_KEY);
      const parsedMovies = savedMovies ? JSON.parse(savedMovies) : [];

      return Array.isArray(parsedMovies) ? parsedMovies : [];
    } catch (storageError) {
      console.error("Could not load watched movies from local storage:", storageError);
      return [];
    }
  });

  const isSearching = debouncedQuery.trim().length > 0;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    try {
      localStorage.setItem(
        WATCHED_MOVIES_STORAGE_KEY,
        JSON.stringify(watchedMovies),
      );
    } catch (storageError) {
      console.error("Could not save watched movies to local storage:", storageError);
    }
  }, [watchedMovies]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setIsLoading(true);
      setError("");

      let url;
      const params = new URLSearchParams({
        query: debouncedQuery.trim(),
        api_key: KEY,
      });

      if (!debouncedQuery.trim()) {
        url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${KEY}`;
      } else {
        url = `https://api.themoviedb.org/3/search/movie?${params}`;
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.results);
    }

    loadMovies()
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          console.error(requestError);
          setError("Could not load movies. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  function onSearch(value) {
    setQuery(value);
  }

  function onMovieInfo(movie) {
    setSelectedMovie(movie);
  }

  function onAddToWatchlist(movie, userRating) {
    setWatchedMovies((currentMovies) => {
      const alreadyWatched = currentMovies.some(
        (watchedMovie) => watchedMovie.id === movie.id,
      );

      if (alreadyWatched) {
        return currentMovies.map((watchedMovie) =>
          watchedMovie.id === movie.id
            ? { ...watchedMovie, userRating }
            : watchedMovie,
        );
      }

      return [...currentMovies, { ...movie, userRating }];
    });
    setSelectedMovie(null);
  }

  return (
    <div className="min-h-screen bg-accent-soft">
      <Header
        onQueryChange={onSearch}
        query={query}
        movies={movies}
        isLoading={isLoading}
      />
      <main className="mx-auto my-8 grid w-full max-w-6xl grid-cols-1 items-start gap-4 px-4 sm:px-6 md:grid-cols-2">
        <div className={selectedMovie ? "hidden md:block" : "block"}>
          <CollapsiblePanel
            title={
              isSearching
                ? `Search results for “${debouncedQuery.trim()}”`
                : "Trending Movies"
            }
            titleClassName={
              isSearching
                ? "text-lg text-accent sm:text-xl"
                : "text-xl text-heading sm:text-2xl"
            }
          >
            {isLoading ? (
              <Loading />
            ) : error ? (
              <p className="py-6 text-center text-sm text-foreground">
                {error}
              </p>
            ) : (
              <MovieSearchList movies={movies} onMovieInfo={onMovieInfo} />
            )}
          </CollapsiblePanel>
        </div>
        {selectedMovie ? (
          <MoviesInfo
            movie={selectedMovie}
            onBack={() => setSelectedMovie(null)}
            onAddToWatchlist={onAddToWatchlist}
          />
        ) : (
          <CollapsiblePanel title="Movies You Watched">
            <WatchedMoviesSummary
              movies={watchedMovies}
              onMovieInfo={onMovieInfo}
            />
          </CollapsiblePanel>
        )}
      </main>
    </div>
  );
}

export default App;
