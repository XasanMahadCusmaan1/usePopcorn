function ResultsFound({ movies, query, isLoading }) {
  return (
    <span>
      {isLoading
        ? "Loading movies..."
        : `${!query ? "Trending movies" : "Found"} `}
      {!isLoading && (
        <>
          <strong className="text-accent">{movies.length}</strong> Results
        </>
      )}
    </span>
  );
}

export default ResultsFound;
