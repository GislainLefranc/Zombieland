import React, { useState, KeyboardEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface ActivityFormData {
	title: string;
	description: string;
	category_id: number;
	image: string;
}

interface Activity extends ActivityFormData {
	id: number;
}

interface Category {
	id: number;
	name: string;
}

//interface Activity extends ActivityFormData {
	//id: number;
	
//}

interface Category {
	id: number;
	name: string;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (activity: ActivityFormData | Activity) => void | Promise<void>;
	categories: Category[];
	activity?: Activity | null;
}

const ActivitiesModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	categories,
	activity,
}) => {
	const [formData, setFormData] = useState<ActivityFormData>({
		title: "",
		description: "",
		category_id: 0,
		image: "",
	});

	useEffect(() => {
		console.log("Activité transmise pour l'édition :", activity);

		if (activity) {
			setFormData({
				title: activity.title,
				description: activity.description,
				category_id: activity.category_id,
				image: activity.image,
			});
		} else {
			setFormData({
				title: "",
				description: "",
				category_id: 0,
				image: "",
			});
		}
	}, [activity]);

	const updateImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
		// On récupère le fichier que l'utilisateur vient de renseigner dans l'input
		const files = evt.target.files;
		if (!files) return;
		const file = files[0]; // File
		if (!file) return;

		// On convertit le fichier en data-url
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			setFormData((prevFormData) => ({
				...prevFormData,
				image: reader.result as string, // Met uniquement à jour l'image sans toucher aux autres valeurs
			}));
		});
		reader.readAsDataURL(file);
	};
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		console.log(`handleChange - Champ : ${name}, Valeur : ${value}`);
		setFormData((prev) => ({
			...prev,
			[name]: name === "category_id" ? Number(value) : value,
		}));
		console.log("formData après handleChange :", formData);
	};

	useEffect(() => {
		console.log("formData mis à jour après handleChange :", formData); // Vérifie le changement
	}, [formData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Soumission du formulaire dans Modal", formData);
		if (activity) {
			onSubmit({ ...formData, id: activity.id });
		} else {
			onSubmit(formData);
		}
		onClose();
	};

	const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	if (!isOpen) {
		return null;
	}

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
						{activity ? "Modifier une activité" : "Créer une nouvelle activité"}
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
							htmlFor="title"
							className="block text-sm font-medium text-gray-700"
						>
							Nom
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="category_id"
							className="block text-sm font-medium text-gray-700"
						>
							Catégorie
						</label>
						<select
							id="category_id"
							name="category_id"
							value={formData.category_id}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-grey focus:ring focus:ring-grey focus:ring-opacity-20"
							required
						>
							<option value="">Sélectionnez une catégorie</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className="col-span-full">
						<label
							htmlFor="cover-photo"
							className="block text-sm/6 font-medium text-gray-900"
						>
							Image de couverture
						</label>
						<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
							<div className="text-center">
								<PhotoIcon
									aria-hidden="true"
									className="mx-auto h-12 w-12 text-gray-300"
								/>
								<div className="mt-4 flex text-sm/6 text-gray-600">
									<label
										htmlFor="file-upload"
										className="relative cursor-pointer rounded-md bg-white font-semibold text-red-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-red-secondary"
									>
										<span>Télécharger un fichier</span>
										<input
											id="file-upload"
											name="file-upload"
											type="file"
											className="sr-only"
											onInput={updateImage}
										/>
									</label>
									<p className="pl-1">or drag and drop</p>
								</div>
								<p className="text-xs/5 text-gray-600">
									PNG, JPG, GIF up to 10MB
								</p>
							</div>
						</div>
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
							className="px-4 py-2 bg-red-primary text-white rounded hover:bg-red-secondary"
						>
							{activity ? "Modifier" : "Créer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);

};

export default ActivitiesModal;