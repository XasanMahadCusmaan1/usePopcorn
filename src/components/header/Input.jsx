function Input({ onQueryChange, query }) {
  return (
    <form>
      <input
        className="w-full rounded-lg bg-accent-soft p-2 font-heading text-base placeholder:text-heading focus:outline-0 md:w-sm"
        type="text"
        name="search input"
        onChange={(e) => onQueryChange(e.target.value)}
        value={query}
        placeholder="Search Movies......"
      />
    </form>
  );
}

export default Input;
