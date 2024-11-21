import { Link } from "react-router-dom";

interface LinkProps {
	textSize: string;
	position: string;
	children: string;
	to: string;
	
}

export const RedLink = ({ to, position, textSize, children }: LinkProps) => {
	return (
		<Link
			to={to}
			className={`transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md bg-red-primary px-3 py-2 ${textSize} font-semibold text-white shadow-sm hover:bg-red-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
			
		>
			{children}
		</Link>
	);
};
