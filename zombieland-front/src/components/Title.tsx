interface TitleProps {
    
    children: string
}

export const Title = ({children}: TitleProps) => {
    return (
        <p
            
            className="relative inline-flex items-center rounded-md bg-green-low px-3 py-2 text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-7"
            >
                {children}
        </p>

    )
}
