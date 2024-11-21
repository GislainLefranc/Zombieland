import { useEffect, useState } from "react";
import { Card, CardProps } from "../components/ActivityCard";
import { getDatas } from "../services/api";

interface Category {
  id: number;
  name: string;
}

interface ActivityWithCategory extends CardProps {
  category: Category | null;
}

const Activities = () => {
  const [activities, setActivities] = useState<ActivityWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesData, categoriesData] = await Promise.all([
          getDatas("/activities"),
          getDatas("/categories"),
        ]);

        // Ajout de la catégorie et de l'image à chaque activité
        const activitiesWithCategories = activitiesData.map((activity: CardProps) => {
          // Trouve la catégorie associée à l'activité
          const category = categoriesData.find(
            (cat: Category) => cat.id === activity.category_id // Utilisation de category_id pour lier l'activité à sa catégorie
          );
          return {
            ...activity,
            category: category || null, // Si aucune catégorie trouvée, on met `null`
            backgroundImage: activity.multimedias?.[0]?.url || "", // Récupération de la première image des médias associés à l'actitvité
          };
        });

        setActivities(activitiesWithCategories);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []); // Le tableau vide signifie que l'effet de bord se déclenche une seule fois lors du montage du composant

  // Fonction de gestion du changement du champ de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fonction de gestion du changement de la catégorie sélectionnée
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Filtrage et normalisation sans fonction séparée
  const filteredActivities = activities.filter((activity) => {
    const normalizedTitle = activity.title
      .toLowerCase() // Conversion du titre en minuscle pour une comparaison insensible à la casse
      .normalize("NFD") // Normaliser le titre pour enlever les conflits avec les accents
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, ""); // Retirer les caractères diacritiques qui peuvent générer des conflits
    const normalizedSearchTerm = searchTerm
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "");

    return (normalizedTitle.includes(normalizedSearchTerm) || searchTerm.length <= 1) &&
           (selectedCategory === "all" || activity.category?.id.toString() === selectedCategory);
  });

  // Vérification des activités qui correspondent à la recherche mais pas à la catégorie sélectionnée
  const hasMatchingActivitiesButWrongCategory = activities.some((activity) => {
    const normalizedTitle = activity.title
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "");
    const normalizedSearchTerm = searchTerm
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, "");

    return normalizedTitle.includes(normalizedSearchTerm) && selectedCategory !== "all" && activity.category?.id.toString() !== selectedCategory;
  });

  return (
    <div className="bg-black min-h-screen min-w-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Toutes les activités</h1>

        <div className="mb-4 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Rechercher une activité..."
          className="px-4 py-2 border rounded-md w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          className="px-4 py-2 border rounded-md w-full lg:w-1/5"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((category) => (
          <option key={category.id} value={category.id.toString()}>
            {category.name}
          </option>
        ))}
        </select>
      </div>

        {/* Affichage d'un message si aucune activité ne correspond aux critères de recherche */}
        {filteredActivities.length === 0 && searchTerm.length > 1 ? (
          <p className="text-center text-white">
            Aucune activité trouvée pour "{searchTerm}". 
            {hasMatchingActivitiesButWrongCategory && (
              <span> Vérifiez la catégorie dans le filtre.</span>
            )}
          </p>
        ) : (
          // Si les activités sont filtrées, on les affiche dans un grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                id={activity.id}
                backgroundImage={activity.backgroundImage} // Affichage de l'image ici
                title={activity.title}
                description={activity.description}
                buttonText="Découvrir"
                to="/activity"
                category={activity.category}
                multimedias={activity.multimedias}
                category_id={activity.category_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
