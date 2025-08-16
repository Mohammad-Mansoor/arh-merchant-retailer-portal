import { useSlottedContext } from "react-aria-components";

export const RangePresetButton = ({ value, className, children, ...props }) => {
    const context = useSlottedContext("RangeCalendarContext");
    
    const isSelected = context?.value?.start?.compare(value.start) === 0 && 
                      context?.value?.end?.compare(value.end) === 0;

    return (
        <button
            {...props}
            className={`
                cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium 
                transition-colors duration-100 ease-linear
                focus-visible:outline-2 focus-visible:outline-[#CD0202] focus-visible:outline-offset-2
                ${
                    isSelected 
                        ? "bg-[#CD0202] text-white hover:bg-[#CD0202]" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
                ${className || ''}
            `}
        >
            {children}
        </button>
    );
};