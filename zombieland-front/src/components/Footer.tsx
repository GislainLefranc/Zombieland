// Ghostbusters_Project_DWWM_Frontend/Footer.js
import { SVGProps, useEffect, useState } from "react";
import axios from "axios";

// Interface for defining the structure of a footer item (Interface pour définir la structure d'un élément de footer)
interface FooterItem {
  name: string;
  href: string;
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

// Interface pour définir la structure principale du footer (Interface for defining the main structure of the footer)
interface Footer {
  main: FooterItem[];
  social: FooterItem[];
}

// Content of the footer with navigation and social links (Contenu du footer avec les liens de navigation et les liens vers les réseaux sociaux)
const footer: Footer = {
  main: [
    { name: "Accueil", href: "/" },
    { name: "Nos activités", href: "/activities" },
    { name: "Réservations", href: "/bookings" },
    { name: "À propos", href: "/informations-utiles#aboutus" },
    { name: "Plan du site", href: "/informations-utiles#sitemap" },
    { name: "Mentions légales", href: "/informations-utiles#legal-notices" },
    { name: "CGV", href: "/informations-utiles#cgv" },
    { name: "Newsletter", href: "/informations-utiles#newsletter" },
    { name: "Glossaire", href: "/informations-utiles#glossary" },
    { name: "Support", href: "/informations-utiles#support" },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <title>Facebook</title>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <title>Instagram</title>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <title>X</title>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
  ],
};

const Footer = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
      }
    };

    fetchReviews();

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 300000); // Change every 5 minutes (300,000 ms)

    return () => clearInterval(interval);
  }, [reviews]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-red-primary my-0">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4 sm:py-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* Left Empty Space */}
          <div className="flex-1" />

          {/* Logo in the center */}
          <div className="flex-1 flex justify-center">
            <img
              className="h-20 w-auto"
              src="src/assets/img/logo.webp"
              alt="Logo"
            />
          </div>

          {/* Reviews on the right */}
          <div className="flex-1 text-white flex flex-col items-center justify-center mt-4 md:mt-0 animate-scroll transition-opacity duration-1000 ease-in-out">
            {reviews.length > 0 ? (
              <div className="text-center">
                <p className="font-bold text-lg text-yellow-400">
                  {"★".repeat(reviews[currentReview]?.note || 0)}
                </p>
                <p>{reviews[currentReview]?.comment}</p>
                <small>
                  {reviews[currentReview]?.user?.name} -{" "}
                  {new Date(reviews[currentReview]?.createdAt).toLocaleDateString()}
                </small>
              </div>
            ) : (
              <p>Aucun avis disponible pour le moment.</p>
            )}
            <small className="italic text-gray-400">
              Pour écrire un avis, rendez-vous dans votre profil.
            </small>
          </div>
        </div>

        {/* Section title */}
        <div className="flex items-center mt-5">
          <div className="flex-grow border-t border-white" />
          <p className="mx-4 text-center text-lg text-white uppercase font-semibold">
            Retrouvez-nous
          </p>
          <div className="flex-grow border-t border-white" />
        </div>

        {/* Social media icons */}
        <div className="mt-5 mb-5 flex justify-center gap-x-10">
          {footer.social.map((item) =>
            item.icon ? (
              <a
                key={item.name}
                href={item.href}
                className="transform transition-transform duration-200 hover:scale-150 text-dark"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="h-9 w-9" />
              </a>
            ) : null
          )}
        </div>

        {/* Footer navigation links */}
        <nav
          aria-label="Footer"
          className="footer-link -mb-6 flex max-md:flex-col max-md:items-center flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6 uppercase font-semibold"
        >
          {footer.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={scrollToTop}
              className="text-white"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <p className="mt-10 mb-2 text-center text-sm/6 text-gray-300">
          Parc ouvert du mercredi au dimanche, de 10h à 18h
        </p>
        <p className="mb-5 text-center text-sm/6 text-gray-300">
          Copyright &copy; 2024 ZombieLand - Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
