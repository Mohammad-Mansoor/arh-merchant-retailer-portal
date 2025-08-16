import { useMemo, useState } from "react";
import { endOfMonth, endOfWeek, getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { DateRangePicker as AriaDateRangePicker, Dialog as AriaDialog, useLocale } from "react-aria-components";
import { Button } from "./button";
import { RangeCalendar } from "./range-calendar";
import { DateInput } from "./date-input";
import { RangePresetButton } from "./range-preset";

const now = today(getLocalTimeZone());

export const ARHCustomDateFiler = ({ onApply, onClose }) => {
    const { locale } = useLocale();
    const [focusedValue, setFocusedValue] = useState(null);
    const [value, setValue] = useState({
        start: now.subtract({ days: 7 }),
        end: now,
    });

    const presets = useMemo(() => ({
        today: { label: "Today", value: { start: now, end: now } },
        yesterday: { label: "Yesterday", value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
        thisWeek: { 
            label: "This week", 
            value: { 
                start: startOfWeek(now, locale), 
                end: endOfWeek(now, locale) 
            } 
        },
        lastWeek: {
            label: "Last week",
            value: {
                start: startOfWeek(now, locale).subtract({ weeks: 1 }),
                end: endOfWeek(now, locale).subtract({ weeks: 1 }),
            },
        },
        thisMonth: { 
            label: "This month", 
            value: { 
                start: startOfMonth(now), 
                end: endOfMonth(now) 
            } 
        },
        lastMonth: {
            label: "Last month",
            value: {
                start: startOfMonth(now).subtract({ months: 1 }),
                end: endOfMonth(now).subtract({ months: 1 }),
            },
        },
        thisYear: { 
            label: "This year", 
            value: { 
                start: startOfMonth(now.set({ month: 1 })), 
                end: endOfMonth(now.set({ month: 12 })) 
            } 
        },
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
    }), [locale, now]);

    const handleApply = () => {
        const startDate = value.start.toDate(getLocalTimeZone()).toISOString();
        const endDate = value.end.toDate(getLocalTimeZone()).toISOString();
        onApply(startDate, endDate);
    };

    return (
        <AriaDateRangePicker 
            aria-label="Date range picker" 
            value={value} 
            onChange={setValue}
        >
            <AriaDialog className="flex w-[810px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="hidden w-48 flex-col gap-2 p-4 border-r border-gray-200 lg:flex">
                    {Object.values(presets).map((preset) => (
                        <RangePresetButton
                            key={preset.label}
                            value={preset.value}
                            onClick={() => {
                                setFocusedValue(preset.value.start);
                                setValue(preset.value);
                            }}
                        >
                            {preset.label}
                        </RangePresetButton>
                    ))}
                </div>
                <div className="flex flex-col ">
                    <RangeCalendar
                        focusedValue={focusedValue}
                        onFocusChange={setFocusedValue}
                        presets={{
                            lastWeek: presets.lastWeek,
                            lastMonth: presets.lastMonth,
                            lastYear: presets.lastYear,
                        }}
                    />
                    <div className="flex flex-col gap-3 p-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
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
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                size="md" 
                                variant="primary"
                                className="bg-[#CD0202] text-white hover:bg-[#AE120A]"
                                onClick={handleApply}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </AriaDialog>
        </AriaDateRangePicker>
    );
};