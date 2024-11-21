import Image404 from "../assets/img/Zombie404.webp";
import { RedLink } from "../components/RedLink";

const Error404 = () => {
	return (
		<>
			<main className="bg-cover bg-no-repeat object-center h-4/5 relative">
				<img src={Image404} alt="Zombies en perditions" className="w-full" />
				<RedLink
					textSize="text-xl"
					to="/"
					position="absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
				>
					Revenir à l'accueil
				</RedLink>
			</main>
		</>
	);
};

export default Error404;
