interface TitleProps {
    
    children: string
}

export const TitleGrey = ({children}: TitleProps) => {
    return (
        <p
            
            className="relative inline-flex items-center rounded-md bg-grey px-3 py-2 text-xl font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-7"
            >
                {children}
        </p>

    )
}