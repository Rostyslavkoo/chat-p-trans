import { useState } from "react";
import { Star } from "lucide-react";
import { useConversationStore } from "~/stores/conversation.store";

const STARS = [1, 2, 3, 4, 5];

export function RatingForm() {
  const submitRating = useConversationStore((state) => state.submitRating);
  const skipRating = useConversationStore((state) => state.skipRating);

  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [comment, setComment] = useState("");

  const highlightedCount = hoveredStars || stars;

  return (
    <div className="rating">
      <p className="rating__title">Оцініть роботу оператора</p>

      <div className="rating__stars" onMouseLeave={() => setHoveredStars(0)}>
        {STARS.map((value) => (
          <button
            key={value}
            type="button"
            className="rating__star"
            aria-label={`${value} з 5`}
            onMouseEnter={() => setHoveredStars(value)}
            onClick={() => setStars(value)}
          >
            <Star
              size={26}
              strokeWidth={1.5}
              className={value <= highlightedCount ? "rating__star-icon--filled" : ""}
            />
          </button>
        ))}
      </div>

      <textarea
        className="rating__comment"
        placeholder="Залиште коментар (необовʼязково)"
        rows={2}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />

      <div className="rating__actions">
        <button type="button" className="rating__skip" onClick={skipRating}>
          Пропустити
        </button>
        <button
          type="button"
          className="rating__submit"
          disabled={stars === 0}
          onClick={() => submitRating({ stars, comment: comment.trim() })}
        >
          Надіслати
        </button>
      </div>
    </div>
  );
}
