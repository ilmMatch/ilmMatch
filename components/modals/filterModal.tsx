'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterOptions } from '@/types/firebase';
import { Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

interface FilterModalProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  applyFilterClick: () => void;
}

export function FilterModal({ filters, setFilters, applyFilterClick }: FilterModalProps) {
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const { userDataPrivate } = useAuth();

  const handleNestedFilterChange = (
    parent: string,
    child: string,
    value: any
  ) => {
    setFilters((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };

  const handleClearAll = () => {
    setFilters({
      name: '',
      gender: userDataPrivate?.gender === 'brother' ? 'sister' : 'brother',
      countryResiding: '',
      countryMoving: '',
      education: '',
      ethnicity: '',
      languages: [],
      scholars: [],
      polygamy: 'all',
      maritialStatus: 'all',
      age: { min: undefined, max: undefined },
      height: { min: undefined, max: undefined },
      born: 'all',
      hijab: 'all',
      beard: 'all',
      matched: 'notmatched',
      approved: 'approved',
    });

    applyFilterClick();
  };

  const isAdmin = userDataPrivate?.role === 'admin';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Profiles</DialogTitle>
          <DialogDescription>
            Set your preferences to find the best match.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {isAdmin &&
            <div className="grid sm:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="matched">Matched</Label>
                <Select
                  value={filters.matched}
                  onValueChange={(value) => handleFilterChange('matched', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all</SelectItem>
                    <SelectItem value="notmatched">show unmatched</SelectItem>
                    <SelectItem value="matched">show matched</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="approved">Approved Profiles</Label>
                <Select
                  value={filters.approved}
                  onValueChange={(value) => handleFilterChange('approved', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="notApproved">Not Approved</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          }


          <div className="grid sm:grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="born">Revert or Born</Label>
              <Select
                value={filters.born}
                onValueChange={(value) => handleFilterChange('born', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="born">Born Muslim</SelectItem>
                  <SelectItem value="revert">Revert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="brother">Brother</SelectItem>
                  <SelectItem value="sister">Sister</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="hijab">hijab</Label>
              <Select
                value={filters.hijab}
                onValueChange={(value) => handleFilterChange('hijab', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="niqab">Niqab</SelectItem>
                  <SelectItem value="hijab">Hijab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="beard">Beard</Label>
              <Select
                value={filters.beard}
                onValueChange={(value) => handleFilterChange('beard', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={filters.countryResiding}
                onChange={(e) =>
                  handleFilterChange('countryResiding', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryMoving">Country Moving</Label>
              <Input
                id="countryMoving"
                value={filters.countryMoving}
                onChange={(e) =>
                  handleFilterChange('countryMoving', e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Input
                id="ethnicity"
                value={filters.ethnicity}
                onChange={(e) =>
                  handleFilterChange('ethnicity', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={filters.education}
                onChange={(e) => handleFilterChange('education', e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={filters.languages?.join(', ')}
                onChange={(e) =>
                  handleFilterChange('languages', e.target.value.split(', '))
                }
                placeholder='Comma separated (, )'
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scholars">Scholars</Label>
              <Input
                id="scholars"
                value={filters.scholars?.join(', ')}
                onChange={(e) =>
                  handleFilterChange('scholars', e.target.value.split(', '))
                }
                placeholder='Comma separated (, )'
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="polygamy">Polygamy</Label>
              <Select
                value={filters.polygamy}
                onValueChange={(value) => handleFilterChange('polygamy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="under certain circumstances">
                    Under Certain Circumstances
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritial">Maritial Status</Label>
              <Select
                value={filters.maritialStatus}
                onValueChange={(value) => handleFilterChange('maritialStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>



          <div className='flex max-sm:flex-col gap-4'>
            <div className="flex items-center gap-2">
              <Label>Age</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={filters.age?.min || ''}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      'age',
                      'min',
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="Min"
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  value={filters.age?.max || ''}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      'age',
                      'max',
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="Max"
                  className="w-20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label>Height(cm)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={filters.height?.min || ''}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      'height',
                      'min',
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="Min"
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  value={filters.height?.max || ''}
                  onChange={(e) =>
                    handleNestedFilterChange(
                      'height',
                      'max',
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="Max"
                  className="w-20"
                />
              </div>
            </div>
          </div>


        </div>
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={applyFilterClick}>
              Apply Filters
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
