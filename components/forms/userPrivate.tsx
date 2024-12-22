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
import { useEffect, useState } from 'react';
import { CountryCodeSelector } from './fields/CountryCode';

const formSchema = z
  .object({
    userName: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters.',
      })
      .max(100),
    countryCode: z.number().nullable(),
    mobileNumber: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Mobile number must be a valid number',
      })
      .transform(Number)
      .refine((val) => val >= 1000000000 && val <= 9999999999, {
        message: 'Mobile number must be 10 digits.',
      })
      .nullable(),
    waliName: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters.',
      })
      .max(100),
    waliCountryCode: z.number().nullable(),
    waliMobileNumber: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Mobile number must be a valid number',
      })
      .transform(Number)
      .refine((val) => val >= 1000000000 && val <= 9999999999, {
        message: 'Mobile number must be 10 digits.',
      })
      .nullable(),
    dob: z.date({
      required_error: 'A date of birth is required.',
    }),
    gender: z.enum(['brother', 'sister']),
  })
  .refine((data) => data.mobileNumber !== data.waliMobileNumber, {
    message: 'Mobile number and Wali Mobile number must be different.',
    path: ['waliMobileNumber'],
  })
  .refine(
    (data) => {
      if (data.gender === 'brother') {
        // If gender is brother, mobileNumber is required and waliMobileNumber is optional
        return data.mobileNumber !== null;
      }
      if (data.gender === 'sister') {
        // If gender is sister, waliMobileNumber is required and mobileNumber is optional
        return data.waliMobileNumber !== null;
      }
      return true;
    },
    {
      message: 'Mobile number and Wali Mobile number validation failed.',
    }
  );
// z.string().max(5);
// z.string().min(5);
// z.string().length(5);
// z.string().email();
// z.string().url();
// z.string().date();
// z.string({
//   required_error: "Name is required",
//   invalid_type_error: "Name must be a string",
// });
// z.date().min(new Date("1900-01-01"), { message: "Too old" });
// z.date().max(new Date(), { message: "Too young!" });
// z.enum(["Admin", "User", "Trout"]);

export function PrivateForm() {
  const { userPrivateUpdate, userDataPrivate, loading } = useAuth();
  const [editing, setEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: userDataPrivate?.userName || 'Not Available',
      countryCode: userDataPrivate?.countryCode || null,
      mobileNumber:
        userDataPrivate?.mobileNumber?.toString() || 'Not Available',
      waliName: userDataPrivate?.waliName || 'Not Available',
      waliCountryCode: userDataPrivate?.waliCountryCode || null,
      waliMobileNumber:
        userDataPrivate?.waliMobileNumber?.toString() || 'Not Available',
      dob: userDataPrivate?.dob
        ? new Date(userDataPrivate.dob.seconds * 1000)
        : undefined,
      gender: userDataPrivate?.gender || 'brother',
    },
  });
  const { reset } = form;

  useEffect(() => {
    if (userDataPrivate) {
      reset({
        userName: userDataPrivate?.userName || 'Not Available',
        countryCode: userDataPrivate?.countryCode || null,
        mobileNumber:
          userDataPrivate?.mobileNumber?.toString() || 'Not Available',
        waliName: userDataPrivate?.waliName || 'Not Available',
        waliCountryCode: userDataPrivate?.waliCountryCode || null,
        waliMobileNumber:
          userDataPrivate?.waliMobileNumber?.toString() || 'Not Available',
        dob: userDataPrivate?.dob
          ? new Date(userDataPrivate.dob.seconds * 1000)
          : undefined,
        gender: userDataPrivate?.gender || 'brother',
      });
    }
  }, [userDataPrivate, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await userPrivateUpdate(values);
    setEditing(false);
  }
  if (loading) {
    return <>loading</>;
  }

  return (
    <>
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
            <CardContent className="space-y-2">
              <div className="md:flex md:gap-2">
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
                          <FormLabel className="min-w-32 ">Contact:</FormLabel>
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
              </div>

              <div className="md:flex md:gap-2">
                <FormField
                  control={form.control}
                  name="waliName"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center flex-grow">
                        <FormLabel className="min-w-32 ">Wali</FormLabel>
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
                    name="waliCountryCode"
                    render={({ field }) => (
                      <FormItem className="">
                        <div className="flex items-center">
                          <FormLabel className="min-w-32 ">Contact:</FormLabel>
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
              </div>
              <div className="md:flex md:gap-2 ">
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
