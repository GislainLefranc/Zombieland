import Activity from '../models/Activity.js';
import Multimedia from '../models/Multimedia.js';
import { uploadImage, deleteImage } from '../services/uploadImage.js';

export const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll({
            include: [{
                model: Multimedia,
                as: 'multimedias',
                attributes: ['id', 'name', 'url']
            }]
        });

        if (!activities.length) {
            return res.status(404).json({ message: 'Aucune activité trouvé' });
        }
        res.status(200).json(activities);
    } catch (error) {
        console.error('Server error while fetching activities', error);
        res.status(500).json({ message: 'Server error while fetching activities' });
    }
};

export const getOneActivity = async (req, res) => {
    try {
        const activityId = Number(req.params.id);
        const activity = await Activity.findByPk(activityId)
        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvée' });
        }
        res.status(200).json(activity);
    } catch (error) {
        console.error('Server error while fetching activity', error);
        res.status(500).json({ message: 'Server error while fetching activity' });

    }
};

export const createActivity = async (req, res) => {
    try {
        console.log("Données reçues pour créer une activité :", req.body);
        const { title, description, category_id, image } = req.body;

        if (!title) {
            return res.status(400).json({ message: "An activity should have a title" });
        }
        if (!description) {
            return res.status(400).json({ message: "An activity should have a description" });
        }
        if (!category_id) {
            return res.status(400).json({ message: "Le champ category_id est requis." });
        }

        const multimedias = [];
        if (image) {
            const imageUrl = await uploadImage(image, 'activities');
            multimedias.push({
                name: title,
                url: imageUrl
            });
        }

        const newActivity = await Activity.create(
            { title, description, category_id, multimedias },
            {
                include: [{ model: Multimedia, as: 'multimedias' }]
            }
        );

        if (!newActivity) {
            return res.status(500).json({ message: "Something went wrong while creating the activity" });
        }

        res.status(201).json(newActivity);

    } catch (error) {
        console.error('Server error while creating activity:', error);
        res.status(500).json({ message: 'Server error while creating activity' });
    }
};

export const updateActivity = async (req, res) => {
    try {
        const activityId = Number(req.params.id);
        const { title, description, category_id, image } = req.body;

        const activity = await Activity.findByPk(activityId)
        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvé' });
        }

        activity.title = title;
        activity.description = description;
        activity.category_id = category_id;
        await activity.save();

        // (Si on a reçu une image depuis le front-end)
        if (image) {
            // (Si l'utilisateur a déjà une image)
            const imageMultimedias = await activity.getMultimedias();
            let imageMultimedia = imageMultimedias[0];

            if (imageMultimedia) {
                await deleteImage(imageMultimedia.url, 'activities');
            } else {
                imageMultimedia = Multimedia.build({
                    name: activity.title,
                    url: ""
                });
            }

            // (Uploader l'image sur Cloudinary)
            const imageUrl = await uploadImage(image, 'activities');
            // (Mettre à jour l'URL de l'image dans les données)
            imageMultimedia.url = imageUrl;
            await imageMultimedia.save();

            await activity.setMultimedias([imageMultimedia]);
        };

        res.status(204).json(activity);
    } catch (error) {
        console.error('Server error while updating activity', error);
        res.status(500).json({ message: 'Server error while updating activity' });
    }
};

export const deleteActivity = async (req, res) => {
    try {
        const activityId = Number(req.params.id);

        const activity = await Activity.findByPk(activityId);

        //Récupérer le multimédia
        const imageMultimedias = await activity.getMultimedias();
        const imageMultimedia = imageMultimedias[0];
        console.log(imageMultimedia);

        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvée' });
        }

        // Supprimer l'image de Cloudinary si elle existe
        if (imageMultimedia) {
            await deleteImage(imageMultimedia.url, 'activities');
            await imageMultimedia.destroy();
        }

        await activity.destroy();
        res.status(204).json({ message: 'Activity is destroy' });

    } catch (error) {
        console.error('Erreur serveur lors de la suppression de l\'activité:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'activité' });
    }
};

//Multimedia
export const getActivityMultimedia = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvée' });
        }
        const medias = await activity.getMultimedia();
        res.status(200).json(medias);
    } catch (error) {
        console.error('Erreur lors de la récupération des multimédias:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des multimédias' });
    }
};

export const addMultimediaToActivity = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvée' });
        }

        const multimedia = await Multimedia.findByPk(req.body.multimediaId);
        if (!multimedia) {
            return res.status(404).json({ message: 'Multimédia non trouvé' });
        }

        await activity.addMultimedia(multimedia);

        res.status(200).json({ message: 'Multimédia ajouté avec succès à l\'activité' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du multimédia:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du multimédia' });
    }
};

export const removeMultimediaFromActivity = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activité non trouvée' });
        }

        const multimediaId = req.params.multimediaId;
        const multimedia = await Multimedia.findByPk(multimediaId);
        if (!multimedia) {
            return res.status(404).json({ message: 'Multimédia non trouvé' });
        }

        // Supprimer l'image de Cloudinary si elle existe
        await deleteImage(multimedia);

        await activity.removeMultimedia(multimedia);

        res.status(200).json({ message: 'Multimédia retiré avec succès de l\'activité' });
    } catch (error) {
        console.error('Erreur lors de la suppression du multimédia:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du multimédia' });
    }
};


// Documentation des fonctions ajoutées par le many-to-many de Sequelize :
// https://sequelize.org/docs/v6/core-concepts/assocs/#foohasmanybar