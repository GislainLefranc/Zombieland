import Image403 from "../assets/img/Zombie403.webp";
import { RedLink } from "../components/RedLink";

const Error403 = () => {
  return (
    <>
      <main className="bg-cover bg-no-repeat object-center h-4/5 relative">
        <img src={Image403} alt="Accès refusé : Zombie" className="w-full" />
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

export default Error403;
