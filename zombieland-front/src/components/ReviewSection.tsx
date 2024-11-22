import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/reviews");
        if (Array.isArray(response.data)) {
          setReviews(response.data.slice(0, 3)); // Limiter à 3 avis
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      <h3 className="text-white text-lg font-bold mb-4">Avis des visiteurs</h3>
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
        <p className="text-white">Pas encore d'avis.</p>
      )}
    </div>
  );
};

export default ReviewSection;
