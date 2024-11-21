import cloudinary from './cloudinaryConfig.js';

// Upload image to Cloudinary
export const uploadImage = async (dataUrl, folder) => {
    try {
        const result = await cloudinary.uploader.upload(dataUrl, { folder }); // Upload image
        return result.secure_url; // Return image URL
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error); // Log error
        throw new Error('Failed to upload image'); // Throw error
    }
};

// Delete image from Cloudinary
export const deleteImage = async (imageUrl, folder) => {
    const ExtractpublicId = /([^\/]+)\.[a-z]+$/.exec(imageUrl)?.[1]; // Extract public ID
    const publicId = `${folder}/${ExtractpublicId}`

    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId); // Supprimer l'image de Cloudinary
            console.log(`Image supprimée avec succès de Cloudinary : ${publicId}`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'image de Cloudinary : ${publicId}`, error);
            throw new Error('Échec de la suppression de l\'image');
        }
    } else {
        console.error('ID public introuvable pour l\'image. Impossible de supprimer.');
    }
};
