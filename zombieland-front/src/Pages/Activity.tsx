import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CardProps, Card } from "../components/ActivityCard";
import ReviewSection from "../components/ReviewSection";

const Activity: React.FC = () => {
  const location = useLocation();
  const activity = location.state?.activity as CardProps;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!activity) {
    return <p className="text-center text-white">Aucune activité sélectionnée.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-4">
      <div className="w-full max-w-3xl">
        <Card
          id={activity.id}
          backgroundImage={activity.backgroundImage}
          title={activity.title}
          description={activity.description}
          buttonText="Retour"
          to="/"
          category={activity.category}
          imageHeight="60rem" // Set a custom height here
          multimedias={activity.multimedias}
          category_id={activity.category_id}
        />
         {/* Ajout du système de notation */}
         <div className="mt-8">
          <ReviewSection activityId={activity.id} />
        </div>
      </div>
    </div>
  );
};

export default Activity;