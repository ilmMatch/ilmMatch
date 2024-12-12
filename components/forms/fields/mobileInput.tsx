'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'

interface Country {
    name: {
        common: string;
    };
    cca2: string;
    flags: {
        svg: string;
    };
    idd: {
        root: string;
        suffixes: string[];
    };
}

interface CustomPhoneInputProps {
    onChange: (countryCode: string, phoneNumber: string) => void
    className?: string
}

export function CustomPhoneInput({ onChange, className }: CustomPhoneInputProps) {
    const { saveToFirebase } = useAuth()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [countries, setCountries] = React.useState<Country[]>([])
    const [countriesData, setCountriesData] = React.useState<({
        country: string;
        flag: string;
        code: number | number[];
    } | undefined)[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd')
            .then(response => response.json())
            .then((data: Country[]) => {
                console.log("data", data)
                const sortedCountries = data
                    .filter(country => country.idd.root) // Only countries with phone codes
                    .sort((a, b) => a.name.common.localeCompare(b.name.common))
                setCountries(sortedCountries)
                setLoading(false)
                console.log(sortedCountries)
                const transformedArray = sortedCountries.map(item => {
                    const root = parseInt(item.idd.root?.replace('+', ''));
                    const codes = item.idd.suffixes?.map(suffix => parseInt(root + suffix));

                    return {
                        country: item.name.common,
                        flag: item.flags.svg,
                        code: codes?.length > 1 ? codes : codes[0] // Use array for multiple codes, single number otherwise
                    };
                });

                console.log(transformedArray);
            })
            .catch(err => {
                console.error('Error fetching countries:', err)
                setError('Failed to load countries. Please try again later.')
                setLoading(false)
            })
    }, [])
    const handleCountrySelect = (currentValue: string) => {
        setValue(currentValue)
        setOpen(false)
        onChange(currentValue, phoneNumber)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value.replace(/\D/g, '')
        setPhoneNumber(newPhoneNumber)
        onChange(value, newPhoneNumber)
    }

    const selectedCountry = countries.find(country => country.cca2 === value)

    const getCountryCode = (country: Country) => {
        if (country.idd.root && country.idd.suffixes && country.idd.suffixes.length > 0) {
            return `${country.idd.root}${country.idd.suffixes[0]}`
        }
        return country.idd.root || ''
    }

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
                            disabled={loading || !!error}
                        >
                            {loading ? (
                                'Loading...'
                            ) : error ? (
                                'Error'
                            ) :
                                <>
                                    <img
                                        src={selectedCountry ? selectedCountry.flags.svg : countries[0].flags.svg}
                                        alt={`Flag of ${selectedCountry ? selectedCountry.name.common : countries[0].name.common}`}
                                        className="w-5 h-3"
                                    />
                                    {selectedCountry ? getCountryCode(selectedCountry) : getCountryCode(countries[0])}
                                </>

                            }
                            <ChevronsUpDown className="h-4 w-fit shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-auto">
                                    {countries.map((country) => (
                                        <CommandItem
                                            key={country.cca2}
                                            onSelect={() => handleCountrySelect(country.cca2)}
                                            className='flex'
                                        >
                                            {/* <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === country.cca2 ? 'opacity-100' : 'opacity-100'
                                                )}
                                            /> */}
                                            <div className='bg-secondary p-1 max-w-fit rounded-sm'>
                                                <img
                                                    src={country.flags.svg}
                                                    alt={`Flag of ${country.name.common}`}
                                                    className="w-5 h-3 "
                                                />
                                            </div>
                                            <span className='flex-1'>
                                                {country.name.common}
                                            </span>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

