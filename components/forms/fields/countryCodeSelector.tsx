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
import { useState } from 'react';

interface CustomPhoneInputProps {
    onChange: (countryCode: number) => void;
    defaultCode: number | null,
    editing: boolean,
    className?: string;
}

export function CountryCodeSelector({
    onChange,
    defaultCode,
    editing,
    className,
}: CustomPhoneInputProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<CountryCode>({} as CountryCode);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCountrySelect = (currentValue: CountryCode) => {
        setValue(currentValue);
        setOpen(false);
        onChange(currentValue.code);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value.replace(/\D/g, '');
        setPhoneNumber(newPhoneNumber);
        onChange(value.code);
    };

    const selectedCountry = countryCode.find(
        (country) => country === value
    );

    return (
        <div className={cn('', className)}>
            <div className="flex space-x-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn("w-fit justify-between p-2", !editing && "border-none p-0")}
                            disabled={false}
                        >
                            <>
                                + {selectedCountry ? selectedCountry.code : defaultCode ? defaultCode : countryCode[0].code}
                            </>

                            <ChevronsUpDown className={cn("h-4 w-fit shrink-0 opacity-50", !editing && "hidden")} />
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
                                            onSelect={() => handleCountrySelect(country)}
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
            </div>
        </div>
    );
}
