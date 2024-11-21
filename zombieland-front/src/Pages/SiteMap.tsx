import { Link } from "react-router-dom";

const SiteMap = () => {
	return (
		<div className="text-white bg-grey/70 p-7 rounded-md flex flex-col  mt-9 lg:mx-52">
			<div className="text-center">
				<h2 className="font-bold uppercase">Accueil</h2>
				<Link
					to={"/bookings"}
					className="transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md px-3 py-2 ${textSize} font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:text-red-primary focus:text-red-primary"
				>
					Réservation
				</Link>
				<Link
					to={"/login"}
					className="transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md px-3 py-2 ${textSize} font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:text-red-primary focus:text-red-primary"
				>
					Connexion
				</Link>
				<Link
					to={"/register"}
					className="transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md px-3 py-2 ${textSize} font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:text-red-primary focus:text-red-primary"
				>
					Inscription
				</Link>
			</div>
			<div className="text-center">
				<h2 className="font-bold uppercase">Nos activités</h2>
				<Link
					to={"/activities"}
					className="transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md px-3 py-2 ${textSize} font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:text-red-primary focus:text-red-primary"
				>
					Toutes les activités
				</Link>
				<Link
					to={"/activity"}
					className="transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md px-3 py-2 ${textSize} font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:text-red-primary focus:text-red-primary"
				>
					Détail d'une activité
				</Link>
			</div>
		</div>
	);
};

export default SiteMap;
