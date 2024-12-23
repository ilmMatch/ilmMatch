'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { use, useEffect, useState } from 'react';
import { CountryCodeSelector } from './fields/CountryCode';
import {
  userPrivateSchema,
  UserPrivateFormValues,
} from '@/lib/schemas/userPrivateSchema';
import { toast } from 'sonner';
import { badgeVariants } from '../ui/badge';

export function PrivateForm() {
  const { userPrivateUpdate, userDataPrivate, loading, userDataProfile } =
    useAuth();
  const [editing, setEditing] = useState(false);

  const form = useForm<UserPrivateFormValues>({
    resolver: zodResolver(userPrivateSchema),
    defaultValues: {
      userName: userDataPrivate?.userName || 'Not Provided',
      dob: userDataPrivate?.dob
        ? new Date(userDataPrivate.dob.seconds * 1000)
        : undefined,
      gender: userDataPrivate?.gender || 'sister',
      ...(userDataPrivate?.gender === 'brother'
        ? {
            countryCode: userDataPrivate?.countryCode || undefined,
            mobileNumber:
              userDataPrivate?.mobileNumber?.toString() || 'Not Provided',
            femaleMehramName: userDataPrivate?.femaleMehramName || '',
            femaleMehramNumber:
              userDataPrivate?.femaleMehramNumber?.toString() || '',
            femaleMehramCountryCode:
              userDataPrivate?.femaleMehramCountryCode || undefined,
          }
        : {
            waliName: userDataPrivate?.waliName || 'Not Provided',
            waliCountryCode: userDataPrivate?.waliCountryCode || undefined,
            waliMobileNumber:
              userDataPrivate?.waliMobileNumber?.toString() || 'Not Provided',
            maleMehramName: userDataPrivate?.maleMehramName || 'Not Provided',
            maleMehramNumber:
              userDataPrivate?.maleMehramNumber?.toString() || '',
            maleMehramCountryCode:
              userDataPrivate?.maleMehramCountryCode || undefined,
          }),
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (userDataPrivate) {
      reset({
        userName: userDataPrivate?.userName || 'Not Available',
        dob: userDataPrivate?.dob
          ? new Date(userDataPrivate.dob.seconds * 1000)
          : undefined,
        gender: userDataPrivate?.gender || 'sister',
        ...(userDataPrivate?.gender === 'brother'
          ? {
              countryCode: userDataPrivate?.countryCode || undefined,
              mobileNumber:
                userDataPrivate?.mobileNumber?.toString() || 'Not Provided',
              femaleMehramName: userDataPrivate?.femaleMehramName || '',
              femaleMehramNumber:
                userDataPrivate?.femaleMehramNumber?.toString() || '',
              femaleMehramCountryCode:
                userDataPrivate?.femaleMehramCountryCode || undefined,
            }
          : {
              waliName: userDataPrivate?.waliName || 'Not Provided',
              waliCountryCode: userDataPrivate?.waliCountryCode || undefined,
              waliMobileNumber:
                userDataPrivate?.waliMobileNumber?.toString() || 'Not Provided',
              maleMehramName: userDataPrivate?.maleMehramName || 'Not Provided',
              maleMehramNumber:
                userDataPrivate?.maleMehramNumber?.toString() || '',
              maleMehramCountryCode:
                userDataPrivate?.maleMehramCountryCode || undefined,
            }),
      });
    }
  }, [userDataPrivate, reset]);

  async function onSubmit(values: UserPrivateFormValues) {
    const sanitizedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value ?? ''])
    ) as UserPrivateFormValues;

    const result = await userPrivateUpdate(sanitizedValues);
    if (!result.success) {
      toast.error('Uh oh! Something went wrong.', {
        description: result.error,
      });
      setEditing(false);
      return;
    }

    toast.success('Success', {
      description: 'Your profile has been updated',
    });
    setEditing(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader className="relative">
              <CardTitle>Contact Info</CardTitle>
              <CardDescription>
                This information is private and not shown to anyone. Click save
                when you're done.
              </CardDescription>
              <span
                className={cn(
                  'absolute top-2 right-2 capitalize',
                  userDataProfile?.approved === 'requested' &&
                    badgeVariants({ variant: 'requested' }),
                  userDataProfile?.approved === 'approved' &&
                    badgeVariants({ variant: 'approved' }),
                  userDataProfile?.approved === 'notApproved' &&
                    badgeVariants({ variant: 'notApproved' })
                )}
              >
                {userDataProfile?.approved}
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {userDataPrivate?.gender === 'brother' && (
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
                                // onChange={handleUserPhoneChange}
                                onChange={(e) => field.onChange(e)}
                                defaultCode={field.value}
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
                )}
                {userDataPrivate?.gender === 'sister' && (
                  <FormField
                    control={form.control}
                    name="waliName"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center flex-grow">
                          <FormLabel className="min-w-32 ">Wali Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Wali Name"
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
                )}
                {userDataPrivate?.gender === 'sister' && (
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="waliCountryCode"
                      render={({ field }) => (
                        <FormItem className="">
                          <div className="flex items-center">
                            <FormLabel className="min-w-32 ">
                              {' '}
                              Wali Contact:
                            </FormLabel>
                            <FormControl>
                              <CountryCodeSelector
                                // onChange={handleUserPhoneChange}
                                onChange={(e) => field.onChange(e)}
                                defaultCode={field.value}
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
                              {/* <CountryCodeSelector
                            onChange={handleUserPhoneChange}
                            className={cn(
                              !editing &&
                              'pointer-events-none opacity-50 cursor-default'
                            )}
                          /> */}
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {userDataPrivate?.gender === 'brother' && (
                  <FormField
                    control={form.control}
                    name="femaleMehramName"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center flex-grow">
                          <FormLabel className="min-w-32 ">
                            Female Mehram
                          </FormLabel>
                          <FormControl>
                            <Input
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
                )}
                {userDataPrivate?.gender === 'brother' && (
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
                                // onChange={handleUserPhoneChange}
                                onChange={(e) => field.onChange(e)}
                                defaultCode={field.value}
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
                )}

                {userDataPrivate?.gender === 'sister' && (
                  <FormField
                    control={form.control}
                    name="maleMehramName"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center flex-grow">
                          <FormLabel className="min-w-32 ">
                            Male Mehram
                          </FormLabel>
                          <FormControl>
                            <Input
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
                )}
                {userDataPrivate?.gender === 'sister' && (
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
                                // onChange={handleUserPhoneChange}
                                onChange={(e) => field.onChange(e)}
                                defaultCode={field.value}
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
                )}

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
                              defaultMonth={
                                new Date(
                                  new Date().getFullYear(),
                                  getMonth(new Date())
                                )
                              }
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1940-01-01')
                              }
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1920}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormDescription className="mt-auto">
                  Your date of birth is used to calculate your age.{' '}
                  <span className="md:block">
                    Age will be publicly displayed.
                  </span>
                </FormDescription>
              </div>
            </CardContent>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="">
                  <div className="">
                    <FormControl>
                      <Input {...field} className="hidden" disabled />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter>
              {editing && (
                <span className="flex gap-2 ">
                  {' '}
                  <Button type="submit">Save changes</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      reset();
                      setEditing(false);
                    }}
                  >
                    cancel
                  </Button>
                </span>
              )}
              {!editing && (
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
    </>
  );
}
