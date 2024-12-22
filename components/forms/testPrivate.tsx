'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, getMonth } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
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
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthProvider';
import { useEffect, useState } from 'react';
import { CountryCodeSelector } from './fields/CountryCode';
import { userPrivateSchema, UserPrivateFormValues } from '@/lib/schemas/userPrivateSchema';

export function PrivateForm() {
    const { userPrivateUpdate, userDataPrivate, loading } = useAuth();
    const [editing, setEditing] = useState(false);

    const form = useForm<UserPrivateFormValues>({
        resolver: zodResolver(userPrivateSchema),
        defaultValues: {
            userName: userDataPrivate?.userName || 'Not Available',
            dob: userDataPrivate?.dob
                ? new Date(userDataPrivate.dob.seconds * 1000)
                : undefined,
            gender: userDataPrivate?.gender || 'sister',
            ...(userDataPrivate?.gender === 'brother' ? {
                countryCode: userDataPrivate?.countryCode || null,
                mobileNumber: userDataPrivate?.mobileNumber?.toString() || '',
                femaleMehramName: userDataPrivate?.femaleMehramName || '',
                femaleMehramNumber: userDataPrivate?.femaleMehramNumber?.toString() || '',
                femaleMehramCountryCode: userDataPrivate?.femaleMehramCountryCode || null,
            } : {
                waliName: userDataPrivate?.waliName || '',
                waliCountryCode: userDataPrivate?.waliCountryCode || null,
                waliMobileNumber: userDataPrivate?.waliMobileNumber?.toString() || '',
                maleMehramName: userDataPrivate?.maleMehramName || '',
                maleMehramNumber: userDataPrivate?.maleMehramNumber?.toString() || '',
                maleMehramCountryCode: userDataPrivate?.maleMehramCountryCode || null,
            }),
        },
    });

    const { reset, watch } = form;
    const gender = watch('gender');

    useEffect(() => {
        if (userDataPrivate) {
            reset({
                userName: userDataPrivate?.userName || 'Not Available',
                countryCode: userDataPrivate?.countryCode || null,
                dob: userDataPrivate?.dob
                    ? new Date(userDataPrivate.dob.seconds * 1000)
                    : undefined,
                gender: userDataPrivate?.gender || 'brother',
                ...(userDataPrivate?.gender === 'brother' ? {
                    mobileNumber: userDataPrivate?.mobileNumber?.toString() || '',
                    femaleMehramName: userDataPrivate?.femaleMehramName || '',
                    femaleMehramNumber: userDataPrivate?.femaleMehramNumber?.toString() || '',
                } : {
                    waliName: userDataPrivate?.waliName || '',
                    waliCountryCode: userDataPrivate?.waliCountryCode || null,
                    waliMobileNumber: userDataPrivate?.waliMobileNumber?.toString() || '',
                    maleMehramName: userDataPrivate?.maleMehramName || '',
                    maleMehramNumber: userDataPrivate?.maleMehramNumber?.toString() || '',
                }),
            });
        }
    }, [userDataPrivate, reset]);

    async function onSubmit(values: UserPrivateFormValues) {
        // await userPrivateUpdate(values);
        console.log("form", values);
        setEditing(false);
    }

    if (loading) {
        return <>loading</>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Info</CardTitle>
                        <CardDescription>
                            This information is private and not shown to anyone. Click save
                            when you're done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={!editing}
                                            className={cn(!editing && 'border-none')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="countryCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country Code</FormLabel>
                                    <FormControl>
                                        <CountryCodeSelector
                                            onChange={(e) => field.onChange(e)}
                                            defaultCode={field.value}
                                            editing={editing}
                                            className={cn(!editing && 'pointer-events-none opacity-50')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {gender === 'brother' && (

                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                disabled={!editing}
                                                className={cn(!editing && 'border-none')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {gender === 'sister' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="waliName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Wali Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="waliCountryCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Wali Country Code</FormLabel>
                                            <FormControl>
                                                <CountryCodeSelector
                                                    onChange={(e) => field.onChange(e)}
                                                    defaultCode={field.value}
                                                    editing={editing}
                                                    className={cn(!editing && 'pointer-events-none opacity-50')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="waliMobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Wali Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {gender === 'brother' && (
                            <>

                                <FormField
                                    control={form.control}
                                    name="femaleMehramName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Female Mehram Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="femaleMehramCountryCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country Code</FormLabel>
                                            <FormControl>
                                                <CountryCodeSelector
                                                    onChange={(e) => field.onChange(e)}
                                                    defaultCode={field.value}
                                                    editing={editing}
                                                    className={cn(!editing && 'pointer-events-none opacity-50')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="femaleMehramNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Female Mehram Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {gender === 'sister' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="maleMehramName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Male Mehram Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maleMehramNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Male Mehram Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    disabled={!editing}
                                                    className={cn(!editing && 'border-none')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                    disabled={!editing}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date('1940-01-01')
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Your date of birth is used to calculate your age.
                                        Age will be publicly displayed.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        {editing ? (
                            <>
                                <Button type="submit">Save changes</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setEditing(false);
                                    }}
                                    className="ml-2"
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

