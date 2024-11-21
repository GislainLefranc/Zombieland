import React, { useState, useEffect } from "react";
import axios from "axios";

interface ReviewSectionProps {
  activityId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ activityId }) => {
    const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/reviews?activity_id=${activityId}`);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [activityId]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const requestData = {
      note: rating,
      comment,
      activity_id: activityId, // L'ID de l'activité
    };
  
    console.log("Submitting review:", requestData); // Debugging
  
    try {
      const response = await axios.post("http://localhost:3000/reviews", requestData);
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setComment("");
      setRating(0);
      setError("");
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to submit review. Please try again.");
    }
  };   

  return (
    <div>
      <h3 className="text-white text-lg font-bold mb-4">Avis</h3>
      {reviews.length > 0 ? (
  <ul>
  {reviews.map((review) => (
    <li key={review.id} className="mb-4">
      <p style={{ color: "yellow" }}>{"★".repeat(review.note)}</p>
      <p style={{ color: "white" }}>{review.comment}</p>
    </li>
  ))}
</ul>
) : (
  <p className="text-white">Avis non disponnible.</p>
)}
      <div className="mt-4">
        <h4 className="text-white text-md font-semibold mb-2">Ecrire un avis :</h4>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleRatingChange(index + 1)}
              style={{ color: index < rating ? "gold" : "gray", cursor: "pointer" }}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full p-2 mb-2"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );  
};

export default ReviewSection;
