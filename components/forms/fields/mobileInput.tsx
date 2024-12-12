'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { countryCode } from '@/config/countryCode';
import { CountryCode } from '@/types';

interface CustomPhoneInputProps {
    onChange: (countryCode: string, phoneNumber: string) => void;
    className?: string;
}

export function CustomPhoneInput({
    onChange,
    className,
}: CustomPhoneInputProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');

    const handleCountrySelect = (currentValue: string) => {
        setValue(currentValue);
        setOpen(false);
        onChange(currentValue, phoneNumber);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value.replace(/\D/g, '');
        setPhoneNumber(newPhoneNumber);
        onChange(value, newPhoneNumber);
    };

    const selectedCountry = countryCode.find(
        (country) => country.country === value
    );

    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex space-x-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-fit justify-between p-2"
                            disabled={false}
                        >
                            <>
                                <img
                                    src={
                                        selectedCountry ? selectedCountry.flag : countryCode[0].flag
                                    }
                                    alt={`Flag of ${selectedCountry ? selectedCountry.country : countryCode[0].country}`}
                                    className="w-5 h-3"
                                />
                                + {selectedCountry ? selectedCountry.code : countryCode[0].code}
                            </>

                            <ChevronsUpDown className="h-4 w-fit shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-auto">
                                    {countryCode.map((country) => (
                                        <CommandItem
                                            key={country.country}
                                            onSelect={() => handleCountrySelect(country.country)}
                                            className="flex"
                                        >
                                            <div className="bg-secondary p-1 max-w-fit rounded-sm">
                                                <img
                                                    src={country.flag}
                                                    alt={`Flag of ${country.country}`}
                                                    className="w-5 h-3 "
                                                />
                                            </div>
                                            <span className="flex-1">{country.country}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-1"
                />
            </div>
        </div>
    );
}
