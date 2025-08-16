import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useControlledState } from "@react-stately/utils";
import { Calendar as CalendarIcon } from "@untitledui/icons";
import { useDateFormatter } from "react-aria";
import { DateRangePicker as AriaDateRangePicker, Dialog as AriaDialog, Group as AriaGroup, Popover as AriaPopover, useLocale } from "react-aria-components";
import { Button } from "./base/buttons/button";
import { DateInput } from "./date-input";
import { RangeCalendar } from "./range-calendar";
import { RangePresetButton } from "./range-preset";

const now = today(getLocalTimeZone());
const highlightedDates = [today(getLocalTimeZone())];

export const DateRangePicker = ({ value: valueProp, defaultValue, onChange, onApply, onCancel, ...props }) => {
    const { locale } = useLocale();
    const formatter = useDateFormatter({
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [value, setValue] = useControlledState(valueProp, defaultValue || null, onChange);
    const [focusedValue, setFocusedValue] = useState(null);

    const formattedStartDate = value?.start ? formatter.format(value.start.toDate(getLocalTimeZone())) : "Select date";
    const formattedEndDate = value?.end ? formatter.format(value.end.toDate(getLocalTimeZone())) : "Select date";

    const presets = useMemo(
        () => ({
            today: { label: "Today", value: { start: now, end: now } },
            yesterday: { label: "Yesterday", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
            thisWeek: { label: "This week", value: { start: startOfWeek(now, locale), end: endOfWeek(now, locale) } },
            lastWeek: {
                label: "Last week",
                value: {
                    start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                    end: endOfWeek(now, locale).subtract({ weeks: 1 }),
                },
            },
            thisMonth: { label: "This month", value: { start: startOfMonth(now), end: endOfMonth(now) } },
            lastMonth: {
                label: "Last month",
                value: {
                    start: startOfMonth(now).subtract({ months: 1 }),
                    end: endOfMonth(now).subtract({ months: 1 }),
                },
            },
            thisYear: { label: "This year", value: { start: startOfMonth(now.set({ month: 1 })), end: endOfMonth(now.set({ month: 12 })) } },
            lastYear: {
                label: "Last year",
                value: {
                    start: startOfMonth(now.set({ month: 1 }).subtract({ years: 1 })),
                    end: endOfMonth(now.set({ month: 12 }).subtract({ years: 1 })),
                },
            },
            allTime: {
                label: "All time",
                value: {
                    start: now.set({ year: 2000, month: 1, day: 1 }),
                    end: now,
                },
            },
        }),
        [locale]
    );

    return (
        <AriaDateRangePicker 
            aria-label="Date range picker" 
            shouldCloseOnSelect={false} 
            {...props} 
            value={value} 
            onChange={setValue}
        >
            <AriaGroup>
                <Button 
                    size="md" 
                    variant="secondary"
                    iconLeading={CalendarIcon}
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                    {!value ? (
                        <span className="text-gray-500">Select dates</span>
                    ) : (
                        <span className="text-gray-800">{formattedStartDate} – {formattedEndDate}</span>
                    )}
                </Button>
            </AriaGroup>
            <AriaPopover
                placement="bottom right"
                offset={8}
                className={({ isEntering, isExiting }) => {
                    let classes = "will-change-transform shadow-lg rounded-lg overflow-hidden";
                    
                    if (isEntering) {
                        classes += " duration-150 ease-out animate-in fade-in";
                    }
                    
                    if (isExiting) {
                        classes += " duration-100 ease-in animate-out fade-out";
                    }
                    
                    return classes;
                }}
            >
                <AriaDialog className="flex bg-white">
                    {({ close }) => (
                        <div className="flex w-full max-w-[800px]">
                            <div className="hidden w-48 flex-col gap-1 border-r border-gray-200 p-3 lg:flex">
                                {Object.values(presets).map((preset) => (
                                    <RangePresetButton
                                        key={preset.label}
                                        value={preset.value}
                                        onClick={() => {
                                            setValue(preset.value);
                                            setFocusedValue(preset.value.start);
                                        }}
                                    >
                                        {preset.label}
                                    </RangePresetButton>
                                ))}
                            </div>
                            <div className="flex flex-1 flex-col">
                                <RangeCalendar
                                    focusedValue={focusedValue}
                                    onFocusChange={setFocusedValue}
                                    highlightedDates={highlightedDates}
                                    presets={{
                                        lastWeek: presets.lastWeek,
                                        lastMonth: presets.lastMonth,
                                        lastYear: presets.lastYear,
                                    }}
                                />
                                <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <DateInput 
                                            slot="start" 
                                            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        />
                                        <div className="text-gray-400">–</div>
                                        <DateInput 
                                            slot="end" 
                                            className="w-32 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            size="md"
                                            variant="secondary"
                                            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                            onClick={() => {
                                                if (onCancel) onCancel();
                                                close();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="md"
                                            variant="primary"
                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                            onClick={() => {
                                                if (onApply) onApply();
                                                close();
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDateRangePicker>
    );
};