import React, { useState } from "react";
import { toast } from "react-toastify";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [note, setNote] = useState(1);
  const [comment, setComment] = useState("");

  const handleStarClick = (star: number) => {
    setNote(star);
  };

  const handleSubmit = () => {
    onSubmit(note, comment);
    onClose();
    toast.success("Avis soumis avec succès !");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Laisser un avis</h2>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)}
              className={`cursor-pointer text-2xl ${
                star <= note ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Votre commentaire..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
