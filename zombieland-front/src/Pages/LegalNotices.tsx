const LegalNotices = () => {
	return (
		<div className="lg:mx-52">
			<div className="text-white">
				<div className="px-10 py-4 mt-11 text-lg font-semibold rounded-md text-white bg-grey/70 text-center">
					<p>SAS ZOMBIELAND</p>
					<p>268 Rue du Badoule</p>
					<p>62126 Le Trou D'enfer</p>
					<p>03 . 02 . 45 . 75 . 68</p>
					<p>email : contact@zombieland.com</p>
					<p>Siret : 6516615611641616</p>
					<p>Directeur de la publication : John Doe</p>
				</div>
				<div className="bg-grey/70 text-lg rounded-md  mt-11 px-10 py-4 text-left">
					<div className="pb-6">
						<h3 className="font-bold text-xl">Hébergeur du site</h3>
						<p>Le site Zombieland est hébergé par :</p>
						<p>Nom de l'hébergeur : Docker</p>
						<p>Adresse de l'hébergeur : 15 Rue Boulevard Lafayette</p>
						<p>Numéro de téléphone de l’hébergeur : 04 . 73 . 15 . 57 . 96</p>
					</div>
					<div className="pb-6">
						<h3 className="font-bold text-xl">Propriété intellectuelle</h3>
						<p>
							Le contenu du site ZombieLand (textes, images, vidéos, logos,
							graphismes, etc.) est protégé par le droit d’auteur et les lois
							relatives à la propriété intellectuelle. Toute reproduction,
							distribution, modification ou utilisation sans autorisation
							préalable écrite de ZombieLand est interdite.
						</p>
					</div>
					<div className="pb-6">
						<h3 className="font-bold text-xl">Données personnelles</h3>
						<p>
							<strong>ZombieLand</strong> s’engage à respecter la
							confidentialité des informations personnelles fournies par les
							visiteurs de son site internet. Les données collectées sont
							traitées dans le respect de la réglementation en vigueur,
							notamment le Règlement Général sur la Protection des Données
							(RGPD).
						</p>
						<p>
							<strong>Responsable du traitement :</strong> SAS ZombieLand{" "}
						</p>
						<p>
							<strong>Finalité du traitement :</strong> Les informations
							collectées via le formulaire de contact ou lors de l'achat de
							billets sont utilisées pour la gestion des réservations, l'envoi
							de confirmations, et la communication d’informations sur le parc.
						</p>
						<p>
							<strong>Droits des utilisateurs :</strong> Conformément au RGPD,
							vous avez le droit d'accéder à vos données personnelles, de les
							rectifier, de demander leur suppression ou de limiter leur
							traitement. Vous pouvez également retirer votre consentement à
							tout moment.
						</p>
						<p>
							<strong>
								Pour toute demande concernant vos données personnelles, veuillez
								contacter :
							</strong>{" "}
							contact@zombieland.com
						</p>
					</div>
					<div className="pb-6">
						<h3 className="font-bold text-xl">Cookies</h3>
						<p>
							Le site <strong>ZombieLand</strong> utilise des cookies pour
							améliorer l’expérience utilisateur et à des fins de statistiques.
							Vous pouvez gérer les cookies via les paramètres de votre
							navigateur.
						</p>
					</div>
					<div className="pb-6">
						<h3 className="font-bold text-xl">Responsabilité</h3>
						<p>
							<strong>ZombieLand</strong> décline toute responsabilité en cas
							d’interruption du site, de bugs ou d’erreurs pouvant survenir. Le
							site peut inclure des liens vers d’autres sites dont ZombieLand ne
							contrôle pas le contenu. Par conséquent, ZombieLand décline toute
							responsabilité quant aux informations diffusées sur ces sites
							tiers.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-xl">Droit applicable</h3>
						<p>
							Les présentes <strong>mentions légales</strong> sont régies par le
							droit français. En cas de litige, et à défaut de résolution
							amiable, les tribunaux français seront compétents.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LegalNotices;
