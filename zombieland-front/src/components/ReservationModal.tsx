import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ReservationFormData {
	id?: number;
	date_start: string;
	date_end: string;
	number_tickets: number;
	user_id: number;
	period_id: number;
}

interface Reservation extends ReservationFormData {
	id: number;
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

interface Reservations {
	id?: number; // id optionnel pour la création
	date_start: string;
	date_end: string;
	number_tickets: number;
	user_id: number;
	period_id: number;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (
		reservation: ReservationFormData | Reservation,
	) => void | Promise<void>;
	periods: Period[];
	users: User[];
	reservation?: Reservation | null;
	reservations: Reservations[];
}

const ReservationModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	periods,
	users,
	reservation,
}) => {
	const [formData, setFormData] = useState<ReservationFormData>({
		date_start: "",
		date_end: "",
		number_tickets: 1,
		user_id: 0,
		period_id: 0,
	});

	useEffect(() => {
		console.log("Reservation passée à ReservationModal:", reservation);
		if (reservation) {
			setFormData({
				date_start: reservation.date_start,
				date_end: reservation.date_end,
				number_tickets: reservation.number_tickets,
				user_id: reservation.user_id,
				period_id: reservation.period_id,
			});
		} else {
			setFormData({
				date_start: "",
				date_end: "",
				number_tickets: 0,
				user_id: 0,
				period_id: 0,
			});
		}
	}, [reservation]);

	console.log(formData);
	useEffect(() => {
		if (reservation) {
			setFormData({
				date_start: reservation.date_start.slice(0, 10), // Format "yyyy-MM-dd"
				date_end: reservation.date_end.slice(0, 10), // Format "yyyy-MM-dd"
				number_tickets: reservation.number_tickets,
				user_id: reservation.user_id,
				period_id: reservation.period_id,
			});
		} else {
			setFormData({
				date_start: "",
				date_end: "",
				number_tickets: 1,
				user_id: 0,
				period_id: 0,
			});
		}
	}, [reservation]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "number_tickets" || name === "user_id" || name === "period_id"
					? Number(value)
					: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formattedData = {
			...formData,
			date_start: new Date(formData.date_start).toISOString().slice(0, 10),
			date_end: new Date(formData.date_end).toISOString().slice(0, 10),
		};

		console.log("Soumission du formulaire dans Modal", formattedData);

		if (reservation) {
			onSubmit({ ...formattedData, id: reservation.id });
		} else {
			onSubmit(formattedData);
		}

		onClose();
	};

	const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
			onClick={handleBackgroundClick}
			onKeyDown={handleKeyDown}
			aria-modal="true"
			tabIndex={-1}
		>
			<div
				className="bg-white rounded-lg p-6 w-full max-w-md"
				onClick={(e) => e.stopPropagation()}
				onKeyUp={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">
						{reservation
							? "Modifier une réservation"
							: "Créer une nouvelle réservation"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						aria-label="Fermer"
					>
						<FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="date_start"
							className="block text-sm font-medium text-gray-700"
						>
							Date de début
						</label>
						<input
							type="date"
							id="date_start"
							name="date_start"
							value={formData.date_start}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
						/>
					</div>

					<div>
						<label
							htmlFor="date_end"
							className="block text-sm font-medium text-gray-700"
						>
							Date de fin
						</label>
						<input
							type="date"
							id="date_end"
							name="date_end"
							value={formData.date_end}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
						/>
					</div>

					<div>
						<label
							htmlFor="number_tickets"
							className="block text-sm font-medium text-gray-700"
						>
							Nombre de tickets
						</label>
						<input
							type="number"
							id="number_tickets"
							name="number_tickets"
							value={formData.number_tickets}
							onChange={handleChange}
							required
							min={1}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
						/>
					</div>

					<div>
						<label
							htmlFor="user_id"
							className="block text-sm font-medium text-gray-700"
						>
							Utilisateur
						</label>
						<select
							id="user_id"
							name="user_id"
							value={formData.user_id}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
						>
							<option value="">Sélectionner un utilisateur</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.firstname} {user.lastname}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="period_id"
							className="block text-sm font-medium text-gray-700"
						>
							Période
						</label>
						<select
							id="period_id"
							name="period_id"
							value={formData.period_id}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
						>
							<option value="">Sélectionner une période</option>
							{periods.map((period) => (
								<option key={period.id} value={period.id}>
									{period.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end space-x-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
						>
							Annuler
						</button>
						<button
							type="submit"
							className="px-3 py-2 bg-red-primary text-white rounded hover:bg-red-secondary"
						>
							Valider
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ReservationModal;
