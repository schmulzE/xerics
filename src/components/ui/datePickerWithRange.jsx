import { cn } from "@/lib/utils";
// eslint-disable-next-line no-unused-vars
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useTheme } from "../../../context/themeContext";
import {  Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerWithRange({className, dateRange, setDateRange} ) {
  const { theme } = useTheme();


  return (
    <div className={cn(`${theme == 'dark' ? 'bg-base-100' : 'bg-base-100'} grid gap-2`, className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] items-center justify-start text-left font-normal bg-base-100 h-10 border-base-300 hover:bg-base-100 hover:text-muted-foreground",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className={`${theme == 'dark' ? 'bg-base-100 ' : 'bg-base-100'}`}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
