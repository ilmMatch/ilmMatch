// 'use client';

// import React from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { FilterOptions } from '@/types/firebase';

// interface FilterModalProps {
//   filters: FilterOptions;
//   setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
// }

// export function FilterModal({ filters, setFilters }: FilterModalProps) {
//   const handleFilterChange = (name: string, value: any) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleNestedFilterChange = (
//     parent: string,
//     child: string,
//     value: any
//   ) => {
//     setFilters((prev) => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [child]: value,
//       },
//     }));
//   };

//   const handleClearAll = () => {
//     setFilters({
//       name: '',
//       gender: 'all',
//       countryResiding: '',
//       education: '',
//       ethnicity: '',
//       languages: [],
//       scholars: [],
//       polygamy: 'all',
//       spouseAge: { min: undefined, max: undefined },
//       height: { min: 150, max: 200 },
//     });
//   };

//   return (
//     <>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline">filter</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Filter Profiles</DialogTitle>
//             <DialogDescription>
//               Set your preferences to find the best match.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 value={filters.name}
//                 onChange={(e) => handleFilterChange('name', e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="gender" className="text-right">
//                 Gender
//               </Label>
//               <Select
//                 value={filters.gender}
//                 onValueChange={(value) => handleFilterChange('gender', value)}
//               >
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select gender" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="brother">Brother</SelectItem>
//                   <SelectItem value="sister">Sister</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="country" className="text-right">
//                 Country
//               </Label>
//               <Input
//                 id="country"
//                 value={filters.countryResiding}
//                 onChange={(e) => handleFilterChange('country', e.target.value)}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="education" className="text-right">
//                 Education
//               </Label>
//               <Input
//                 id="education"
//                 value={filters.education}
//                 onChange={(e) =>
//                   handleFilterChange('education', e.target.value)
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="ethnicity" className="text-right">
//                 Ethnicity
//               </Label>
//               <Input
//                 id="ethnicity"
//                 value={filters.ethnicity}
//                 onChange={(e) =>
//                   handleFilterChange('ethnicity', e.target.value)
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="languages" className="text-right">
//                 Languages
//               </Label>
//               <Input
//                 id="languages"
//                 value={filters.languages?.join(', ')}
//                 onChange={(e) =>
//                   handleFilterChange('languages', e.target.value.split(', '))
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="scholars" className="text-right">
//                 Scholars
//               </Label>
//               <Input
//                 id="scholars"
//                 value={filters.scholars?.join(', ')}
//                 onChange={(e) =>
//                   handleFilterChange('scholars', e.target.value.split(', '))
//                 }
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="polygamy" className="text-right">
//                 Polygamy
//               </Label>
//               <Select
//                 value={filters.polygamy}
//                 onValueChange={(value) => handleFilterChange('polygamy', value)}
//               >
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select option" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="yes">Yes</SelectItem>
//                   <SelectItem value="no">No</SelectItem>
//                   <SelectItem value="under certain circumstances">
//                     Under Certain Circumstances
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Input
//                 type="number"
//                 value={filters.spouseAge?.min || ''}
//                 onChange={(e) =>
//                   handleNestedFilterChange(
//                     'spouseAge',
//                     'min',
//                     parseInt(e.target.value) || undefined
//                   )
//                 }
//                 placeholder="Min"
//                 className="w-20"
//               />
//               <span>-</span>
//               <Input
//                 type="number"
//                 value={filters.spouseAge?.max || ''}
//                 onChange={(e) =>
//                   handleNestedFilterChange(
//                     'spouseAge',
//                     'max',
//                     parseInt(e.target.value) || undefined
//                   )
//                 }
//                 placeholder="Max"
//                 className="w-20"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label className="text-right">Height (cm)</Label>
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="number"
//                   value={filters.height?.min || ''}
//                   onChange={(e) =>
//                     handleNestedFilterChange(
//                       'height',
//                       'min',
//                       parseInt(e.target.value) || undefined
//                     )
//                   }
//                   placeholder="Min"
//                   className="w-20"
//                 />
//                 <span>-</span>
//                 <Input
//                   type="number"
//                   value={filters.height?.max || ''}
//                   onChange={(e) =>
//                     handleNestedFilterChange(
//                       'height',
//                       'max',
//                       parseInt(e.target.value) || undefined
//                     )
//                   }
//                   placeholder="Max"
//                   className="w-20"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-between mt-6">
//             <Button type="button" variant="outline" onClick={handleClearAll}>
//               Clear All
//             </Button>
//             <DialogClose asChild>
//               <Button type="button" variant="secondary">
//                 Close
//               </Button>
//             </DialogClose>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

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
import { Slider } from '@/components/ui/slider';
import { FilterOptions } from '@/types/firebase';
import { Filter } from 'lucide-react';

interface FilterModalProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

export function FilterModal({ filters, setFilters }: FilterModalProps) {
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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
      gender: 'all',
      countryResiding: '',
      education: '',
      ethnicity: '',
      languages: [],
      scholars: [],
      polygamy: 'all',
      spouseAge: { min: 18, max: 65 },
      height: { min: 150, max: 200 },
    });
  };

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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
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
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Input
                id="ethnicity"
                value={filters.ethnicity}
                onChange={(e) =>
                  handleFilterChange('ethnicity', e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={filters.education}
              onChange={(e) => handleFilterChange('education', e.target.value)}
            />
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
              />
            </div>
          </div>

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

          <div className="space-y-4">
            <Label>Spouse Age Range</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={filters.spouseAge?.min || ''}
                onChange={(e) =>
                  handleNestedFilterChange(
                    'spouseAge',
                    'min',
                    parseInt(e.target.value) || 18
                  )
                }
                className="w-20"
              />
              <Slider
                min={18}
                max={65}
                step={1}
                value={[
                  filters.spouseAge?.min || 18,
                  filters.spouseAge?.max || 65,
                ]}
                onValueChange={(value) => {
                  handleNestedFilterChange('spouseAge', 'min', value[0]);
                  handleNestedFilterChange('spouseAge', 'max', value[1]);
                }}
                className="flex-1"
              />
              <Input
                type="number"
                value={filters.spouseAge?.max || ''}
                onChange={(e) =>
                  handleNestedFilterChange(
                    'spouseAge',
                    'max',
                    parseInt(e.target.value) || 65
                  )
                }
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Height Range (cm)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={filters.height?.min || ''}
                onChange={(e) =>
                  handleNestedFilterChange(
                    'height',
                    'min',
                    parseInt(e.target.value) || 150
                  )
                }
                className="w-20"
              />
              <Slider
                min={150}
                max={200}
                step={1}
                value={[filters.height?.min || 150, filters.height?.max || 200]}
                onValueChange={(value) => {
                  handleNestedFilterChange('height', 'min', value[0]);
                  handleNestedFilterChange('height', 'max', value[1]);
                }}
                className="flex-1"
              />
              <Input
                type="number"
                value={filters.height?.max || ''}
                onChange={(e) =>
                  handleNestedFilterChange(
                    'height',
                    'max',
                    parseInt(e.target.value) || 200
                  )
                }
                className="w-20"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={handleClearAll}>
            Clear All
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Apply Filters
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
