function Button({ label, onCollapse, isExpanded }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={isExpanded}
      className="absolute right-0 top-1/2 size-8 -translate-y-1/2 cursor-pointer rounded-full bg-accent text-2xl text-background"
      onClick={onCollapse}
    >
      <span aria-hidden="true">{isExpanded ? "-" : "+"}</span>
    </button>
  );
}

export default Button;
