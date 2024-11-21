// Dossier: src/components/Carousel.tsx
import React, { useState, useEffect, useRef } from "react";
import { CardProps } from "./ActivityCard";
import { Card } from "./ActivityCard";

// Props type for Carousel (Type des props pour Carousel)
export interface CarouselProps {
	items: CardProps[];
	carouselButtonText: string;
}

// Carousel component (Composant Carousel)
export const Carousel: React.FC<CarouselProps> = ({
	items,
	carouselButtonText,
}) => {
	const [displayItems, setDisplayItems] = useState([
		...items,
		...items,
		...items,
	]); // Items to display (Éléments à afficher)
	const [cardsToShow, setCardsToShow] = useState(3); // Number of cards to show (Nombre de cartes à afficher)
	const [isTransitioning, setIsTransitioning] = useState(false); // Transition state (État de transition)
	const carouselRef = useRef<HTMLDivElement>(null); // Carousel reference (Référence du carrousel)

	// Update displayed items whenever `items` changes (Mettre à jour les éléments affichés chaque fois que `items` change)
	useEffect(() => {
		setDisplayItems([...items, ...items, ...items]);
	}, [items]);

	// Set cards to show based on screen size (Définit les cartes à afficher selon l'écran)
	useEffect(() => {
		const updateCardsToShow = () => {
			if (window.innerWidth < 768) setCardsToShow(1);
			else if (window.innerWidth < 1024) setCardsToShow(2);
			else setCardsToShow(3);
		};
		updateCardsToShow(); // Initial update (Mise à jour initiale)
		window.addEventListener("resize", updateCardsToShow); // Update on resize (Mettre à jour au redimensionnement)
		return () => window.removeEventListener("resize", updateCardsToShow); // Cleanup (Nettoyage)
	}, []);

	// Move to the next slide (Passer à la diapositive suivante)
	const nextSlide = () => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		if (carouselRef.current) {
			carouselRef.current.style.transition = "transform 0.5s ease-in-out";
			carouselRef.current.style.transform = `translateX(-${100 / cardsToShow}%)`;
		}

		setTimeout(() => {
			setIsTransitioning(false);
			setDisplayItems((prevItems) => {
				const updatedItems = [...prevItems];
				const firstItem = updatedItems.shift(); // Remove first item (Retirer le premier élément)
				if (firstItem) updatedItems.push(firstItem); // Add to end (Ajouter à la fin)
				if (carouselRef.current) {
					carouselRef.current.style.transition = "none";
					carouselRef.current.style.transform = "translateX(0)";
				}
				return updatedItems;
			});
		}, 500);
	};

	// Move to the previous slide (Passer à la diapositive précédente)
	const prevSlide = () => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		if (carouselRef.current) {
			carouselRef.current.style.transition = "none";
			carouselRef.current.style.transform = `translateX(-${100 / cardsToShow}%)`;
		}

		setDisplayItems((prevItems) => {
			const updatedItems = [...prevItems];
			const lastItem = updatedItems.pop(); // Remove last item (Retirer le dernier élément)
			if (lastItem) updatedItems.unshift(lastItem); // Add to start (Ajouter au début)
			return updatedItems;
		});

		setTimeout(() => {
			if (carouselRef.current) {
				carouselRef.current.style.transition = "transform 0.5s ease-in-out";
				carouselRef.current.style.transform = "translateX(0)";
			}
			setTimeout(() => setIsTransitioning(false), 500);
		}, 50);
	};

	return (
		<div className="flex justify-center items-center relative">
			<div className="relative w-4/5 overflow-hidden">
				<div ref={carouselRef} className="flex">
					{displayItems.map((item, index) => {
						const middleIndex = Math.floor(cardsToShow / 2); // Middle card index (Index de la carte du milieu)
						return (
							<div
								key={`${item.title}-${index}`} // Unique key for each card (Clé unique pour chaque carte)
								className={`flex-shrink-0 px-2 py-4 transition-transform duration-500 ease-in-out ${
									index === middleIndex
										? "scale-103 z-10 shadow-md"
										: "scale-95 opacity-85"
								}`} // Style for card focus (Style pour la carte centrale)
								style={{ width: `${100 / cardsToShow}%` }} // Set card width (Définir la largeur)
							>
								<div className="h-full flex justify-center items-center overflow-hidden">
									<Card
										{...item}
										buttonText={carouselButtonText}
										to="/activity"
									/>{" "}
									{/* Render card (Rendu de la carte) */}
								</div>
							</div>
						);
					})}
				</div>
				{/* Buttons always visible, even in mobile */}
				<button
					type="button"
					onClick={prevSlide}
					className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-[#7B0002] text-white p-2 rounded-full transition hover:bg-opacity-90 focus:outline-none active:bg-[#3E0A16] z-20"
					aria-label="Previous"
				>
					&lsaquo;
				</button>
				<button
					type="button"
					onClick={nextSlide}
					className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-[#7B0002] text-white p-2 rounded-full transition hover:bg-opacity-90 focus:outline-none active:bg-[#3E0A16] z-20"
					aria-label="Next"
				>
					&rsaquo;
				</button>
			</div>
		</div>
	);
};

export default Carousel;
