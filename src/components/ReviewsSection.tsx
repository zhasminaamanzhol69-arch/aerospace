import { useEffect, useState } from 'react';
import { addReview, loadReviews, type Review } from '../lib/reviews';
import { demoReviews, type DemoReview } from '../lib/demoReviews';
import { reviewsText } from '../lib/reviewsText';
import { useLanguage } from '../lib/language';
import './ReviewsSection.css';

type Props = {
  canReview: boolean;
};

export function ReviewsSection({ canReview }: Props) {
  const { language } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState('');
  const copy = reviewsText[language];
  const movingReviews = [...demoReviews[language], ...demoReviews[language]];

  useEffect(() => {
    loadReviews().then((result) => {
      setReviews(result.reviews);
      if (result.error === 'not-configured') setMessage(copy.login);
    });
  }, [copy.login]);

  async function handleSubmit() {
    setMessage('');
    if (!canReview) {
      setMessage(copy.login);
      return;
    }
    if (comment.trim().length < 2) {
      setMessage(copy.short);
      return;
    }

    const error = await addReview(rating, comment);
    if (error) {
      setMessage(error === 'not-configured' || error === 'not-authenticated' ? copy.login : error);
      return;
    }

    setComment('');
    setMessage(copy.success);
    const result = await loadReviews();
    setReviews(result.reviews);
  }

  return (
    <section className="reviews-section">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h3>{copy.title}</h3>
        <p>{copy.subtitle}</p>
      </div>
      {canReview ? (
        <>
          <div className="reviews-section__stars" aria-label={copy.title}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button className={star <= rating ? 'is-active' : ''} key={star} onClick={() => setRating(star)} type="button">
                ★
              </button>
            ))}
          </div>
          <label>
            <span>{copy.comment}</span>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} rows={4} />
          </label>
          <button onClick={handleSubmit} type="button">{copy.submit}</button>
        </>
      ) : (
        <p className="reviews-section__guest">{copy.guest}</p>
      )}
      {message && <p className="reviews-section__message">{message}</p>}
      <div className="reviews-section__list">
        {reviews.length === 0 ? <p>{copy.empty}</p> : reviews.map((review) => <ReviewItem key={review.id} review={review} />)}
      </div>
      <div className="reviews-section__demo-header">
        <h4>{copy.otherTitle}</h4>
      </div>
      <div className="reviews-section__demo-window">
        <div className="reviews-section__demo-track">
          {movingReviews.map((review, index) => (
            <DemoReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="reviews-section__item">
      <strong>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</strong>
      <p>{review.comment}</p>
      <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
    </article>
  );
}

function DemoReviewCard({ review }: { review: DemoReview }) {
  return (
    <article className="reviews-section__demo-card">
      <strong>{review.name}</strong>
      <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
      <p>{review.comment}</p>
    </article>
  );
}
