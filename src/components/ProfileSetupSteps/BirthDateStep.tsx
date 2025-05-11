
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BirthDateStep = ({ form }: { form: any }) => {
  const [dateStep, setDateStep] = useState<'year' | 'month' | 'date'>('year');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Generate year options (1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  // Generate month options
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  // Generate date options based on selected year and month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(parseInt(year));
    setDateStep('month');
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(parseInt(month));
    setDateStep('date');
  };

  const handleDateSelect = (day: string) => {
    if (selectedYear !== null && selectedMonth !== null) {
      const selectedDate = new Date(selectedYear, selectedMonth, parseInt(day));
      form.setValue('birthdate', selectedDate);
      
      // Reset the step for a nice visual confirmation
      setTimeout(() => {
        setDateStep('year');
      }, 500);
    }
  };

  const handleBack = () => {
    if (dateStep === 'date') {
      setDateStep('month');
    } else if (dateStep === 'month') {
      setDateStep('year');
    }
  };

  const renderDatePicker = () => {
    switch (dateStep) {
      case 'year':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center">Select Year</h3>
            <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto p-1">
              {years.map((year) => (
                <Button
                  key={year}
                  variant="outline"
                  onClick={() => handleYearSelect(year.toString())}
                  className={cn(
                    "h-10",
                    selectedYear === year && "bg-primary text-primary-foreground"
                  )}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'month':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button size="sm" variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <h3 className="text-sm font-medium">Select Month</h3>
              <div className="w-12"></div> {/* Spacer for alignment */}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant="outline"
                  onClick={() => handleMonthSelect(month.value.toString())}
                  className={cn(
                    "h-10",
                    selectedMonth === month.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {month.label}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'date':
        if (selectedYear !== null && selectedMonth !== null) {
          const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          
          return (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Button size="sm" variant="ghost" onClick={handleBack}>
                  Back
                </Button>
                <h3 className="text-sm font-medium">Select Day</h3>
                <div className="w-12"></div> {/* Spacer for alignment */}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant="outline"
                    onClick={() => handleDateSelect(day.toString())}
                    className="h-10 w-10 p-0"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">When were you born?</h2>
        <p className="text-muted-foreground text-sm">Your age helps us match you appropriately</p>
      </div>
      
      <FormField
        control={form.control}
        name="birthdate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <div className="relative">
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal justify-start",
                    !field.value && "text-muted-foreground"
                  )}
                  onClick={() => setDateStep('year')}
                  type="button"
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
                {field.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 rounded-full p-0"
                    onClick={() => {
                      form.setValue('birthdate', undefined);
                      setSelectedYear(null);
                      setSelectedMonth(null);
                      setDateStep('year');
                    }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </FormControl>
            <div className="mt-2 bg-card border rounded-md p-4">
              {renderDatePicker()}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BirthDateStep;
