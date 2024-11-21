import Review from '../models/Review.js';

// Get all reviews (Obtenir tous les avis)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Server error while fetching reviews error');
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Get a single review by ID (Obtenir un avis par ID)
export const getReviewById = async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
        }
      res.status(200).json(review);
    } catch (error) {
      console.error('Server error while fetching review error');
      res.status(500).json({ message: 'Server error while fetching review' });
    }
  };
  
  // Create a review (Créer un avis)
  export const createReview = async (req, res) => {  
    try {
      const { note, comment, reservation_id } = req.body;
      const newReview = await Review.create({ note, comment, reservation_id });
      res.status(201).json(newReview);
    } catch (error) {
      console.error('Server error while creating review error',error);
      res.status(500).json({ message: 'Server error while creating review' });
    }
  };     
  
// Update an existing review (Mettre à jour un avis existant)
export const updateReview = async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Review.update(req.body, { where: { id } });
  
      if (!updated) {
        return res.status(404).json({ message: 'Review not found' }); // Avis non trouvé
      }
      const updatedReview = await Review.findByPk(id);
      res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Server error while updating review (Erreur serveur lors de la mise à jour de l\'avis)', error);
      res.status(500).json({ message: 'Server error while updating review (Erreur serveur lors de la mise à jour de l\'avis)' });
    }
  };
  
  // Delete a review (Supprimer un avis)
  export const deleteReview = async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' }); 
      }
      await review.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Server error while deleting review', error);
      res.status(500).json({ message: 'Server error while deleting review' });
    }
  };