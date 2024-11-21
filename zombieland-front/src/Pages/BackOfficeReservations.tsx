import { useEffect, useState } from "react";
import { getDatas, createData, deleteData, updateData } from "../services/api";
import Aside from "../components/Aside";
import ReservationModal from "../components/ReservationModal";
import { toast } from 'react-toastify';


interface Reservation {
	id: number;
	date_start: string;
	date_end: string;
	number_tickets: number;
	user_id: number;
	period_id: number;
}

interface User {
	id: number;
	firstname: string;
	lastname: string;
}

interface Period {
	id: number;
	name: string;
}

interface ReservationFormData {
	id?: number; // optional for creation
	date_start: string; // format "yyyy-MM-dd"
	date_end: string; // format "yyyy-MM-dd"
	number_tickets: number;
	user_id: number;
	period_id: number;
}

const BackOfficeReservations: React.FC = () => {
	// Stores the list of reservations
	const [reservations, setReservations] = useState<Reservation[]>([]);
	// Stores the list of users
	const [users, setUsers] = useState<User[]>([]);
	// Stores the list of periods
	const [periods, setPeriods] = useState<Period[]>([]);
	// Keeps track of the IDs of selected reservations
	const [selectedReservations, setSelectedReservations] = useState<number[]>(
		[],
	);
	// Stores the current search term
	const [searchTerm, setSearchTerm] = useState("");
	// Stores the selected period for filtering
	const [selectedPeriod, setSelectedPeriod] = useState("all");
	// Controls the open/close state of the reservation modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	// Stores the reservation being edited (null if creating a new reservation)
	const [reservationToEdit, setReservationToEdit] =
		useState<Reservation | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			// Defines an asynchronous function to fetch data
			try {
				// Uses Promise.all to make multiple requests in parallel
				const [reservationsData, usersData, periodsData] = await Promise.all([
					getDatas("/bookings"), // Fetch reservations
					getDatas("/users"), // Fetch users
					getDatas("/periods"), // Fetch periods
				]);
				// Updates the states with the fetched data
				setReservations(reservationsData);
				setUsers(usersData);
				setPeriods(periodsData);

				// Logs for debugging
				console.log("Users fetched:", usersData);
				console.log("Reservations fetched:", reservationsData);
			} catch (error) {
				// Error handling in case of data fetch failure
				console.error("Error fetching data", error);
			}
		};
		// Calls the fetchData function
		fetchData();
		// The empty array [] as the second argument means this effect
		// will only run once, when the component is mounted
	}, []);

	const handleSelectionChange = (id: number) => {
		// This function handles the selection or deselection of a reservation
		setSelectedReservations((prev) =>
			// If the ID is already in the list of selected reservations
			prev.includes(id)
				? // Then remove it from the list (deselect)
					prev.filter((reservationId) => reservationId !== id)
				: // Otherwise, add it to the list (select)
					[...prev, id],
		);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// This function handles changes to the search term
		setSearchTerm(e.target.value);
	};

	const filteredReservations = reservations.filter((reservation) => {
		// Find the user and period associated with the reservation
		const user = users.find((user) => user.id === reservation.user_id);
		const period = periods.find(
			(period) => period.id === reservation.period_id,
		);

		// Apply period filters
		const matchesPeriodFilter =
			selectedPeriod === "all" ||
			reservation.period_id.toString() === selectedPeriod;

		// Checks if the search term matches the user's name or the period's name
		const matchesSearchFilter =
			searchTerm === "" ||
			// Search in user's first and last name
			(user &&
				(user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.lastname.toLowerCase().includes(searchTerm.toLowerCase()))) ||
			// Search in the period's name
			period?.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			// Search in dates
			reservation.date_start.includes(searchTerm) ||
			reservation.date_end.includes(searchTerm);

		return matchesPeriodFilter && matchesSearchFilter;
	});

	const handleCreateReservation = async (
		newReservation: ReservationFormData,
	) => {
		// This function handles the creation of a new reservation
		try {
			// Logs the new reservation data to the console (for debugging)
			console.log("Data sent to the server:", newReservation);
			// API call to create the new reservation
			const createdReservation = await createData("/bookings", newReservation);
			// Logs the created reservation to the console (for debugging)
			console.log("Reservation created:", createdReservation);
			// Updates the local reservations state by adding the new reservation
			setReservations((prevReservations) => [
				...prevReservations,
				createdReservation,
			]);
			// Closes the modal after successful creation
			setIsModalOpen(false);
			toast.success("Réservation créée avec succès !");
		} catch (error) {
			// Handles errors that might occur during creation
			console.error("Error creating reservation:", error);
			toast.error("Erreur lors de la création de la réservation. Veuillez réessayer plus tard.");
		}
	};

	const handleEditClick = () => {
		// This function handles the click on the "Edit" button
		// Checks if only one reservation is selected
		if (selectedReservations.length === 1) {
			// Finds the selected reservation in the list of reservations
			const reservationToEdit = reservations.find(
				(reservation) => reservation.id === selectedReservations[0],
			);
			// Logs the selected reservation to the console (for debugging)
			console.log(
				"Reservation selected for editing:",
				reservationToEdit,
			);
			// If a corresponding reservation is found
			if (reservationToEdit) {
				// Updates the state with the reservation to edit
				setReservationToEdit(reservationToEdit);
				// Opens the edit modal
				setIsModalOpen(true);
			}
		}
	};

	const handleUpdateReservation = async (
		updatedReservation: ReservationFormData,
	) => {
		// This function handles the update of an existing reservation
		try {
			// Checks if the reservation to update has an ID
			if (updatedReservation.id) {
				// API call to update the reservation
				const updatedReservationFromServer = await updateData(
					"/bookings",
					updatedReservation.id,
					updatedReservation,
				);
				// Updates the local reservations state
				setReservations((prevReservations) =>
					prevReservations.map((reservation) =>
						// If the ID matches, replace the old reservation with the new one
						reservation.id === updatedReservationFromServer.id
							? updatedReservationFromServer
							: reservation,
					),
				);
				// Closes the modal after successful update
				setIsModalOpen(false);
				toast.success("Réservation modifiée avec succès !");
				// Resets the reservation being edited
				setReservationToEdit(null);
				// Clears the list of selected reservations
				setSelectedReservations([]);
			}
		} catch (error) {
			// Handles errors that might occur during the update
			console.error("Error updating reservation:", error);
			toast.error("Erreur lors de la modification de la réservation. Veuillez réessayer plus tard.");
		}
	};

	const handleDeleteSelectedReservations = async () => {
		// Checks if any reservations are selected for deletion
		if (selectedReservations.length === 0) {
			alert("Please select at least one reservation to delete");
			return;
		}
		// Asks for user confirmation before proceeding with the deletion
		if (
			window.confirm(
				`Are you sure you want to delete ${selectedReservations.length} reservation(s)?`,
			)
		) {
			try {
				// Deletes each selected reservation
				for (const reservationId of selectedReservations) {
					await deleteData("/bookings", reservationId);
				}
				// Updates the local state by filtering out deleted reservations
				setReservations((prevReservations) =>
					prevReservations.filter(
						(reservation) => !selectedReservations.includes(reservation.id),
					),
				);
				// Resets the list of selected reservations
				setSelectedReservations([]);
				toast.success("Réservation supprimée avec succès !");
			} catch (error) {
				// Handles errors that might occur during deletion
				console.error("Error deleting reservations:", error);
				toast.error("Erreur lors de la suppression de la réservation. Veuillez réessayer plus tard.");
			}
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
		<div className="flex h-screen bg-gray-100">
			
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto p-4">
					<h1 className="text-2xl font-bold mb-4">
						Administration des Réservations
					</h1>
					<div className="mb-4 flex space-x-4">
						<input
							type="text"
							placeholder="Rechercher une réservation..."
							className="px-4 py-2 border rounded-md flex-grow focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<select
							className="px-4 py-2 border rounded-md w-1/5 focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value)}
						>
							<option value="all">Toutes les périodes</option>
							{periods.map((period) => (
								<option key={period.id} value={period.id.toString()}>
									{period.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 flex space-x-4 justify-end ">
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={() => {
								setIsModalOpen(true);
								setReservationToEdit(null); // Reset pour nouvelle réservation
							}}
						>
							Créer
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedReservations.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="bg-grey text-white rounded p-2 hover:bg-gray-700"
							onClick={handleDeleteSelectedReservations}
							disabled={selectedReservations.length === 0}
						>
							Supprimer
						</button>
					</div>
					<ReservationModal
						isOpen={isModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setReservationToEdit(null);
						}}
						onSubmit={
							reservationToEdit
								? handleUpdateReservation
								: handleCreateReservation
						}
						periods={periods}
						users={users}
						reservation={reservationToEdit}
						reservations={reservations}
					/>
					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Date de début
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Date de fin
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Nombre de tickets
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Utilisateur
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Période
									</th>
									<th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
										Sélection
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredReservations.map((reservation) => {
									const user = users.find(
										(user) => user.id === reservation.user_id,
									);
									const period = periods.find(
										(period) => period.id === reservation.period_id,
									);
									return (
										<tr key={reservation.id}>
											<td className="text-center">{reservation.id}</td>
											<td className="text-center">
												{new Date(reservation.date_start).toLocaleDateString()}
											</td>
											<td className="text-center">
												{new Date(reservation.date_end).toLocaleDateString()}
											</td>
											<td className="text-center">
												{reservation.number_tickets}
											</td>
											<td className="text-center">
												{user?.firstname} {user?.lastname}
											</td>
											<td className="text-center">{period?.name}</td>
											<td className="text-center px-6 py-4 whitespace-nowrap">
												<input
													type="checkbox"
													checked={selectedReservations.includes(
														reservation.id,
													)}
													onChange={() => handleSelectionChange(reservation.id)}
													className="h-4 w-4 text-red-primary focus:ring-red-secondary border-gray-300 rounded"
												/>
											</td>
										</tr>
									);
								})}
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

export default BackOfficeReservations;
