function Loading({ message = "Loading movies..." }) {
  return (
    <div
      className="flex items-center justify-center gap-3 py-10 text-sm text-foreground"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-5 animate-spin rounded-full border-2 border-accent-border border-t-accent"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}

export default Loading;
