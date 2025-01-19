'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { parseMessages } from '@/lib/parseMessages';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CommaSeparatedInput } from '@/components/forms/fields/comma-separated-input';
import { CountryCodeSelector } from '@/components/forms/fields/CountryCode';
import { parse } from 'path';

const formSchema = z.object({
    // Public Info
    maritalStatus: z.string(),
    children: z.string(),
    nationality: z.string().optional(),
    countryResiding: z.string().optional(),
    countryMoving: z.string().optional(),
    languages: z.array(z.string()).optional(),
    beard: z.string().optional(),
    hijab: z.string().optional(),
    ethnicity: z.string().optional(),
    gender: z.enum(['male', 'female']),
    height: z.string().optional(),
    build: z.string().optional(),
    pray: z.string().optional(),
    born: z.string().optional(),
    sect: z.string().optional(),
    masjidName: z.string().optional(),
    scholars: z.array(z.string()).optional(),
    education: z.string().optional(),
    islamicEducation: z.string().optional(),
    islamicEducationProof: z.string().url().optional(),
    occupation: z.string().optional(),
    spouseAge: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }),
    polygamy: z.string().optional(),
    briefAboutYou: z.string().optional(),
    spouseBrief: z.string().optional(),

    // Private Info
    userName: z.string().optional(),
    dob: z.date().optional(),
    email: z.string().email().optional(),
    countryCode: z.string().optional(),
    mobileNumber: z.string().optional(),
    femaleMehramName: z.string().optional(),
    femaleMehramNumber: z.string().optional(),
    femaleMehramCountryCode: z.string().optional(),
    waliName: z.string().optional(),
    waliCountryCode: z.string().optional(),
    waliMobileNumber: z.string().optional(),
    maleMehramName: z.string().optional(),
    maleMehramNumber: z.string().optional(),
    maleMehramCountryCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddProfile() {
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState('');
    const [editing, setEditing] = useState(true);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            languages: [],
            scholars: [],
            spouseAge: { min: undefined, max: undefined },
        },
    });

    function onSubmit(values: FormValues) {
        console.log(values);
        // send the data to firestore
    }

    function handleMessageConvert() {
        const parsedData = parseMessages([message])[0];
        form.reset({
            ...form.getValues(),
            maritalStatus: parsedData['Marital status'],
            children: parsedData['Do you have children from previous marriage?'],
            nationality: parsedData['Nationality'],
            countryResiding: parsedData['Which country are you currently residing in?'],
            countryMoving: parsedData['Which countries you would consider moving to?'],
            languages: parsedData['Languages spoken'].split(/\s*(?:and|,|\s)\s*/),
            beard: parsedData['Beard'],
            hijab: parsedData['Hijab/Niqab'],
            ethnicity: parsedData['Ethnicity'],
            gender: parsedData['Gender'].toLowerCase() as 'male' | 'female',
            height: parsedData['Height'],
            build: parsedData['Build'],
            pray: parsedData['Do you pray 5xs a day?'],
            born: parsedData['Born Muslim or Revert'],
            sect: parsedData['Sect'],
            masjidName: parsedData['Name of Masjid'],
            scholars: parsedData['Scholars/speakers you listen to'].split(/\s*(?:and|,|\s)\s*/),
            education: parsedData['Education'],
            islamicEducation: parsedData['Islamic Education'],
            occupation: parsedData['Occupation'],
            polygamy: parsedData['Would you consider Polygamy'],
            briefAboutYou: parsedData['Brief description about you'],
            spouseBrief: parsedData['Your preference'],
        });
        setOpenDialog(false);
    }

    return (
        <div className="container mx-auto p-4">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline">Convert Message to Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] h-fit">
                    <DialogHeader>
                        <DialogTitle>Convert Message to Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            placeholder="Paste your message here"
                            value={message}
                            rows={20}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button onClick={handleMessageConvert}>Convert</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Public Info</CardTitle>
                            <CardDescription>
                                This information is Public and visible to anyone using Ilm Match.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="grid gap-8 md:grid-cols-2">

                                    {/* Personal Information */}
                                    <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-none">
                                        <h2 className="text-2xl font-bold text-primary">
                                            Personal Information
                                        </h2>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="maritalStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Marital Status</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="children"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Number of Children</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="nationality"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nationality</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="countryResiding"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country of Residence</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(
                                                                    !editing && 'disabled:cursor-default'
                                                                )}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="countryMoving"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country To Marry/Move in</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(
                                                                    !editing && 'disabled:cursor-default'
                                                                )}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="languages"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Languages</FormLabel>
                                                    <FormControl>
                                                        <CommaSeparatedInput
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Enter languages (comma-separated)"
                                                            editing={editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Appearance  */}
                                    <div className="space-y-4 bg-card md:p-6 rounded-lg shadow-none">
                                        <h2 className="text-2xl font-bold text-primary">Appearance</h2>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="beard"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Beard</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="hijab"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hijab</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">

                                            <FormField
                                                control={form.control}
                                                name="ethnicity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ethnicity</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel>Gender</FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="height"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Height (cm)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="build"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Build</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Religious */}
                                    <div className="space-y-4 bg-card md:p-6 rounded-lg">
                                        <h2 className="text-2xl font-bold text-primary">Religious</h2>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="pray"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Prayer Habits</FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="born"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Born or Revert</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className={cn(!editing && 'disabled:cursor-default')}
                                                                disabled={!editing}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="sect"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sect</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="masjidName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Masjid Name You Go To</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="scholars"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Scholars</FormLabel>
                                                    <FormControl>
                                                        <CommaSeparatedInput
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Enter scholars (comma-separated)"
                                                            editing={editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    {/* Educational */}
                                    <div className="space-y-4 bg-card md:p-6 rounded-lg">
                                        <h2 className="text-2xl font-bold text-primary">
                                            Education and Occupation
                                        </h2>
                                        <FormField
                                            control={form.control}
                                            name="education"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Education</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="islamicEducation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Islamic Education</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="islamicEducationProof"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Islamic Education Proof</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="url"
                                                            placeholder="https://example.com/proof"
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Provide a link to your Islamic education certificate or
                                                        proof
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="occupation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Occupation</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>

                                <div className="space-y-4 bg-card md:p-6 rounded-lg md:col-span-2">
                                    <h2 className="text-2xl font-bold text-primary">
                                        Spouse Preferences & About
                                    </h2>
                                    <div className='grid gap-8 md:grid-cols-2'>
                                        <FormField
                                            control={form.control}
                                            name="polygamy"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Will you consider Polygamy</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className={cn(!editing && 'disabled:cursor-default')}
                                                            disabled={!editing}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-2">
                                            <Label className="min-w-fit">Spouse Age:</Label>
                                            <div className='flex gap-2 justify-center items-center'>
                                                <FormField
                                                    control={form.control}
                                                    name="spouseAge.min"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Min"
                                                                    onChange={(e) =>
                                                                        field.onChange(
                                                                            e.target.value === ''
                                                                                ? undefined
                                                                                : +e.target.value
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        !editing && 'disabled:cursor-default'
                                                                    )}
                                                                    disabled={!editing}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="spouseAge.max"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Max"
                                                                    onChange={(e) =>
                                                                        field.onChange(
                                                                            e.target.value === ''
                                                                                ? undefined
                                                                                : +e.target.value
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        !editing && 'disabled:cursor-default'
                                                                    )}
                                                                    disabled={!editing}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="briefAboutYou"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brief About You</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about yourself"
                                                        className={cn(
                                                            !editing && 'disabled:cursor-default resize-none'
                                                        )}
                                                        disabled={!editing}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="spouseBrief"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brief About Desired Spouse</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe your ideal spouse"
                                                        className={cn(
                                                            !editing && 'disabled:cursor-default resize-none'
                                                        )}
                                                        disabled={!editing}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Private Info</CardTitle>
                            <CardDescription>
                                This information is private and not shown to anyone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-4 flex-1">
                                        <div className="flex items-center flex-grow">
                                            <FormLabel className="min-w-32 ">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name"
                                                    {...field}
                                                    className={cn(
                                                        'flex-grow w-full',
                                                        !editing &&
                                                        'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                                                    )}
                                                    disabled={!editing}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="countryCode"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormLabel className="min-w-32 ">
                                                    Contact:
                                                </FormLabel>
                                                <FormControl>
                                                    <CountryCodeSelector
                                                        onChange={(e) => field.onChange(e)}
                                                        defaultCode={field.value !== undefined ? parseInt(field.value) : null}
                                                        editing={editing}
                                                        className={cn(
                                                            !editing &&
                                                            'pointer-events-none opacity-50 cursor-default'
                                                        )}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mobile Number"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        value={field.value ?? ''}
                                                        className={cn(
                                                            'flex-grow',
                                                            !editing &&
                                                            'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                                                        )}
                                                        disabled={!editing}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col ">
                                        <div className="flex items-center">
                                            <FormLabel className="min-w-32">
                                                Date of birth
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-[240px] pl-3 text-left font-normal flex-grow',
                                                                !field.value && 'text-muted-foreground',
                                                                !editing && 'border-none justify-start'
                                                            )}
                                                            disabled={!editing}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, 'PPP')
                                                            ) : (
                                                                <span>dob not selected</span>
                                                            )}
                                                            {editing && (
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() ||
                                                            date < new Date('1940-01-01')
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                {...field}
                                                className={cn(!editing && 'disabled:cursor-default')}
                                                disabled={!editing}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="femaleMehramName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Female Mehram Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className={cn(!editing && 'disabled:cursor-default')}
                                                disabled={!editing}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="femaleMehramCountryCode"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormLabel className="min-w-32 ">
                                                    Mehram Contact:
                                                </FormLabel>
                                                <FormControl>
                                                    <CountryCodeSelector
                                                        onChange={(e) => field.onChange(e)}
                                                        defaultCode={field.value !== undefined ? parseInt(field.value) : null}
                                                        editing={editing}
                                                        className={cn(
                                                            !editing &&
                                                            'pointer-events-none opacity-50 cursor-default'
                                                        )}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="femaleMehramNumber"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Female Mehram Number"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        value={field.value ?? ''}
                                                        className={cn(
                                                            'flex-grow',
                                                            !editing &&
                                                            'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                                                        )}
                                                        disabled={!editing}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="waliName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wali Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className={cn(!editing && 'disabled:cursor-default')}
                                                disabled={!editing}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="waliCountryCode"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormLabel className="min-w-32 ">
                                                    Wali Contact:
                                                </FormLabel>
                                                <FormControl>
                                                    <CountryCodeSelector
                                                        onChange={(e) => field.onChange(e)}
                                                        defaultCode={field.value !== undefined ? parseInt(field.value) : null}
                                                        editing={editing}
                                                        className={cn(
                                                            !editing &&
                                                            'pointer-events-none opacity-50 cursor-default'
                                                        )}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="waliMobileNumber"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Wali Mobile Number"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        value={field.value ?? ''}
                                                        className={cn(
                                                            'flex-grow',
                                                            !editing &&
                                                            'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                                                        )}
                                                        disabled={!editing}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="maleMehramName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Male Mehram Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className={cn(!editing && 'disabled:cursor-default')}
                                                disabled={!editing}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="maleMehramCountryCode"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormLabel className="min-w-32 ">
                                                    Mehram Contact:
                                                </FormLabel>
                                                <FormControl>
                                                    <CountryCodeSelector
                                                        onChange={(e) => field.onChange(e)}
                                                        defaultCode={field.value !== undefined ? parseInt(field.value) : null}
                                                        editing={editing}
                                                        className={cn(
                                                            !editing &&
                                                            'pointer-events-none opacity-50 cursor-default'
                                                        )}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maleMehramNumber"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex items-center">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Male Mehram Number"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        value={field.value ?? ''}
                                                        className={cn(
                                                            'flex-grow',
                                                            !editing &&
                                                            'inline outline-none border-none disabled:text-foreground disabled:cursor-default'
                                                        )}
                                                        disabled={!editing}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={!editing}>
                        {editing ? 'Save Profile' : 'Edit Profile'}
                    </Button>
                </form>
            </Form>
        </div >
    );
}

