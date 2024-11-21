// Import specific components from @headlessui/react to build a customizable dropdown menu
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
// Import icons from @heroicons/react to enhance the dropdown menu UI
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// Import React hooks for managing state and effects
import { useEffect, useState } from "react";
// Import the SelectOptionItem type, used to type the dropdown menu options
import { SelectOptionItem } from "./Select.type";

// Define the prop types for the Select component, using a generic type T for greater flexibility
type SelectProps<T> = {
	items: SelectOptionItem<T>[]; // List of available options in the dropdown, typed generically
	selectedItem: T; // Currently selected option, of the same type as the items
	onSelectedItem: (item: T) => void; // Callback function triggered when a new option is selected
};

// Declare the Select component using a generic type <T> to handle various types of options
export const Select = <T,>({
	items, // List of available options
	selectedItem, // Current selected item
	onSelectedItem, // Callback to notify the selection of a new item
}: SelectProps<T>) => {
	// Declare state to manage the currently selected item in the UI
	const [currentSelectedItem, setCurrentSelectedItem] = useState<
		SelectOptionItem<T> | undefined
	>(undefined); // Initialized to undefined for no initial selection

	// Use an effect to synchronize currentSelectedItem with the value of selectedItem
		useEffect(() => {
		// Find the item in items matching selectedItem and update currentSelectedItem
		setCurrentSelectedItem(items.find((item) => item.value === selectedItem));
	}, [selectedItem]); // Effect triggers whenever selectedItem changes

	return (
		<div className="block">
			{/* Listbox is the main container for the dropdown menu, configured with value and onChange event */}
			<Listbox
				value={currentSelectedItem} // Sets the displayed selected item in the list
				onChange={(item) => {
					onSelectedItem(item.value); // Calls the onSelectedItem function with the chosen item's value
				}}
			>
				{/* Label for the Select component to indicate the purpose of the dropdown */}
				<div className="relative mt-2">
					{/* ListboxButton displays the selected choice's text and reacts to clicks to open the list */}
					<ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-black shadow-sm ring-1 ring-inset ring-green-low focus:outline-none focus:ring-2 focus:ring-red-primary sm:text-sm/6">
						<span className="flex items-center">
							{/* Displays the name of the selected option or a default text if no selection */}
							<span className="block ml-3 truncate">
								{currentSelectedItem
									? currentSelectedItem?.name // Displays the name of the selected item if available
									: "Select an option"}
							</span>
						</span>
						{/* ChevronUpDown icon indicating the dropdown functionality */}
						<span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
							<ChevronUpDownIcon
								aria-hidden="true"
								className="w-5 h-5 text-gray-400"
							/>
						</span>
					</ListboxButton>

					{/* ListboxOptions displays the available options as a dropdown menu */}
					<ListboxOptions
						transition // Applies a transition for opening and closing the list
						className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
					>
						{/* items.map generates each dropdown option from the items data */}
						{items.map((item: SelectOptionItem<T>) => (
							<ListboxOption
								key={item.name} // Unique key for each option based on the name
								value={item} // Option value
								className="group relative cursor-default select-none py-2 pl-3 pr-9 text-black data-[focus]:bg-red-primary data-[focus]:text-white"
							>
								<div className="flex items-center">
									{/* Displays the name of the option */}
									<span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
										{item.name}
									</span>
								</div>

								{/* Check icon displayed if the option is selected */}
								<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red-primary group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
									<CheckIcon aria-hidden="true" className="w-5 h-5" />
								</span>
							</ListboxOption>
						))}
					</ListboxOptions>
				</div>
			</Listbox>
		</div>
	);
};

export default Select;