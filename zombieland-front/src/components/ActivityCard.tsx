import { Link } from "react-router-dom";

export interface CardProps {
	multimedias: { url: string }[];
	category_id: number;
	id: number;
	backgroundImage: string;
	title: string;
	description: string;
	buttonText: string;
	to: string;
	category: { id: number; name: string } | null;
	imageHeight?: string; // New prop for custom height
  }
  

  export const Card = ({
	id,
	backgroundImage,
	title,
	description,
	buttonText,
	to,
	category,
	imageHeight = "40rem", // Default height if not specified
  }: CardProps): JSX.Element => {
	return (
		<div
			className="bg-center bg-no-repeat bg-cover h-[40rem] w-full flex flex-col justify-around"
			style={{ backgroundImage: `url(${backgroundImage})`,
			height: imageHeight  }}
		>
			<div className="h-5 p-4 flex-grow-0">
				<h2 className="inline-block bg-black bg-opacity-70 text-white px-3 py-1 text-sm font-bold rounded mb-2.5">
					{title}
				</h2>

				{/* Afficher le nom de la catégorie si elle existe */}
				{category ? (
					<div>
						<span className="inline-block bg-black bg-opacity-70 text-white px-3 py-1 text-sm font-bold rounded">
							{category.name}
						</span>{" "}
						{/* Affiche le nom de la catégorie */}
					</div>
				) : (
					<div className="mt-2 text-gray-400">
						<span>Non catégorisé</span>{" "}
						{/* Affiche "Non catégorisé" si la catégorie est null */}
					</div>
				)}
			</div>

			<div className="flex-grow flex items-center justify-center pt-28">
				<div className="w-3/4 bg-black bg-opacity-70 p-4 rounded">
					<p className="text-white text-center">{description}</p>
				</div>
			</div>

			<div className="p-4 flex justify-end">
				<Link
					to={to}
					state={{
						activity: { id, title, description, backgroundImage, category },
					}}
					className="transform transition-transform duration-400 hover:scale-110 inline-flex items-center rounded-md bg-red-primary px-3 py-2 font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
				>
					{buttonText}
				</Link>
			</div>
		</div>
	);
};
