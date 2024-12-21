'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { FilterOptions } from '@/types/firebase'
import { useDisclosure } from '@nextui-org/modal'

interface FilterModalProps {
    filters: FilterOptions
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>
}

export function FilterModal({ filters, setFilters }: FilterModalProps) {

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const handleClearAll = () => {
        setFilters({
            name: '',
            gender: 'all',
            countryResiding: '',
            education: '',
            ethnicity: '',
            languages: [],
            scholars: [],
            polygamy: 'all',
            spouseAgeMin: 18,
            spouseAgeMax: 80,
            heightMin: 140,
            heightMax: 220,
        });
    };

    return (
        <>


            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">filter</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Profiles</DialogTitle>
                        <DialogDescription>
                            Set your preferences to find the best match.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender" className="text-right">
                                Gender
                            </Label>
                            <Select
                                value={filters.gender}
                                onValueChange={(value) => handleFilterChange('gender', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="brother">Brother</SelectItem>
                                    <SelectItem value="sister">Sister</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="country" className="text-right">
                                Country
                            </Label>
                            <Input
                                id="country"
                                value={filters.countryResiding}
                                onChange={(e) => handleFilterChange('country', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="education" className="text-right">
                                Education
                            </Label>
                            <Input
                                id="education"
                                value={filters.education}
                                onChange={(e) => handleFilterChange('education', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ethnicity" className="text-right">
                                Ethnicity
                            </Label>
                            <Input
                                id="ethnicity"
                                value={filters.ethnicity}
                                onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="languages" className="text-right">
                                Languages
                            </Label>
                            <Input
                                id="languages"
                                value={filters.languages?.join(', ')}
                                onChange={(e) => handleFilterChange('languages', e.target.value.split(', '))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scholars" className="text-right">
                                Scholars
                            </Label>
                            <Input
                                id="scholars"
                                value={filters.scholars?.join(', ')}
                                onChange={(e) => handleFilterChange('scholars', e.target.value.split(', '))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="polygamy" className="text-right">
                                Polygamy
                            </Label>
                            <Select
                                value={filters.polygamy}
                                onValueChange={(value) => handleFilterChange('polygamy', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="under certain Circumstances">Under Certain Circumstances</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Spouse Age</Label>
                            <div className="col-span-3">
                                <Slider
                                    min={18}
                                    max={80}
                                    step={1}
                                    value={[filters.spouseAgeMin || 18, filters.spouseAgeMax || 80]}
                                    onValueChange={(value: any[]) => {
                                        handleFilterChange('spouseAgeMin', value[0]);
                                        handleFilterChange('spouseAgeMax', value[1]);
                                    }}
                                />
                                <div className="flex justify-between mt-2">
                                    <span>{filters.spouseAgeMin || 18}</span>
                                    <span>{filters.spouseAgeMax || 80}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Height (cm)</Label>
                            <div className="col-span-3">
                                <Slider
                                    min={140}
                                    max={220}
                                    step={1}
                                    value={[filters.heightMin || 140, filters.heightMax || 220]}
                                    onValueChange={(value: any[]) => {
                                        handleFilterChange('heightMin', value[0]);
                                        handleFilterChange('heightMax', value[1]);
                                    }}
                                />
                                <div className="flex justify-between mt-2">
                                    <span>{filters.heightMin || 140}</span>
                                    <span>{filters.heightMax || 220}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={handleClearAll}>
                            Clear All
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
