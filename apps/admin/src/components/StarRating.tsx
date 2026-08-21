interface StarRatingProps {
  value: number;
  max?: number;
}

/** Read-only star display — e.g. 3/5 stars filled. Rounds down to whole stars. */
export function StarRating({ value, max = 5 }: StarRatingProps) {
  const filledCount = Math.floor(value);

  return (
    <span className="inline-flex" aria-label={`${value} з ${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className={index < filledCount ? "text-brand-yellow" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}
