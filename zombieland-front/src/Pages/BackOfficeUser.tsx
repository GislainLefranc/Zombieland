import { useEffect, useState } from "react";
import { getDatas, createData, updateData, deleteData } from "../services/api";
import Aside from "../components/Aside";
import UserModal from "../components/UserModal";
import { toast } from 'react-toastify';

interface User {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role_id: number;
}

interface Role {
	id: number;
	name: string;
}

interface UserFormData {
	id?: number;
	firstname: string;
	lastname: string;
	password: string;
	email: string;
	role_id: number;
}

const BackOfficeUser: React.FC = () => {
	// List of users fetched from the API
	const [users, setUsers] = useState<User[]>([]);
	// List of users selected via checkboxes
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

	// Search filter for users by first name or last name
	const [searchTerm, setSearchTerm] = useState("");
	// Search filter for users by role
	const [searchRole, setSearchRole] = useState("all");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// List of users to display, filtered by search terms and role filters
	const usersToDisplay = users.filter((user) => {
		// 1. Check if the user matches the search term filter
		// (true if no search filter is currently applied)
		let matchesSearchTerm = true;
		if (searchTerm !== "") {
			matchesSearchTerm =
				user.firstname.toLowerCase().includes(searchTerm) ||
				user.lastname.toLowerCase().includes(searchTerm);
		}

		// 2. Check if the user matches the role filter
		// (true if the current filter is set to "all roles")
		let matchesSearchRole = true;
		if (searchRole !== "all") {
			matchesSearchRole = user.role_id === Number.parseInt(searchRole);
		}

		// 3. Return true if the user matches all applied filters
		return matchesSearchTerm && matchesSearchRole;
	});

	useEffect(() => {
		// Fetches the list of users from the API
		const fetchData = async () => {
			try {
				const users = await getDatas("/users");
				setUsers(users);
			} catch (error) {
				console.error("Error while fetching user data", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		// Fetches the list of roles from the API
		const fetchRoles = async () => {
			try {
				const rolesData = await getDatas("/roles");
				setRoles(rolesData);
			} catch (error) {
				console.error("Error while fetching role data", error);
			}
		};
		fetchRoles();
	}, []);

	// Handles the selection and deselection of users via checkboxes
	const handleSelectionChange = (id: number) => {
		setSelectedUsers((prev) =>
			prev.includes(id)
				? prev.filter((userID) => userID !== id)
				: [...prev, id],
		);
	};

	/**
	 * Updates the search filter by first name or last name
	 * @param {Event} event The event triggered by the search input
	 */
	const handleSearch = (event: React.UIEvent<HTMLInputElement>) => {
		// 1. Read the current value in the input field
		const value = (event.target as HTMLInputElement).value.toLowerCase();

		// 2. Update the state with the new search term
		setSearchTerm(value);
	};

	/**
	 * Updates the search filter by role
	 * @param {Event} event The event triggered by the select dropdown
	 */
	const handleRoleSearch = (event: React.UIEvent<HTMLSelectElement>) => {
		// 1. Read the current selected value from the dropdown
		const roleId = (event.target as HTMLInputElement).value;

		// 2. Update the state with the new role filter
		setSearchRole(roleId);
	};

	// Show a message if no users are available
	if (users.length === 0) {
		return (
			<p className="text-center text-white">
				No users available at the moment.
			</p>
		);
	}

	// Handles creating a new user
	const handleCreateUser = async (newUser: UserFormData) => {
		try {
			console.log("Data sent to the server:", newUser);
			const createdUser = await createData("/users", newUser);
			console.log("User created:", createdUser);
			// Add the newly created user to the current list of users
			setUsers([...users, createdUser]);
			setIsModalOpen(false);
			toast.success("Utilisateur créé avec succès !");
		} catch (error) {
			console.error("Error while creating user:", error);
			toast.error("Erreur lors de la création de l'utilisateur. Veuillez réessayer plus tard.");

		}
	};

	// Opens the edit modal for a selected user
	const handleEditClick = () => {
		if (selectedUsers.length === 1) {
			const userToEdit = users.find((user) => user.id === selectedUsers[0]);
			if (userToEdit) {
				setUserToEdit(userToEdit);
				setIsEditModalOpen(true);
			}
		}
	};

	// Handles updating an existing user
	const handleUpdateUser = async (updatedUser: UserFormData) => {
		try {
			if ("id" in updatedUser && typeof updatedUser.id === "number") {
				const updatedUserFromServer = await updateData(
					"/users",
					updatedUser.id,
					updatedUser,
				);
				console.log("Updated user received from the server:", updatedUserFromServer);

				// Find the index of the user to update
				const userIndex = users.findIndex(
					(user) => user.id === updatedUserFromServer.id,
				);
				// Update the user in the list
				const updatedUsers = [
					...users.slice(0, userIndex),
					updatedUserFromServer,
					...users.slice(userIndex + 1),
				];

				setUsers(updatedUsers);
				const refreshedUsers = await getDatas("/users");
				setUsers(refreshedUsers);
				setIsEditModalOpen(false);
				toast.success("Utilisateur modifié avec succès !");
				setUserToEdit(null);
				setSelectedUsers([]);
			} else {
				console.error("The user to update has no valid ID.");
			}
		} catch (error) {
			console.error("Error while updating user", error);
			toast.error("Erreur lors de la modification de l'utilisateur. Veuillez réessayer plus tard.");
		}
	};

	// Handles deleting selected users
	const handleDeleteSelectedUser = async () => {
		if (selectedUsers.length === 0) {
			alert("Please select at least one user to delete");
			return;
		}
		const confirmDelete = window.confirm(
			`Are you sure you want to delete ${selectedUsers.length} user(s)?`,
		);
		if (!confirmDelete) return;

		try {
			setIsLoading(true);
			for (const userId of selectedUsers) {
				await deleteData("/users", userId);
			}
			// Remove deleted users from the state
			setUsers((prevUsers) =>
				prevUsers.filter((user) => !selectedUsers.includes(user.id)),
			);
			setSelectedUsers([]);
			toast.success("Utilisateur supprimé avec succès !");
			setIsLoading(false);
		} catch (error) {
			console.error("Error while deleting users:", error);
			toast.error("Erreur lors de la suppression de l'utilisateur. Veuillez réessayer plus tard.")
		}
	};

	// Component to display a message for small screens
	const SmallScreenMessage = () => (
		<div className="flex items-center justify-center h-screen bg-gray-100 p-4">
			<p className="text-center text-xl font-semibold">
				This page is only available on larger screens. Please use a bigger display to access this content.
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
				<div className="container p-4 mx-auto">
					<h1 className="mb-4 text-2xl font-bold">
						Administration des Utilisateurs
					</h1>

					<div className="flex mb-4 space-x-4">
						<input
							type="search"
							placeholder="Rechercher un utilisateur..."
							className="flex-grow px-4 py-2 border rounded-md focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							onInput={handleSearch}
						/>
						<select
							className="w-1/5 px-4 py-2 border rounded-md focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							onInput={handleRoleSearch}
						>
							<option value="all">Tous les rôles</option>
							{roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end mb-4 space-x-4 ">
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={() => setIsModalOpen(true)}
						>
							Créer
						</button>
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={handleEditClick}
							disabled={selectedUsers.length !== 1}
						>
							Modifier
						</button>
						<button
							type="button"
							className="p-2 text-white rounded bg-grey hover:bg-gray-700"
							onClick={handleDeleteSelectedUser}
							disabled={selectedUsers.length === 0 || isLoading}
						>
							{isLoading ? "Suppression..." : "Supprimer"}
						</button>
					</div>
					<UserModal
						isOpen={isModalOpen || isEditModalOpen}
						onClose={() => {
							setIsModalOpen(false);
							setIsEditModalOpen(false);
							setUserToEdit(null);
						}}
						onSubmit={userToEdit ? handleUpdateUser : handleCreateUser}
						user={userToEdit}
						role={roles}
					/>
					<div className="overflow-hidden bg-white rounded-lg shadow-md">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-grey">
								<tr>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										ID
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Nom
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Prénom
									</th>
									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Email
									</th>

									<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase">
										Rôle
									</th>
									<th className="px-6 py-3" />
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200 ">
								{usersToDisplay.map((user) => (
									<tr key={user.id}>
										{/* ID de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">{user.id}</td>

										{/* Nom de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap">
											{user.lastname}
										</td>

										{/* Prénom de l'utilisateur */}
										<td className="px-6 py-4">{user.firstname}</td>

										{/* Email de l'utilisateur */}
										<td className="px-6 py-4">{user.email}</td>

										{/* Rôle de l'utilisateur */}
										<td className="px-6 py-4 whitespace-nowrap ">
											{roles.find((role) => role.id === user.role_id)?.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{/* Checkbox pour modifier ou supprimer un utilisateur */}
											<input
												type="checkbox"
												checked={selectedUsers.includes(user.id)}
												onChange={() => handleSelectionChange(user.id)}
												className="w-4 h-4 border-gray-300 rounded text-red-primary focus:ring-red-primary"
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

export default BackOfficeUser;
