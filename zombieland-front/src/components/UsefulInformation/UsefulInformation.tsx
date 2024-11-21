import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GreenLink } from "../GreenLink";
import Select from "../Select/Select";
import { SelectOptionItem } from "../Select/Select.type";
import { UsefulInformationContentItem } from "./UsefulInformation.type";
import AboutUs from "../../Pages/AboutUs";
import SiteMap from "../../Pages/SiteMap";
import LegalNotices from "../../Pages/LegalNotices";
import CGV from "../../Pages/CGV";
import Newletter from "../../Pages/Newsletter";
import Glossary from "../../Pages/Glossary";
import Support from "../../Pages/Support";

export const UsefulInformation = () => {
	// State to track the currently selected item. Default value is "aboutus".
	const [selectedItem, setSelectedItem] =
		useState<UsefulInformationContentItem>("aboutus");
	
	// Hook to access the current location, including path and hash in the URL.
	const location = useLocation();

	// Effect to detect changes in the URL hash and update the selected item.
	useEffect(() => {
		// If there is a hash in the URL, extract and match it with available options.
		if (location.hash) {
			const hashValue = location.hash.substring(1); // Remove the "#" character.
			// Check if the hash matches a value in optionItems and update selectedItem if valid.
			if (optionItems.some((item) => item.value === hashValue)) {
				setSelectedItem(hashValue as UsefulInformationContentItem);
			}
		}
	}, [location]); // Re-run the effect whenever the location changes.

	// Function to scroll to the top of the page with a smooth animation.
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Define available options for the dropdown and navigation links.
	const optionItems: SelectOptionItem<UsefulInformationContentItem>[] = [
		{ name: "À propos", value: "aboutus" }, // About Us page
		{ name: "Plan du site", value: "sitemap" }, // Sitemap page
		{ name: "Mentions légales", value: "legal-notices" }, // Legal Notices page
		{ name: "CGV", value: "cgv" }, // Terms and Conditions (CGV) page
		{ name: "Newsletter", value: "newsletter" }, // Newsletter page
		{ name: "Glossaire", value: "glossary" }, // Glossary page
		{ name: "Support", value: "support" }, // Support page
	];

	return (
		<div className="block min-h-screen bg-black p-11">
			{/* Navigation links for larger screens (desktop view) */}
			<div className="flex-wrap items-center justify-center hidden gap-4 py-8 lg:flex sm:text-sm lg:text-lg xl:text-xl">
				{/* Map over optionItems to display each item as a clickable GreenLink */}
				{optionItems.map((item) => (
					<GreenLink
						key={item.value} // Unique key based on item value
						onClick={() => {
							setSelectedItem(item.value); // Update selectedItem when a link is clicked
							scrollToTop(); // Scroll to the top of the page
						}}
						textSize="text-sm"
						position="relative"
					>
						{item.name}
					</GreenLink>
				))}
			</div>

			{/* Dropdown menu for smaller screens (mobile view) */}
			<div>
				<div className="block lg:hidden">
					{/* Pass options and current selection to the Select component */}
					<Select
						items={optionItems} // Array of options for the dropdown
						selectedItem={selectedItem} // Currently selected item
						onSelectedItem={(
							nextSelectedItem: UsefulInformationContentItem,
						) => {
							setSelectedItem(nextSelectedItem); // Update selectedItem when a new option is selected
							scrollToTop(); // Scroll to the top of the page
						}}
					/>
				</div>

				{/* Display the corresponding page component based on the selected item */}
				{selectedItem === "aboutus" && <AboutUs />} {/* About Us page */}
				{selectedItem === "sitemap" && <SiteMap />} {/* Sitemap page */}
				{selectedItem === "legal-notices" && <LegalNotices />} {/* Legal Notices page */}
				{selectedItem === "cgv" && <CGV />} {/* Terms and Conditions (CGV) page */}
				{selectedItem === "newsletter" && <Newletter />} {/* Newsletter page */}
				{selectedItem === "glossary" && <Glossary />} {/* Glossary page */}
				{selectedItem === "support" && <Support />} {/* Support page */}
			</div>
		</div>
	);
};