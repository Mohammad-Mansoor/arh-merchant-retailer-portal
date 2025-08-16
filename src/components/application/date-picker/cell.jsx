import { getDayOfWeek, getLocalTimeZone, isToday } from "@internationalized/date";
import { CalendarCell as AriaCalendarCell, RangeCalendarContext, useLocale, useSlottedContext } from "react-aria-components";

export const CalendarCell = ({ date, isHighlighted, ...props }) => {
    const { locale } = useLocale();
    const dayOfWeek = getDayOfWeek(date, locale);
    const rangeCalendarContext = useSlottedContext(RangeCalendarContext);

    const isRangeCalendar = !!rangeCalendarContext;
    const start = rangeCalendarContext?.value?.start;
    const end = rangeCalendarContext?.value?.end;

    const isAfterOrOnStart = start && date.compare(start) >= 0;
    const isBeforeOrOnEnd = end && date.compare(end) <= 0;
    const isInRange = isAfterOrOnStart && isBeforeOrOnEnd;
    const isTodayDate = isToday(date, getLocalTimeZone());

    return (
        <AriaCalendarCell
            {...props}
            date={date}
            className={({ 
                isDisabled, 
                isFocusVisible, 
                isSelectionStart, 
                isSelectionEnd, 
                isSelected, 
                isOutsideMonth 
            }) => {
                const isRoundedLeft = isSelectionStart || dayOfWeek === 0;
                const isRoundedRight = isSelectionEnd || dayOfWeek === 6;
                
                let className = "relative h-10 w-10 focus:outline-none";
                
                if (isRoundedLeft) className += " rounded-l-full";
                if (isRoundedRight) className += " rounded-r-full";
                if (isInRange && isDisabled) className += " bg-[#FAE6E6]";
                if (isSelected && isRangeCalendar) className += " bg-[#FAE6E6]";
                if (isDisabled) className += " pointer-events-none";
                if (!isDisabled) className += " cursor-pointer";
                // if (isFocusVisible) className += " z-10 ring-2 ring-blue-500 ring-inset";
                if (isRangeCalendar && isOutsideMonth) className += " hidden";
                
                return className;
            }}
        >
            {({ 
                isDisabled, 
                isFocusVisible, 
                isSelectionStart, 
                isSelectionEnd, 
                isSelected, 
                formattedDate 
            }) => {
                const markedAsSelected = isSelectionStart || isSelectionEnd || (isSelected && !isDisabled && !isRangeCalendar);
                const isStart = isSelectionStart;
                const isEnd = isSelectionEnd;
                const isRangeMiddle = isInRange && !isStart && !isEnd;
                
                let className = "relative flex h-full w-full items-center justify-center rounded-full text-sm";
                

                if (isDisabled) className += " text-gray-400";
                if (!isDisabled && !markedAsSelected) className += " text-gray-700 hover:text-gray-900";
                
       
                if (markedAsSelected) className += " bg-[#CD0202] text-white hover:bg-[#AE120A]";
                if (isRangeMiddle) className += " bg-[#FAE6E6]";
                if (!markedAsSelected && !isRangeMiddle && !isDisabled) className += " hover:bg-gray-100";
                if (!markedAsSelected && isTodayDate) className += " bg-blue-50";

                if (isFocusVisible) className += " outline-2 outline-offset-2 outline-blue-500";
                
                return (
                    <div className={className}>
                        {formattedDate}
                        
                        {(isHighlighted || isTodayDate) && !markedAsSelected && (
                            <div className={
                                `absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                                    isDisabled 
                                        ? "bg-[#ad8585]" 
                                        : isTodayDate 
                                            ? "bg-[#CD0202]" 
                                            : "bg-yellow-400"
                                }`
                            } />
                        )}
                    </div>
                );
            }}
        </AriaCalendarCell>
    );
};