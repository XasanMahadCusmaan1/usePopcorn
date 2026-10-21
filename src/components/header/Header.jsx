import Logo from "./Logo.jsx";
import Input from "./Input.jsx";
import ResultsFound from "./Result.jsx";

function Header({ onQueryChange, query, movies, isLoading }) {
  return (
    <header className="bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-3 gap-y-2 bg-social px-4 py-3 shadow-soft sm:px-6 md:flex md:flex-nowrap md:justify-between md:gap-3">
        <div className="col-start-1 row-start-1">
          <Logo />
        </div>
        <div className="header_container--input col-span-2 row-start-3 w-full md:order-0 md:w-auto">
          <Input query={query} onQueryChange={onQueryChange} />
        </div>
        <div className="header_container--result col-start-1 row-start-2 justify-self-start text-left text-sm sm:text-base md:ml-auto">
          <ResultsFound movies={movies} query={query} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}

export default Header;
