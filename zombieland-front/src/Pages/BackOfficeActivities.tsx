// Import the necessary elements
import { useCallback, useEffect, useState } from "react";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import ActivitiesModal from "../components/ActivitiesModal";
import { toast } from 'react-toastify';

interface ActiProps {
	id: number;
	multimedias?: { url: string }[];
	title: string;
	description: string;
	category_id: number;
}
// Interface for categories
interface Category {
	id: number;
	name: string;
}
// Interface for the data submitted via the activity creation/edit form
interface ActivityFormData {
	id?: number;
	title: string;
	description: string;
	category_id: number;
}

interface Activity {
	id: number;
	title: string;
	description: string;
	image: string;
	category: number;
	category_id: number;
}

const BackOfficeActivities: React.FC = () => {
	// Definition of the state variables needed for the back-office of activities
	// Defines the list of available activities and returns an array of objects of type Activity, initially empty and filled later with API data
	const [activities, setActivities] = useState<Activity[]>([]);
	// Same as activities, but for categories
	const [categories, setCategories] = useState<Category[]>([]);
	// Contains the IDs of the selected activities and returns an array of numbers (starts with an empty array)
	const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
	// Stores the term searched by the user, it's a string and is empty by default
	const [searchTerm, setSearchTerm] = useState("");
	// Contains the selected category for filtering, it's a string and its initial value is "all" to display all categories by default
	const [selectedCategory, setSelectedCategory] = useState("all");
	// Manages the open state of the Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Manages the loading state (e.g., button text during processing)
	const isLoading = false;
	// Stores the selected activity for editing; it returns either the activity or null
	const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
	// Manages the open state of the edit modal
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Definition of an asynchronous function to fetch data
	const fetchData = useCallback(async () => {
		try {
			// Uses Promise.all to perform multiple requests in parallel
			const [activitiesData, categoriesData] = await Promise.all([
				getDatas("/activities"),
				getDatas("/categories"),
			]);

			const activitiesDatas: Activity[] = activitiesData.map(
				(activity: ActiProps) => {
					return {
						id: activity.id,
						image: activity.multimedias?.[0]?.url || "", // Extracting the first multimedia URL if available
						title: activity.title,
						description: activity.description,
						category: activity.category_id,
					};
				},
			);

			setActivities(activitiesDatas);
			setCategories(categoriesData);
		} catch (error) {
			// Error handling in case data retrieval fails
			console.error("Error while fetching data", error);
		}
	}, []);

	useEffect(() => {
		// Calls the fetchData function
		fetchData();
		// An empty array [] as the second argument ensures that this effect
		// is executed only once, when the component mounts
	}, [fetchData]);

	console.table(activities);
	const handleSelectionChange = (id: number) => {
		// Updates the state of selected activities
		setSelectedActivities((prev) =>
			// If the ID is already in the list of selected activities, it is removed (deselection); otherwise, it's added to the list (selection)
			prev.includes(id)
				? prev.filter((activityId) => activityId !== id)
				: [...prev, id],
		);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Updates the search term when the user types in the search field
		setSearchTerm(e.target.value);
	};

	const filteredActivities = activities.filter(
		(activity) =>
			// Checks two conditions for each activity

			// Condition 1: Filter by category
			// If "all" is selected, all categories are included
			// Otherwise, checks if the activity's category matches the selected category
			(selectedCategory === "all" ||
				activity.category.toString() === selectedCategory) &&
			// Condition 2: Filter by search term
			// Checks if the activity's title (lowercased) includes the search term (lowercased)
			activity.title
				.toLowerCase()
				.includes(searchTerm.toLowerCase()),
	);

	if (activities.length === 0) {
		// If the activities array is empty, displays the text "No activities available at the moment"
		return (
			<p className="text-center text-white">
				No activities available at the moment.
			</p>
		);
	}

	const handleCreateActivity = async (newActivity: ActivityFormData) => {
		// Handles the creation of a new activity
		try {
			// Log to indicate the function was triggered
			console.log("handleCreateActivity triggered");
			// Displays the new activity data before sending to the server
			console.log("Data sent to server:", newActivity);
			// API call to create the new activity
			const createdActivity = await createData("/activities", newActivity);
			console.log("Created activity:", createdActivity); // Debugging
			// Updates the local state by adding the new activity to the existing list
			setActivities((prevActivities) => [...prevActivities, createdActivity]);
			// Closes the modal after successful creation
			setIsModalOpen(false);
			toast.success("Activité créée avec succès !");
		} catch (error) {
			// In case of an error during creation, logs the error to the console
			console.error("Error while creating activity:", error);
			toast.error("Erreur lors de la création de l'activité. Veuillez réessayer plus tard.");
		}
	};

	const handleEditClick = () => {
		// Handles the "Edit" button click
		// Checks if only one activity is selected
		if (selectedActivities.length === 1) {
			// Searches for the selected activity in the activities list
			const activityToEdit = activities.find(
				(activity) => activity.id === selectedActivities[0],
			);
			// If the activity is found
			if (activityToEdit) {
				console.log(
					"Activity to edit before state update:",
					activityToEdit,
				);
				// Updates the state with the activity to edit
				setActivityToEdit(activityToEdit);
				// Opens the edit modal
				setIsEditModalOpen(true);
			}
		}
	};

	const handleUpdateActivity = async (updatedActivity: ActivityFormData) => {
		// Handles updating an existing activity
		try {
			// Checks if the activity to update has a valid ID
			if ("id" in updatedActivity && typeof updatedActivity.id === "number") {
				// Checks if `category_id` is defined
				if (
					updatedActivity.category_id === undefined ||
					updatedActivity.category_id === null
				) {
					console.error(
						"category_id is missing in update data.",
					);
					return; // Stops the function if `category_id` is `undefined` or `null`
				}

				console.log("Updated data sent:", updatedActivity);

				// API call to update the activity
				const updatedActivityFromServer = await updateData(
					"/activities",
					updatedActivity.id,
					updatedActivity,
				);
				console.log(
					"Updated activity received from server:",
					updatedActivityFromServer,
				);

				// Updates the local state of activities with the updated activity
				setActivities((prevActivities) =>
					prevActivities.map((activity) =>
						activity.id === updatedActivityFromServer.id
							? updatedActivityFromServer
							: activity,
					),
				);
				// Fetches all activities again from the server to ensure the latest data
				const refreshedActivities = await getDatas("/activities");
				setActivities(refreshedActivities);
				
				// Closes the edit modal
				setIsEditModalOpen(false);
				toast.success("Activité modifiée avec succès !");
				// Resets the activity being edited
				setActivityToEdit(null);
				// Clears the selection of activities
				setSelectedActivities([]);
			} else {
				// Logs an error if the activity ID is invalid
				console.error("The activity to update has an invalid ID");
			}
		} catch (error) {
			// Handles errors that may occur during the update
			console.error("Error while updating activity:", error);
			toast.error("Erreur lors de la modification de l'activité. Veuillez réessayer plus tard.");
		}
	};

	const handleDeleteSelectedActivities = async () => {
		// Cette fonction gère la suppression des activités sélectionnées
		// Vérifie si au moins une activité est sélectionnée
		if (selectedActivities.length === 0) {
			alert("Veuillez sélectionner au moins une activité à supprimer");
			return;
		}
		// Demande une confirmation à l'utilisateur avant de procéder à la suppression
		const confirmDelete = window.confirm(
			`Êtes-vous sur de vouloir supprimer ${selectedActivities.length} activité(s) ?`,
		);
		if (!confirmDelete) return; // Si l'utilisateur annule, on arrête la fonction

		try {
			// Boucle sur chaque ID d'activité sélectionnée pour les supprimer une par une
			for (const activityId of selectedActivities) {
				await deleteData("/activities", activityId);
			}
			// Met à jour l'état local en filtrant les activités supprimées
			setActivities((prevActivities) =>
				prevActivities.filter(
					(activity) => !selectedActivities.includes(activity.id),
				),
			);
			// Réinitialise la liste des activités sélectionnées
			setSelectedActivities([]);
			toast.success("Activité supprimée avec succès !");
		} catch (error) {
			// Gère les erreurs qui peuvent survenir pendant la suppression
			console.error("Erreur lors de la suppression des activités:", error);
			toast.error("Erreur lors de la suppression de l'activité. Veuillez réessayer plus tard.");
		}
	};


	const SmallScreenMessage = () => (
		<div className="flex items-center justify-center h-screen bg-gray-100 p-4">
		  <p className="text-center text-xl font-semibold">
			Cette page n'est disponible que sur ordinateur. Veuillez utiliser un écran plus large pour accéder au contenu.
		  </p>
		</div>
	  );

	return (
		<>
		{/* Affiche le message sur les petits écrans */}
			<div className="lg:hidden">
        		<SmallScreenMessage />
      		</div>
		
		{/* Affiche le contenu normal sur les écrans moyens et grands */}
			<div className="hidden lg:flex h-screen bg-gray-100">
        		<Aside />
        	<div className="flex-1 overflow-auto">
          {/* ... (le reste du contenu existant) */}
		  <div className="flex h-screen bg-gray-100">
			
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">
						Administration des Activités
					</h1>

					<div className="mb-4 flex space-x-4 ">
						<input
							type="text"
							placeholder="Rechercher une activité..."
							className="px-4 py-2 border rounded-md flex-grow focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="px-4 py-2 border rounded-md w-1/5 focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							<option value="all">Toutes les catégories</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id.toString()}>
									{category.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 flex space-x-4 justify-end ">
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={() => setIsModalOpen(true)}
						>
							Créer
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedActivities.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleDeleteSelectedActivities}
							disabled={selectedActivities.length === 0 || isLoading}
						>
							{isLoading ? "Suppression..." : "Supprimer"}
						</button>
					</div>
					<ActivitiesModal
						isOpen={isModalOpen || isEditModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setIsEditModalOpen(false);
							setActivityToEdit(null);
						}}
						onSubmit={async (formData) => {
							await (isEditModalOpen
								? handleUpdateActivity
								: handleCreateActivity)(formData);
							fetchData();
						}}
						categories={categories}
						activity={activityToEdit}
					/>

					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Nom
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Image
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Catégorie
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
										Sélection
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredActivities.map((activity) => (
									<tr key={activity.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											{activity.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{activity.title}
										</td>
										<td>
											<div className="flex gap-2 items-center mt-2 gap-x-3">
												{activity.image === null ? (
													<UserCircleIcon
														aria-hidden="true"
														className="w-12 h-12 text-gray-300"
													/>
												) : (
													<img
														alt=""
														src={activity.image}
														className="inline-block h-14 w-14 rounded-md"
													/>
												)}
											</div>
										</td>
										<td className="px-6 py-4">{activity.description}</td>

										<td className="px-6 py-4 whitespace-nowrap">
											{categories.find((cat) => cat.id === activity.category)
												?.name || "Non catégorisé"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<input
												type="checkbox"
												checked={selectedActivities.includes(activity.id)}
												onChange={() => handleSelectionChange(activity.id)}
												className="h-4 w-4 text-red-primary focus:ring-red-secondary border-gray-300 rounded"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
        	</div>
     	 </div>
		</>
		
	);
};

export default BackOfficeActivities;