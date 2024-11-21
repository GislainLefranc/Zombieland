import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Review {
  id: number;
  note: number;
  comment: string;
}

interface ReviewSectionProps {
  activityId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ activityId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>(`/api/reviews?activity_id=${activityId}&page=${page}`);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get<{ averageRating: number }>(`/api/reviews/average/${activityId}`);
        setAverageRating(response.data.averageRating || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
    fetchAverageRating();
  }, [activityId, page]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!activityId) {
      setError('Activity ID is required.');
      return;
    }
  
    if (rating < 1) {
      setError('Please select at least one star.');
      return;
    }
  
    try {
      await axios.post('/api/reviews', { note: rating, comment, activity_id: activityId });
      setComment('');
      setRating(0);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error submitting the review.');
    }
  };

  return (
    <div>
      <h3>Reviews</h3>
      <p>Average Rating: {averageRating.toFixed(1)} ★</p>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>Rating: {'★'.repeat(review.note)}</p>
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
      <div>
        <h4>Write a Review</h4>
        <div>
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleRatingChange(index + 1)}
              style={{ color: index < rating ? 'gold' : 'gray', cursor: 'pointer' }}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default ReviewSection;
