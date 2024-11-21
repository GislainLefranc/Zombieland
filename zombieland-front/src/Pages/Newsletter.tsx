const Newsletter = () => {
	return (
		<div className="relative text-white px-10 py-4 mt-11 text-center lg:mx-52">
			<div className="absolute inset-0 bg-[url('./assets/img/mains-zombie.webp')] bg-cover bg-bottom rounded-md" />
			<div className="relative p-7 rounded-md bg-grey/70">
				<div className="pb-6 text-left">
					<h2 className="text-2xl font-bold text-center pb-6">
						Vivez l'effroi comme jamais avec ZombieLand !
					</h2>
					<p className="font-semibold text-xl text-center pb-2">
						Chers fans de sensations fortes,
					</p>
					<p>
						Bienvenue dans le monde terrifiant de ZombieLand, le parc
						d’attractions qui vous plonge au cœur d'une invasion zombie ! Voici
						les dernières nouvelles pour une expérience toujours plus intense et
						immersive.
					</p>
				</div>
				<div className="pb-6 text-left">
					<h3 className="text-xl font-bold text-center pb-2">
						🎃 Événement spécial : La Nuit des Zombies
					</h3>
					<p>
						Ne manquez pas notre soirée exclusive
						<strong>La Nuit des Zombies</strong> ! Une expérience immersive où
						les zombies prennent le contrôle du parc pour une nuit inoubliable.
						Plongé dans l’obscurité, frayez-vous un chemin entre les créatures
						assoiffées de chair humaine… Oserez-vous relever le défi ?
					</p>
					<p>🗓️ Date : 01/11/2024</p>
					<p>📍 Lieu : ZombieLand</p>
					<p>🎟️ Réservation obligatoire – Places limitées !</p>
				</div>
				<div className="pb-6 text-left">
					<h3 className="text-xl font-bold text-center pb-2">
						🧟‍♂️ Nouvelle attraction : Le Cimetière Maudit
					</h3>
					<p>
						Découvrez notre nouvelle attraction{" "}
						<strong>Le Cimetière Maudit</strong>. Oserez-vous pénétrer dans ce
						lieu hanté où chaque tombe pourrait révéler un nouveau danger ?
						Préparez-vous à un parcours rempli de frissons et de mystères…
					</p>
					<p>
						🎫 Disponible dès maintenant ! Réservez vos billets pour une
						aventure inédite.
					</p>
				</div>
				<div className="pb-6 text-left">
					<h3 className="text-xl font-bold text-center pb-2">
						🎟️ Offres spéciales pour nos abonnés
					</h3>
					<p>
						Pour remercier nos abonnés les plus courageux, nous avons le plaisir
						de vous offrir <strong>10% de réduction</strong> sur les billets
						d’entrée avec le code promo <strong>ZOMBIE10</strong>.
					</p>
					<p>📅 Valable jusqu’au 31/12/2024</p>
				</div>
				<div className="pb-6 text-left">
					<h3 className="text-xl font-bold text-center pb-2">
						🖤 Rejoignez la communauté ZombieLand
					</h3>
					<p>
						Rejoignez-nous sur nos réseaux sociaux pour des contenus exclusifs,
						des concours et les dernières nouvelles de ZombieLand. Vous pourrez
						également partager vos photos et vidéos de votre expérience dans
						notre univers effrayant !
					</p>
				</div>
			</div>
		</div>
	);
};

export default Newsletter;
