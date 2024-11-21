interface LinkProps {
	textSize: string;
	position: string;
	children: string;
	onClick: () => void;
}

export const GreenLink = ({
	onClick,
	position,
	textSize,
	children,
}: LinkProps) => {
	return (
		<div
			onClick={onClick}
			onKeyUp={onClick}
			onKeyDown={onClick}
			className={`transform transition-transform duration-400 hover:scale-110 ${position} inline-flex items-center rounded-md bg-green-low px-3 py-2 ${textSize} font-semibold text-white shadow-sm hover:bg-red-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary mx-3 active:bg-red-primary focus:bg-red-primary`}
		>
			{children}
		</div>
	);
};
